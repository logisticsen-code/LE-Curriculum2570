import { Link } from "react-router-dom";
import { PageHead, Section, PloChip, YloChip, MajorTag, Warn } from "./ui.jsx";
import { DocView, DocToc, splitBullets } from "./DocView.jsx";
import { useMajor } from "../major.jsx";
import { plosOf, majorsOf, ploColor, YEAR_COLOR } from "../lib.js";
import { ASSESSMENT, YLO_ASSESSMENT } from "../generated/teaching.js";
import { DOCS } from "../generated/docs.js";


/* วิธีประเมินราย PLO · น้ำหนัก · เกณฑ์ผ่าน · จุดประเมิน YLO (หมวด 6, 8.2 · SRS: FR-17) */
export default function Assessment() {
  const { major } = useMajor();
  const mjs = majorsOf(major);
  const blocks = DOCS["6"].blocks;
  const from = blocks.findIndex(b => b.t === "h" && b.text.startsWith("6.2"));
  const to = blocks.findIndex(b => b.t === "h" && b.text.startsWith("6.7"));

  return (
    <main>
      <PageHead eyebrow="การเรียนการสอน" title="การวัดและประเมินผลผู้เรียน"
        lead="วิธีประเมินแต่ละ PLO พร้อมน้ำหนัก ช่วงเวลา และผู้ประเมิน (หมวด 6.1) และจุดประเมิน YLO รายชั้นปี (หมวด 8.2)"
        crumbs={[{ label: "การวัดและประเมินผล" }]} />
      <div className="wrap">
        <div className="warnlist" style={{ marginTop: 14 }}>
          <Warn iss="ISS-22">เกณฑ์ผ่าน "Rubric ≥3/4 ทุกองค์ประกอบสำคัญ" แต่เล่มไม่มีคำบรรยาย Rubric รายระดับ และไม่นิยาม "องค์ประกอบสำคัญ"</Warn>
          <Warn iss="ISS-23">PLO_LE2, LE3, LE4 ประเมิน 100% จากสหกิจศึกษาเพียงจุดเดียว</Warn>
          <Warn iss="ISS-05">เกณฑ์ผ่านระดับหลักสูตรขัดกัน: ข้อ 7.6.2 ≥ 60% แต่ข้อ 8.3 ≥ 50%</Warn>
        </div>

        {mjs.map(mj => {
          const plos = plosOf(mj);
          return (
            <Section key={mj} id={`plo-${mj}`} title={<>วิธีประเมินราย PLO <MajorTag m={mj} /></>} sub="น้ำหนักของแต่ละวิธีรวมเป็น 100% ต่อ PLO">
              <div className="tblwrap">
                <table className="tbl">
                  <thead><tr><th>PLO</th><th>วิธีการประเมิน</th><th className="r">น้ำหนัก</th><th>ช่วงเวลา</th><th>ผู้ประเมิน</th></tr></thead>
                  <tbody>
                    {plos.map(p => {
                      const rows = ASSESSMENT.filter(a => a.plo === p.id && a.majors.includes(mj));
                      const tot = rows.reduce((s, a) => s + (a.weight || 0), 0);
                      return rows.map((a, i) => (
                        <tr key={p.id + i}>
                          {i === 0 && (
                            <td rowSpan={rows.length}>
                              <PloChip id={p.id} small />
                              <div className="wbar" style={{ marginTop: 6 }} title={`รวม ${tot}%`}>
                                {rows.map((x, k) => <span key={k} style={{ width: `${x.weight}%`, background: ploColor(p.id), opacity: 1 - (k % 5) * 0.17, borderRight: "1px solid var(--card)" }} />)}
                              </div>
                              <span className="sub">รวม {tot}%</span>
                            </td>
                          )}
                          <td>{a.method}<span className="sub">{a.format}</span></td>
                          <td className="r"><b>{a.weight}%</b></td>
                          <td>{a.when}</td>
                          <td>{a.assessor}</td>
                        </tr>
                      ));
                    })}
                  </tbody>
                </table>
              </div>
              <p className="hint">เกณฑ์ผ่านทุกแถว: {[...new Set(ASSESSMENT.filter(a => a.majors.includes(mj)).map(a => a.pass))].join(" · ")}</p>
            </Section>
          );
        })}

        <Section id="ylo" title="จุดประเมิน YLO รายชั้นปี" sub="หมวด 8.2 ของเล่ม">
          {[1, 2, 3, 4].map(y => {
            const rows = YLO_ASSESSMENT.filter(a => a.year === y && (a.ylo.startsWith("YLO") || mjs.some(mj => a.ylo.startsWith(mj + "-"))));
            if (!rows.length) return null;
            return (
              <div key={y} style={{ marginBottom: 14 }}>
                <h3 className="doc-h lv3" style={{ borderLeft: `4px solid ${YEAR_COLOR[y]}`, paddingLeft: 10 }}>ชั้นปีที่ {y}</h3>
                <div className="tblwrap">
                  <table className="tbl">
                    <thead><tr><th>YLO</th><th>วิธีวัดผล</th><th>เครื่องมือประเมิน</th><th>เกณฑ์</th></tr></thead>
                    <tbody>
                      {rows.map(a => (
                        <tr key={a.ylo}><td><YloChip id={a.ylo} /><span className="sub">{a.text}</span></td><td>{a.method}</td><td>{splitBullets(a.tool)}</td><td>{a.criteria}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </Section>

        <Section id="doc" title="เครื่องมือ เกณฑ์ตัดสิน ข้อมูลป้อนกลับ และการทวนสอบ" sub="หมวด 6.2–6.6 ตามเล่ม">
          <DocToc blocks={blocks} prefix="ch6" from={from} to={to < 0 ? Infinity : to} />
          <div className="warnlist"><Warn iss="ISS-24">หัวข้อ 6.3 ระบุว่า "ไม่มี" เครื่องมือประเมินดิจิทัล แต่หัวข้ออื่นอ้างถึง LMS/Google Classroom</Warn></div>
          <DocView blocks={blocks} prefix="ch6" from={from} to={to < 0 ? Infinity : to} />
          <p className="hint">อาจารย์ผู้สอนและสิ่งสนับสนุนการเรียนรู้ (หมวด 6.7) ดูได้ที่หน้า <Link to="/quality#ch6-staff">คุณภาพหลักสูตร</Link></p>
        </Section>
      </div>
    </main>
  );
}
