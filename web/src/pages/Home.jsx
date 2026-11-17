import { Link } from "react-router-dom";
import { META, COUNTS, MAJORS } from "../generated/meta.js";
import { PROGRAM } from "../generated/program.js";
import { YLO_INTRO } from "../generated/outcomes.js";
import { ISSUES } from "../generated/issues.js";
import { Section, MajorTag, Warn } from "./ui.jsx";
import { useMajor } from "../major.jsx";
import { GROUPS, PLOS, YLOS, YEAR_COLOR, majorsOf } from "../lib.js";

const NAV = [
  { to: "/structure", ic: "▦", t: "โครงสร้างหลักสูตร", d: "หมวด กลุ่มวิชา และหน่วยกิตรวม 122" },
  { to: "/courses", ic: "☷", t: "รายวิชา", d: "คำอธิบายไทย–อังกฤษ และ CLO ของทุกวิชา" },
  { to: "/plan", ic: "▤", t: "แผนการเรียน", d: "8 ภาคการศึกษา แยกตามวิชาเอก" },
  { to: "/plo", ic: "◎", t: "PLO", d: "ผลลัพธ์ระดับหลักสูตร 13 ข้อ" },
  { to: "/clo", ic: "⇄", t: "แผนที่ CLO", d: "CLO → YLO → PLO รายภาคการศึกษา" },
  { to: "/data-quality", ic: "⚠", t: "ข้อสังเกตของเล่ม", d: "สิ่งที่ต้องแก้ก่อนเสนอสภามหาวิทยาลัย" },
];

export default function Home() {
  const { major } = useMajor();
  const p0 = ISSUES.filter(i => i.sev === "P0").length;
  return (
    <main>
      <section className="hero">
        <div className="wrap hero-grid">
          <div>
          <div className="hero-copy">
            <div className="eyebrow">{META.revision} · {META.university}</div>
            <h1>{META.nameTh}</h1>
            <p className="lead">{META.degreeTh} · {META.degreeEn}<br />{META.faculty}</p>
          </div>
          <div className="hero-stats">
            <div><b>{COUNTS.credits}</b><span>หน่วยกิตตลอดหลักสูตร</span></div>
            <div><b>{COUNTS.majors}</b><span>วิชาเอก (IE · SC)</span></div>
            <div><b>{COUNTS.plos}</b><span>PLO (ร่วม {COUNTS.plosByScope.LE} · IE {COUNTS.plosByScope.IE} · SC {COUNTS.plosByScope.SC})</span></div>
            <div><b>{COUNTS.courses}</b><span>รายวิชาในเล่ม</span></div>
            <div><b>{COUNTS.clos}</b><span>CLO รายวิชา</span></div>
            <div><b>{COUNTS.ylos}</b><span>YLO รายชั้นปี</span></div>
          </div>
          <div className="hero-cta">
            <Link className="btn primary" to="/structure">ดูโครงสร้างหลักสูตร</Link>
            <Link className="btn" to="/plan">แผนการเรียน</Link>
            <Link className="btn" to="/plo">PLO 13 ข้อ</Link>
          </div>
          </div>
          <div className="hero-art">
            <img className="cover-art academic-cover" src="/ksu-logistics-cover.jpg" width="1024" height="759"
              fetchPriority="high" alt="นักศึกษาวิศวกรรม มหาวิทยาลัยกาฬสินธุ์ ทำงานกลุ่มบนโต๊ะเขียนแบบ" />
          </div>
        </div>
      </section>

      <div className="wrap">
        {p0 > 0 && (
          <div className="note" style={{ marginTop: 18 }}>
            <b>ร่างเพื่อพิจารณา</b> — เล่มยังมีข้อสังเกตระดับ P0 จำนวน {p0} ข้อที่ต้องแก้ก่อนเสนอสภามหาวิทยาลัย
            (เช่น ยังไม่กำหนดระดับ I/R/M ในแผนที่ CLO) · <Link className="lnk" to="/data-quality">ดูข้อสังเกตทั้งหมด</Link>
          </div>
        )}

        <Section id="majors" title="2 วิชาเอก" sub="เรียนหมวดศึกษาทั่วไป พื้นฐาน และวิชาชีพบังคับร่วมด้วยกัน แล้วแยกวิชาบังคับเอก 24 หน่วยกิต">
          <div className="majorgrid">
            {MAJORS.map(m => {
              const g = GROUPS.find(x => x.major === m.id);
              const plos = PLOS.filter(p => p.scope === m.id);
              const ylos = YLOS.filter(y => y.major === m.id);
              return (
                <div key={m.id} className={`majorcard ${m.id}`}>
                  <h3>{m.th} <MajorTag m={m.id} /></h3>
                  <div className="en">{m.en}</div>
                  <ul>
                    <li>วิชาบังคับเอก {g?.courseCount} วิชา · {g?.credits} หน่วยกิต</li>
                    <li>PLO ร่วม {COUNTS.plosByScope.LE} ข้อ + PLO วิชาเอก {plos.length} ข้อ</li>
                    <li>YLO ปี 1–3 ของวิชาเอก {ylos.length} ข้อ + YLO ปี 4 ร่วม</li>
                  </ul>
                  <p className="hint">
                    <Link to={`/plan?major=${m.id}`}>แผนการเรียน</Link> ·{" "}
                    <Link to={`/structure/${m.id.toLowerCase()}?major=${m.id}`}>วิชาบังคับเอก</Link> ·{" "}
                    <Link to={`/plo?major=${m.id}`}>PLO</Link>
                  </p>
                </div>
              );
            })}
          </div>
        </Section>

        <Section id="philosophy" title="ปรัชญาของหลักสูตร">
          <blockquote className="bigtext">{PROGRAM.philosophy}</blockquote>
        </Section>

        <Section id="objectives" title="วัตถุประสงค์ของหลักสูตร" sub={PROGRAM.objectivesLead}>
          <ol className="numlist">{PROGRAM.objectives.map((o, i) => <li key={i}>{o}</li>)}</ol>
        </Section>

        <Section id="path" title="เส้นทาง 4 ปี" sub="ผลลัพธ์ที่คาดหวังเมื่อสิ้นสุดแต่ละชั้นปี (YLO) ตามวิชาเอกที่เลือก">
          <div className="cardgrid">
            {[1, 2, 3, 4].map(y => (
              <Link key={y} to={`/ylo?major=${major}#y${y}`} className="navcard" style={{ borderTop: `4px solid ${YEAR_COLOR[y]}` }}>
                <b>ชั้นปีที่ {y}</b>
                {(y === 4 ? ["ALL"] : majorsOf(major)).map(mj => {
                  const t = YLO_INTRO[`${mj}-${y}`];
                  return t ? <p key={mj}>{y < 4 && major === "ALL" && <MajorTag m={mj} />} {t}</p> : null;
                })}
              </Link>
            ))}
          </div>
        </Section>

        <Section id="careers" title="อาชีพที่สามารถประกอบได้">
          <div className="tags">{PROGRAM.careers.map(c => <span key={c} className="pill ghost">{c}</span>)}</div>
          {PROGRAM.careers.includes("วิศวกรวัสดุ") && (
            <div className="warnlist"><Warn iss="ISS-41">"วิศวกรวัสดุ" ไม่สอดคล้องกับวิชาเอกใดของหลักสูตร</Warn></div>
          )}
        </Section>

        <Section id="info" title="ข้อมูลหลักสูตร">
          <div className="deflist">
            <div><span>รหัสหลักสูตร</span><b className="mono">{PROGRAM.programCode}</b></div>
            <div><span>ชื่อปริญญา (ย่อ)</span><b>{META.degreeThShort} · {META.degreeEnShort}</b></div>
            <div><span>ภาษาที่ใช้</span><b>{PROGRAM.language}</b></div>
            <div><span>ปรับปรุงจาก</span><b>{PROGRAM.basedOn}</b></div>
            <div><span>การประกันคุณภาพ</span><b>{PROGRAM.qa}</b></div>
            <div><span>ค่าธรรมเนียม (เหมาจ่าย)</span><b>{PROGRAM.tuitionPerSemester.toLocaleString("th-TH")} บาท/ภาค</b></div>
            <div className="wide"><span>ISCED</span><b>{PROGRAM.isced.join(" → ")}</b></div>
          </div>
        </Section>

        <Section id="go" title="เริ่มสำรวจ">
          <div className="cardgrid">
            {NAV.map(n => (
              <Link key={n.to} to={n.to} className="navcard">
                <span className="ic">{n.ic}</span><b>{n.t}</b><p>{n.d}</p><span className="go">เปิดดู →</span>
              </Link>
            ))}
          </div>
        </Section>
      </div>
    </main>
  );
}
