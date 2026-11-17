import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { PageHead, GroupTag, PloChip, MajorTag } from "./ui.jsx";
import { useMajor, inMajor } from "../major.jsx";
import { COURSES, GROUPS, GROUP_SHORT, plosOf, ploShort } from "../lib.js";

/* รายวิชาทั้งหมด — ค้นหาและกรองตามกลุ่ม ชั้นปี และ PLO (SRS: FR-05) */
export default function Courses() {
  const { major } = useMajor();
  const [sp, setSp] = useSearchParams();
  const [q, setQ] = useState(sp.get("q") || "");
  const g = sp.get("g") || "all";
  const y = sp.get("y") || "all";
  const plo = sp.get("plo") || "all";
  const setParam = (k, v) => { const n = new URLSearchParams(sp); v === "all" ? n.delete(k) : n.set(k, v); setSp(n, { replace: true }); };

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return COURSES.filter(c => inMajor(major, c.majors))
      .filter(c => g === "all" || c.group === g)
      .filter(c => y === "all" || Object.values(c.plan).some(p => String(p.year) === y))
      .filter(c => plo === "all" || c.plos.includes(plo))
      .filter(c => !s || (c.code + " " + c.th + " " + c.en + " " + c.descTh + " " + c.descEn).toLowerCase().includes(s));
  }, [q, g, y, plo, major]);

  const groups = GROUPS.filter(x => !x.major || inMajor(major, [x.major]));

  return (
    <main>
      <PageHead eyebrow="หลักสูตร" title="รายวิชา"
        lead="คำอธิบายรายวิชาไทย–อังกฤษ ผลลัพธ์การเรียนรู้รายวิชา (CLO) และ PLO ที่แต่ละวิชาส่งเข้า — กรองตามวิชาเอกได้จากปุ่มด้านบน"
        crumbs={[{ label: "รายวิชา" }]} />
      <div className="wrap">
        <div className="toolbar">
          <input type="search" placeholder="ค้นหารหัส ชื่อวิชา หรือคำในคำอธิบาย เช่น คลังสินค้า, simulation"
            value={q} onChange={e => { setQ(e.target.value); setParam("q", e.target.value || "all"); }} aria-label="ค้นหารายวิชา" />
        </div>
        <div className="toolbar" role="group" aria-label="กรองตามกลุ่มวิชา">
          <button className={"fbtn" + (g === "all" ? " on" : "")} onClick={() => setParam("g", "all")}>ทุกกลุ่ม</button>
          {groups.map(x => (
            <button key={x.id} className={"fbtn" + (g === x.id ? " on" : "")} onClick={() => setParam("g", x.id)}>{GROUP_SHORT[x.id]}</button>
          ))}
        </div>
        <div className="toolbar">
          <label className="hint" style={{ margin: 0 }}>ชั้นปี{" "}
            <select value={y} onChange={e => setParam("y", e.target.value)}>
              <option value="all">ทุกชั้นปี</option>{[1, 2, 3, 4].map(n => <option key={n} value={n}>ปี {n}</option>)}
            </select>
          </label>
          <label className="hint" style={{ margin: 0 }}>PLO{" "}
            <select value={plo} onChange={e => setParam("plo", e.target.value)}>
              <option value="all">ทุก PLO</option>
              {plosOf(major).map(p => <option key={p.id} value={p.id}>{ploShort(p.id)}</option>)}
            </select>
          </label>
          <span className="count">{list.length} รายวิชา</span>
        </div>

        <div className="coursegrid" style={{ marginTop: 14 }}>
          {list.map(c => {
            const plos = c.plos.filter(p => plosOf(major).some(x => x.id === p));
            return (
              <Link key={c.code} to={`/courses/${c.code}`} className={`ccard g-${c.group}`}>
                <div className="cc-head"><span className="cc-code">{c.code}</span><span className="cc-cr">{c.credits}</span></div>
                <b className="cc-t">{c.th}</b>
                <span className="cc-e">{c.en}</span>
                <p className="cc-d">{c.descTh || <i>ไม่มีคำอธิบายรายวิชาในเล่ม</i>}</p>
                <div className="cc-foot">
                  <GroupTag g={c.group} />
                  {c.majors.length === 1 && <MajorTag m={c.majors[0]} />}
                  {Object.entries(c.plan).filter(([mj]) => inMajor(major, [mj])).slice(0, 1).map(([mj, p]) => (
                    <span key={mj} className="semtag">ปี {p.year} · ภาค {p.sem}</span>
                  ))}
                  {plos.map(p => <PloChip key={p} id={p} small link={false} />)}
                  {(c.warn.length > 0 || c.issues.length > 0) && <span className="warn-badge"><i>⚠</i>{c.issues.join(", ") || "ข้อมูลไม่ครบ"}</span>}
                </div>
              </Link>
            );
          })}
          {list.length === 0 && <div className="note">ไม่พบรายวิชาที่ตรงกับเงื่อนไข</div>}
        </div>
      </div>
    </main>
  );
}
