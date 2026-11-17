import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { Link } from "react-router-dom";
import { COURSE, PLANS, MAJOR, YEAR_COLOR, ylosOf } from "./lib.js";
import "./planboard.css";

/* กระดานแผนการเรียน 8 ภาคในภาพเดียว (port จาก template KSU-AI-EN/PlanBoard.jsx)
   - ความสูงของบล็อก = จำนวนหน่วยกิต · คลิกรายวิชาเพื่อเปิดหน้ารายวิชา
   - คลิกสีในคำอธิบายเพื่อไฮไลต์เฉพาะกลุ่ม
   - ปุ่มเต็มจอใช้ Fullscreen API และย่อกระดานให้พอดีจอ (มี fallback เป็น overlay เมื่อเบราว์เซอร์ไม่อนุญาต) */

const LEGEND = [
  { k: "ge", label: "ศึกษาทั่วไป", c: "var(--g-ge)" },
  { k: "sci", label: "วิทย์–คณิต", c: "var(--g-sci)" },
  { k: "engfund", label: "พื้นฐานวิศวกรรม", c: "var(--g-engfund)" },
  { k: "core", label: "วิชาชีพบังคับร่วม", c: "var(--g-core)" },
  { k: "major", label: "บังคับเอก", c: null },               // สีตามวิชาเอก
  { k: "exp", label: "ประสบการณ์วิชาชีพ", c: "var(--g-exp)" },
  { k: "pe", label: "วิชาชีพเลือก", c: "var(--g-el)" },
  { k: "free", label: "เลือกเสรี", c: "var(--g-free)" },
];

/* รายการในแผน → กลุ่มบนกระดาน (รายการที่เล่มยังไม่ระบุรหัส เช่น GE-002-140xx ใช้หมวดจากตาราง) */
function legendKey(e) {
  const g = COURSE[e.code]?.group;
  if (g) {
    if (g.startsWith("ge")) return "ge";
    if (g === "ie" || g === "sc") return "major";
    if (g.startsWith("el")) return "pe";
    return g;
  }
  if (/เลือกเสรี/.test(e.category)) return "free";
  if (/วิชาชีพเลือก/.test(e.category)) return "pe";
  if (/ศึกษาทั่วไป/.test(e.category)) return "ge";
  return "ge";
}
const crOf = s => Number(String(s).match(/^(\d+)/)?.[1] || 0);

export default function PlanBoard({ major }) {
  const plan = PLANS[major];
  const [hl, setHl] = useState(null);
  const [full, setFull] = useState(false);
  const [k, setK] = useState(1);
  const pbRef = useRef(null), fitRef = useRef(null), boardRef = useRef(null);
  const color = key => key === "major" ? `var(--${major.toLowerCase()})` : LEGEND.find(l => l.k === key)?.c;

  const openFull = () => {
    pbRef.current?.requestFullscreen?.().catch(() => {});
    setFull(true);
  };
  const closeFull = () => {
    if (document.fullscreenElement) document.exitFullscreen?.();
    setFull(false);
  };

  /* ออกจากโหมดเต็มจอเมื่อผู้ใช้ออกจาก fullscreen ของเบราว์เซอร์เอง */
  useEffect(() => {
    const onFs = () => { if (!document.fullscreenElement) setFull(false); };
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  /* ล็อกการเลื่อนหน้าหลัก และรับ Esc กรณีเบราว์เซอร์ไม่อนุญาต fullscreen จริง */
  useEffect(() => {
    if (!full) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = e => { if (e.key === "Escape") closeFull(); };
    document.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; document.removeEventListener("keydown", onKey); };
  }, [full]);

  /* ย่อกระดานให้พอดีพื้นที่ เพื่อเห็นครบทั้งหลักสูตรโดยไม่ต้องเลื่อน */
  useLayoutEffect(() => {
    if (!full) { setK(1); return; }
    const fit = () => {
      const box = fitRef.current, board = boardRef.current;
      if (!box || !board) return;
      const bw = board.offsetWidth, bh = board.offsetHeight;
      if (!bw || !bh) return;
      setK(Math.min(box.clientWidth / bw, box.clientHeight / bh));
    };
    fit();
    const t = setTimeout(fit, 150);
    window.addEventListener("resize", fit);
    return () => { clearTimeout(t); window.removeEventListener("resize", fit); };
  }, [full, major]);

  const used = new Set(plan.flatMap(s => s.courses.map(legendKey)));
  const ylos = ylosOf(major);

  return (
    <div className={`pb${full ? " full" : ""}`} ref={pbRef} style={{ "--k": k }}>
      <div className="pb-legend">
        {full && <b className="pb-title">แผนการเรียน · {MAJOR[major].th}</b>}
        {LEGEND.filter(l => used.has(l.k)).map(l => (
          <button key={l.k} className={`pb-lg${hl === l.k ? " on" : ""}`} style={{ "--gc": color(l.k) }}
            aria-pressed={hl === l.k} onClick={() => setHl(hl === l.k ? null : l.k)}>
            <i /> {l.k === "major" ? `${l.label} ${major}` : l.label}
          </button>
        ))}
        {hl && <button className="pb-clear" onClick={() => setHl(null)}>✕ แสดงทุกกลุ่ม</button>}
        {full
          ? <button className="pb-fs" onClick={closeFull}>✕ ออกจากเต็มจอ (Esc)</button>
          : <button className="pb-fs" onClick={openFull}>⛶ ดูเต็มจอ</button>}
      </div>

      <div className="pb-scroll" ref={fitRef}>
        <div className="pb-board" ref={boardRef}>
          {[1, 2, 3, 4].map(y => {
            const sems = plan.filter(s => s.year === y);
            const ycr = sems.reduce((a, s) => a + (s.credits || 0), 0);
            const nYlo = ylos.filter(o => o.year === y).length;
            return (
              <div className="pb-year" key={y} style={{ "--yc": YEAR_COLOR[y] }}>
                <div className="pb-yhead">
                  <Link to={`/ylo?major=${major}#y${y}`} className="pb-ytitle">
                    <b>ชั้นปีที่ {y}</b>
                    <span>{nYlo} YLO{y === 4 ? " (ร่วมทั้งสองวิชาเอก)" : ` · ${major}`}</span>
                  </Link>
                  <span className="pb-ycr">{ycr} นก.</span>
                </div>
                <div className="pb-sems">
                  {[1, 2].map(sn => {
                    const s = sems.find(x => x.sem === sn);
                    if (!s) return <div className="pb-sem empty" key={sn}><div className="pb-shead"><b>ภาค {sn}</b><span>—</span></div></div>;
                    const coop = s.courses.some(e => e.code === "EN-788-17002");
                    return (
                      <div className="pb-sem" key={sn}>
                        <div className="pb-shead"><b>ภาค {sn}</b><span>{s.credits} นก.</span></div>
                        <div className="pb-stitle">สะสม {s.cumulative} นก.{coop ? " · สหกิจศึกษา" : ""}</div>
                        <div className="pb-stack">
                          {s.courses.map((e, i) => {
                            const key = legendKey(e);
                            const c = COURSE[e.code];
                            const cr = crOf(e.credits);
                            const dim = hl && key !== hl;
                            const style = { "--gc": color(key), minHeight: 26 + cr * 7 };
                            if (!c) {
                              return (
                                <div key={i} className={`pb-c ghost${dim ? " dim" : ""}`} style={style} title={`${e.name} · ${cr} นก. (เลือกจากกลุ่ม)`}>
                                  <span className="pb-code">{e.code}</span>
                                  <span className="pb-nm">{e.name}</span>
                                  <span className="pb-cr">{cr}</span>
                                </div>
                              );
                            }
                            return (
                              <Link key={i} to={`/courses/${c.code}`} className={`pb-c${dim ? " dim" : ""}`} style={style}
                                title={`${c.code} ${c.th} · ${c.credits}`}>
                                <span className="pb-code">{c.code}</span>
                                <span className="pb-nm">{c.th}</span>
                                <span className="pb-cr">{cr}</span>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pb-foot">
        <span>วิชาเอก {major} · รวม <b>{plan.at(-1)?.cumulative}</b> นก. · {plan.length} ภาคการศึกษา</span>
        <span className="pb-hint">ความสูงของบล็อก = จำนวนหน่วยกิต · กรอบเส้นประ = วิชาที่เลือกจากกลุ่ม · คลิกสีเพื่อกรองกลุ่ม</span>
      </div>
    </div>
  );
}
