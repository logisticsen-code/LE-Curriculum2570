import { PageHead, Section, PloChip } from "./ui.jsx";
import { PLOS } from "../lib.js";
import { META } from "../generated/meta.js";
import { SOURCE } from "../generated/meta.js";

/* นโยบาย/แผนระดับชาติที่หลักสูตรอ้างถึง รวมจากตาราง PLO ↔ นโยบาย (SRS: FR-19) */
export default function References() {
  const plans = new Map();
  for (const p of PLOS) for (const t of p.policy?.plans || []) {
    const key = t.split(":")[0].trim();
    if (!plans.has(key)) plans.set(key, { title: key, detail: new Set(), plos: new Set() });
    const e = plans.get(key);
    if (t.includes(":")) e.detail.add(t.split(":").slice(1).join(":").trim());
    e.plos.add(p.id);
  }
  const list = [...plans.values()].sort((a, b) => b.plos.size - a.plos.size);
  return (
    <main>
      <PageHead eyebrow="ข้อมูลอ้างอิง" title="นโยบายและเอกสารอ้างอิง"
        lead="แผนและนโยบายระดับชาติที่เล่มหลักสูตรใช้อ้างอิงความสอดคล้องของ PLO (ตารางที่ 2 หมวด 3.3)"
        crumbs={[{ label: "ข้อมูลอ้างอิง" }]} />
      <div className="wrap">
        <Section title="นโยบาย/แผนระดับชาติ" sub={`${list.length} ฉบับ เรียงตามจำนวน PLO ที่อ้าง`}>
          <div className="tblwrap">
            <table className="tbl">
              <thead><tr><th>นโยบาย/แผน</th><th>ประเด็นที่อ้าง</th><th>PLO</th></tr></thead>
              <tbody>
                {list.map(e => (
                  <tr key={e.title}>
                    <td><b>{e.title}</b></td>
                    <td>{[...e.detail].join(" · ") || "—"}</td>
                    <td><span className="tags">{[...e.plos].map(p => <PloChip key={p} id={p} small />)}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="hint">ชื่อและปีของนโยบายเป็นไปตามที่เขียนในเล่ม ควรตรวจกับเอกสารต้นฉบับก่อนอ้างอิงต่อ</p>
        </Section>
        <Section title="แหล่งข้อมูลของเว็บนี้">
          <div className="deflist">
            <div><span>เล่มหลักสูตร</span><b>{SOURCE.file}</b></div>
            <div><span>ฉบับ</span><b>{META.revision}</b></div>
            <div><span>มาตรฐานที่ใช้</span><b>กฎกระทรวงมาตรฐานหลักสูตร พ.ศ. 2565 · AUN-QA</b></div>
          </div>
        </Section>
      </div>
    </main>
  );
}
