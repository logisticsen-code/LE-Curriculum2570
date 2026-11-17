import { Link } from "react-router-dom";
import { PageHead, Section, PloChip, Warn } from "./ui.jsx";
import { useMajor } from "../major.jsx";
import { plosOf, ylosOf, mapRows } from "../lib.js";
import { ACTIVITIES } from "../generated/program.js";
import ObeAlluvial from "./ObeAlluvial.jsx";

/* สายธาร OBE: ความต้องการ → PLO → YLO → CLO (SRS: FR-10) */
export default function Obe() {
  const { major } = useMajor();
  const plos = plosOf(major);
  const ylos = ylosOf(major);
  const rows = mapRows(major);
  const sources = [...new Set(plos.flatMap(p => p.sources || []))];

  return (
    <main>
      <PageHead eyebrow="ผลลัพธ์การเรียนรู้" title="ขั้นตอน OBE"
        lead="ความต้องการของผู้มีส่วนได้ส่วนเสียและนโยบายระดับชาติ ถูกแปลงเป็น PLO แล้วกระจายลง YLO รายชั้นปี และ CLO รายวิชา"
        crumbs={[{ label: "ขั้นตอน OBE" }]} />
      <div className="wrap">
        <Section id="flow" title="ภาพรวม">
          <div className="statgrid">
            <div className="statbox"><b>{sources.length}</b><span>กลุ่มผู้มีส่วนได้ส่วนเสีย/แหล่งข้อมูล</span></div>
            <div className="statbox"><b>{plos.length}</b><span>PLO</span></div>
            <div className="statbox"><b>{ylos.length}</b><span>YLO</span></div>
            <div className="statbox"><b>{rows.length}</b><span>CLO ในแผนที่</span></div>
          </div>
          <div className="warnlist"><Warn iss="ISS-25">เล่มไม่ระบุวิธีเก็บข้อมูล ขนาดตัวอย่าง และช่วงเวลาสำรวจผู้มีส่วนได้ส่วนเสีย</Warn></div>
        </Section>

        <ObeAlluvial key={major} plos={plos} ylos={ylos} rows={rows} />

        <Section id="sources" title="① ผู้มีส่วนได้ส่วนเสียและแหล่งข้อมูล">
          <div className="tags">{sources.map(s => <span key={s} className="pill ghost">{s}</span>)}</div>
        </Section>

        <Section id="needs" title="② ความต้องการ → PLO" sub="ตารางที่ 1 หมวด 3.3 ของเล่ม">
          <div className="tblwrap">
            <table className="tbl">
              <thead><tr><th>PLO</th><th>ความต้องการ/ความคาดหวัง</th><th>แหล่งข้อมูล</th></tr></thead>
              <tbody>
                {plos.map(p => (
                  <tr key={p.id}>
                    <td><PloChip id={p.id} small /></td>
                    <td><ul className="numlist">{(p.needs || []).map((n, i) => <li key={i}>{n}</li>)}</ul></td>
                    <td>{(p.sources || []).join(" · ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section id="cascade" title="③ PLO → YLO → CLO" sub="จำนวนที่กระจายลงแต่ละชั้น">
          <div className="tblwrap">
            <table className="tbl">
              <thead><tr><th>PLO</th><th>Generic/Specific</th><th className="r">YLO</th><th className="r">รายวิชา</th><th className="r">CLO</th></tr></thead>
              <tbody>
                {plos.map(p => {
                  const r = rows.filter(x => x.plo === p.id);
                  return (
                    <tr key={p.id}>
                      <td><Link className="lnk" to={`/plo/${p.id}`}>{p.id}</Link><span className="sub">{p.en}</span></td>
                      <td>{p.outcomeType}</td>
                      <td className="r">{p.ylos.filter(y => ylos.some(o => o.id === y)).length}</td>
                      <td className="r">{new Set(r.map(x => x.code)).size}</td>
                      <td className="r">{r.length}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Section>

        <Section id="activities" title="④ กิจกรรมเสริมหลักสูตร" sub="หมวด 3.4 ของเล่ม">
          {ACTIVITIES.rows.map(r => (
            <div key={r[0]} className="box">
              <h3>ชั้นปีที่ {r[0]} · {r[1].split(" - ")[0]}</h3>
              <p className="hint">{r[1].split(" - ").slice(1).join(" - ").split("ที่มา:")[0]}</p>
              {r[2] && <p style={{ fontSize: ".85rem", margin: "6px 0 0" }}><b>ผลลัพธ์ที่เกิด:</b> {r[2]}</p>}
            </div>
          ))}
          <div className="warnlist"><Warn iss="ISS-46">ข้อความในเล่มยังมีโน้ตร่างค้าง เช่น "N13"</Warn></div>
        </Section>
      </div>
    </main>
  );
}
