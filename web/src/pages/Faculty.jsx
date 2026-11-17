import { PageHead, Section, MajorTag } from "./ui.jsx";
import { FACULTY } from "../generated/program.js";
import { useMajor } from "../major.jsx";

/* แยกช่องที่เล่มเขียนหลายคุณวุฒิต่อกันในเซลล์เดียว เช่น "วศ.ม. (…) วศ.บ. (…)" */
const splitDeg = s => s.split(/\s(?=(?:วศ\.|วท\.|ปร\.|Ph\.D\.|M\.Sc\.|M\.Eng\.|B\.Eng\.|D\.Eng\.))/).filter(Boolean);
const splitInst = s => s.split(/\s(?=(?:ม\.|U\. of|Saga U\.))/).filter(Boolean);

export default function Faculty() {
  const { major } = useMajor();
  const resp = FACULTY.filter(f => f.responsible);
  const stat = {
    total: FACULTY.length,
    resp: resp.length,
    doc: FACULTY.filter(f => /Ph\.D\.|วศ\.ด\./.test(f.degrees)).length,
    asst: FACULTY.filter(f => f.position.startsWith("ผู้ช่วยศาสตราจารย์")).length,
  };
  return (
    <main>
      <PageHead eyebrow="หลักสูตร" title="อาจารย์ประจำหลักสูตร"
        lead="อาจารย์ผู้รับผิดชอบหลักสูตรวิชาเอกละ 3 ท่าน และอาจารย์ประจำหลักสูตรรวม 7 ท่าน คุณวุฒิตรงกับสาขาทุกท่าน"
        crumbs={[{ label: "อาจารย์ประจำหลักสูตร" }]} />
      <div className="wrap">
        <Section>
          <div className="statgrid">
            <div className="statbox"><b>{stat.total}</b><span>อาจารย์ประจำหลักสูตร</span></div>
            <div className="statbox"><b>{stat.resp}</b><span>ผู้รับผิดชอบหลักสูตร</span></div>
            <div className="statbox"><b>{stat.doc}</b><span>คุณวุฒิปริญญาเอก</span></div>
            <div className="statbox"><b>{stat.asst}</b><span>ผู้ช่วยศาสตราจารย์</span></div>
          </div>
        </Section>
        <Section title="รายชื่อ" sub={major === "ALL" ? "ทุกวิชาเอก" : `ผู้รับผิดชอบวิชาเอก ${major} แสดงก่อน`}>
          <div className="facgrid">
            {[...FACULTY].sort((a, b) => (major !== "ALL" ? (b.major === major) - (a.major === major) : 0) || a.no - b.no).map(f => {
              const degs = splitDeg(f.degrees), insts = splitInst(f.institutions), yrs = f.years.split(/\s+/);
              return (
                <article key={f.no} className={"faccard" + (f.chair ? " is-chair" : "")}>
                  <div className="facid">
                    <div className="facavatar">{f.name.replace(/^(นาย|นางสาว|นาง)/, "").trim().charAt(0)}</div>
                    <div className="facname">
                      <b>{f.name}</b>
                      <span>{f.position.replace("(ประธานหลักสูตร)", "").trim()}</span>
                      <div className="tags" style={{ marginTop: 4 }}>
                        {f.chair && <i className="facrole">ประธานหลักสูตร</i>}
                        {f.responsible ? <i className="facrole">ผู้รับผิดชอบหลักสูตร</i> : <i className="facrole">อาจารย์ประจำหลักสูตร</i>}
                        {f.major && <MajorTag m={f.major} />}
                      </div>
                    </div>
                    <span className="facno">{f.no}</span>
                  </div>
                  <ul className="facdeg">
                    {degs.map((d, i) => (
                      <li key={i}><b>{d}</b><span className="deginst">{insts[i] || ""}</span><span className="degyear">{yrs[i] || ""}</span></li>
                    ))}
                  </ul>
                  <div className="facqual"><span>คุณวุฒิ</span><b>{f.match}</b></div>
                </article>
              );
            })}
          </div>
          <p className="hint">ผลงานวิชาการย้อนหลัง 5 ปีอยู่ในภาคผนวก ก ของเล่ม (ยังไม่ได้ดึงเข้าเว็บ — SRS DP-06)</p>
        </Section>
      </div>
    </main>
  );
}
