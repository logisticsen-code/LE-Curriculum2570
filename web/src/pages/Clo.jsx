import { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { PageHead, Section, PloChip, YloChip, IRM, Warn, MajorTag } from "./ui.jsx";
import { useMajor } from "../major.jsx";
import { MAPPING, COURSE, plosOf, majorsOf, ploColor, ploShort } from "../lib.js";

/* แผนที่ CLO → YLO → PLO รายภาค + roll-up จำนวน CLO ต่อ PLO (SRS: FR-14) */
export default function Clo() {
  const { major } = useMajor();
  const [view, setView] = useState("rollup");
  const mjs = majorsOf(major);

  return (
    <main>
      <PageHead eyebrow="ผลลัพธ์การเรียนรู้" title="แผนที่ CLO → YLO → PLO"
        lead="ทุกแถวคือ CLO หนึ่งข้อของรายวิชาในแผนการเรียน ระบุ YLO และ PLO ที่ส่งเข้า ตามหมวด 4.5 ของเล่ม"
        crumbs={[{ label: "แผนที่ CLO" }]} />
      <div className="wrap">
        <div className="warnlist" style={{ marginTop: 14 }}>
          <Warn iss="ISS-01">เล่มกำหนดระดับ I/R/M เพียง 2 จาก 257 แถว — ช่อง "ระดับ" ส่วนใหญ่จึงว่าง</Warn>
          <Warn iss="ISS-16">วิชาชีพเลือกและวิชาศึกษาทั่วไปไม่อยู่ในแผนที่นี้</Warn>
        </div>
        <div className="toolbar">
          <button className={"fbtn" + (view === "rollup" ? " on" : "")} onClick={() => setView("rollup")}>สรุปต่อ PLO</button>
          <button className={"fbtn" + (view === "table" ? " on" : "")} onClick={() => setView("table")}>ตารางรายภาค</button>
        </div>

        {view === "rollup" && mjs.map(mj => {
          const rows = MAPPING[mj];
          const plos = plosOf(mj);
          const max = Math.max(...plos.map(p => rows.filter(r => r.plo === p.id).length), 1);
          return (
            <Section key={mj} id={`rollup-${mj}`} title={`จำนวน CLO ต่อ PLO · วิชาเอก ${mj}`} sub={`${rows.length} CLO จาก ${new Set(rows.map(r => r.code)).size} รายวิชา`}>
              <div className="tblwrap">
                <table className="tbl">
                  <thead><tr><th>PLO</th><th>CLO</th><th style={{ width: "45%" }}>สัดส่วน</th><th className="r">รายวิชา</th><th>ปีที่พบ</th><th className="c">มีระดับ M</th></tr></thead>
                  <tbody>
                    {plos.map(p => {
                      const r = rows.filter(x => x.plo === p.id);
                      const yrs = [...new Set(r.map(x => x.year))].sort();
                      return (
                        <tr key={p.id}>
                          <td><PloChip id={p.id} small /></td>
                          <td className="r"><b>{r.length}</b></td>
                          <td><div style={{ height: 10, borderRadius: 5, width: `${(r.length / max) * 100}%`, background: ploColor(p.id), minWidth: r.length ? 4 : 0 }} />
                            <span className="sub">{((r.length / rows.length) * 100).toFixed(1)}%</span></td>
                          <td className="r">{new Set(r.map(x => x.code)).size}</td>
                          <td>{yrs.map(y => `ปี ${y}`).join(" · ") || "—"}</td>
                          <td className="c">{r.some(x => x.level === "M") ? "✅" : "❌"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Section>
          );
        })}

        {view === "table" && mjs.map(mj => {
          const rows = MAPPING[mj];
          const sems = [...new Set(rows.map(r => `${r.year}-${r.sem}`))];
          return (
            <Section key={mj} id={`table-${mj}`} title={<>แผนที่รายภาค <MajorTag m={mj} /></>}>
              <div className="tblwrap">
                <table className="tbl">
                  <thead><tr><th>รายวิชา</th><th>CLO</th><th>YLO</th><th>PLO</th><th>ระดับ</th></tr></thead>
                  <tbody>
                    {sems.map(s => {
                      const [y, se] = s.split("-");
                      const rs = rows.filter(r => `${r.year}-${r.sem}` === s);
                      return (
                        <Fragment key={s}>
                          <tr className="total"><td colSpan={5}>ปี {y} ภาค {se} · {rs.length} CLO</td></tr>
                          {rs.map((r, i) => (
                            <tr key={i}>
                              <td><Link className="lnk" to={`/courses/${r.code}`}>{r.code}</Link><span className="sub">{COURSE[r.code]?.th || r.name}</span></td>
                              <td>CLO{r.clo ?? "?"} <span className="sub">{r.cloText}</span></td>
                              <td><YloChip id={r.ylo} /></td>
                              <td><PloChip id={r.plo} small /></td>
                              <td>{r.level ? <IRM v={r.level} /> : <span className="mut">—</span>}</td>
                            </tr>
                          ))}
                        </Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Section>
          );
        })}
        <p className="hint">ค่า PLO ในตารางนี้แสดงเป็น {ploShort("PLO_LE1")} = PLO_LE1 · คลิกป้ายเพื่อเปิดรายละเอียด</p>
      </div>
    </main>
  );
}
