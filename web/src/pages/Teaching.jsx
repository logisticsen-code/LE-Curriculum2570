import { PageHead, Section, PloChip, Warn } from "./ui.jsx";
import { DocView, splitBullets } from "./DocView.jsx";
import { useMajor } from "../major.jsx";
import { plosOf, ploShort } from "../lib.js";
import { STRATEGIES, TEACH_BY_PLO } from "../generated/teaching.js";
import { DOCS } from "../generated/docs.js";

/* กลยุทธ์การสอน 5 แบบ ↔ รายวิชา ↔ PLO (หมวด 5 · SRS: FR-16) */
export default function Teaching() {
  const { major } = useMajor();
  const plos = plosOf(major);
  const blocks = DOCS["5"].blocks;
  const restFrom = blocks.findIndex(b => b.t === "h" && b.text.startsWith("2)"));
  const short = s => s.replace(/\s*\(.*$/, "");
  const en = s => (s.match(/\(([^)]+)\)/) || [])[1] || "";
  const uncovered = plos.filter(p => !STRATEGIES.some(s => s.plos.includes(p.id)));
  const onlyOne = plos.filter(p => STRATEGIES.filter(s => s.plos.includes(p.id)).length === 1);

  return (
    <main>
      <PageHead eyebrow="การเรียนการสอน" title="กลยุทธ์การจัดการเรียนการสอน"
        lead={`หมวด 5 ของเล่ม — ${STRATEGIES.length} กลยุทธ์การสอน แต่ละกลยุทธ์ระบุรายวิชาและ PLO ที่รับผิดชอบ`}
        crumbs={[{ label: "กลยุทธ์การสอน" }]} />
      <div className="wrap">
        <Section id="matrix" title="ความครอบคลุม PLO" sub={major === "ALL" ? "ทุกวิชาเอก" : `PLO ของวิชาเอก ${major}`}>
          <div className="tblwrap">
            <table className="tbl">
              <thead><tr><th>กลยุทธ์</th>{plos.map(p => <th key={p.id} className="c">{ploShort(p.id)}</th>)}</tr></thead>
              <tbody>
                {STRATEGIES.map(s => (
                  <tr key={s.name}>
                    <td><a className="lnk" href={`#st-${STRATEGIES.indexOf(s)}`}>{short(s.name)}</a><span className="sub">{en(s.name)}</span></td>
                    {plos.map(p => <td key={p.id} className="matrix-c">{s.plos.includes(p.id) ? "●" : ""}</td>)}
                  </tr>
                ))}
                <tr className="total"><td>จำนวนกลยุทธ์</td>{plos.map(p => <td key={p.id} className="c">{STRATEGIES.filter(s => s.plos.includes(p.id)).length}</td>)}</tr>
              </tbody>
            </table>
          </div>
          <div className="warnlist">
            {uncovered.map(p => <Warn key={p.id}>{p.id} ไม่มีกลยุทธ์การสอนใดรับผิดชอบ</Warn>)}
            {onlyOne.length > 0 && <Warn>มีกลยุทธ์รองรับเพียงแบบเดียว: {onlyOne.map(p => ploShort(p.id)).join(", ")}</Warn>}
          </div>
        </Section>

        <Section id="detail" title="รายละเอียดรายกลยุทธ์">
          {STRATEGIES.map((s, i) => (
            <div key={s.name} id={`st-${i}`} className="box" style={{ scrollMarginTop: 70 }}>
              <h3>{i + 1}. {s.name}</h3>
              <div className="tags" style={{ margin: "4px 0 8px" }}>
                {s.plos.filter(p => plos.some(x => x.id === p)).map(p => <PloChip key={p} id={p} small />)}
              </div>
              <dl className="kv">
                <dt>การดำเนินการ</dt><dd>{splitBullets(s.detail)}</dd>
                <dt>รายวิชาที่เกี่ยวข้อง</dt><dd>{s.courses}</dd>
                <dt>เครื่องมือ/กิจกรรม</dt><dd>{splitBullets(s.tools)}</dd>
                <dt>ผลลัพธ์ที่คาดหวัง</dt><dd>{s.outcome}</dd>
              </dl>
            </div>
          ))}
        </Section>

        <Section id="perplo" title="วิธีสอนและวิธีประเมินรายข้อ PLO" sub="ตารางหมวด 5.1">
          <div className="tblwrap">
            <table className="tbl">
              <thead><tr><th>PLO</th><th>วิธีการจัดการเรียนการสอน</th><th>วิธีการประเมินผล</th></tr></thead>
              <tbody>
                {TEACH_BY_PLO.filter(t => plos.some(p => p.id === t.plo)).map(t => (
                  <tr key={t.plo}><td><PloChip id={t.plo} small /></td><td>{splitBullets(t.teach)}</td><td>{splitBullets(t.assess)}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section id="more" title="กระบวนการเรียนรู้เพิ่มเติม" sub="Growth Mindset · การเรียนรู้ตลอดชีวิต · ทฤษฎีสู่การปฏิบัติ · การบูรณาการ (หมวด 5.2 ข้อ 2–5)">
          <DocView blocks={blocks} prefix="ch5" from={restFrom < 0 ? blocks.length : restFrom} />
        </Section>
      </div>
    </main>
  );
}
