import { PageHead, Section, MajorTag, Warn } from "./ui.jsx";
import { useMajor } from "../major.jsx";
import { SKILL_SETS } from "../generated/program.js";

/* ชุดทักษะสำหรับ Skill Transcript (SRS: FR-15) */
export default function Skills() {
  const { major } = useMajor();
  const sets = SKILL_SETS.filter(s => major === "ALL" || s.major === "LE" || s.major === major);
  return (
    <main>
      <PageHead eyebrow="ผลลัพธ์การเรียนรู้" title="ชุดทักษะหลักสูตร (Skill Transcript)"
        lead="ชุดทักษะที่บันทึกใน Skill Transcript ของนักศึกษา แต่ละชุดมีทักษะย่อย 3 รายการ พร้อมระดับความเชี่ยวชาญ CLO ที่เกี่ยวข้อง และวิธีประเมิน"
        crumbs={[{ label: "ชุดทักษะ" }]} />
      <div className="wrap">
        <div className="warnlist" style={{ marginTop: 14 }}>
          {(major !== "IE") && <Warn iss="ISS-04">SC-SK01 และ SC-SK02 อ้าง CLO ของ EN-788-13018 ตามแผนที่ 4.5 ซึ่งใช้ข้อความ CLO ของวิชา 13010 (CLO ในหมวด 4.3 ถูกต้อง)</Warn>}
        </div>
        {sets.map(s => (
          <Section key={s.code} id={s.code} title={<>{s.code} · {s.name} <MajorTag m={s.major} /></>} sub={`${s.group} · ${s.type}`}>
            <div className="tblwrap">
              <table className="tbl">
                <thead><tr><th>ทักษะย่อย</th><th className="c">ระดับ</th><th>CLO ที่เกี่ยวข้อง</th><th>วิธีวัดและประเมินผล</th></tr></thead>
                <tbody>
                  {s.sub.map((x, i) => (
                    <tr key={i}>
                      <td><b>{x.title}</b><span className="sub">{x.detail}</span></td>
                      <td className="c"><b>{x.level ?? "—"}</b></td>
                      <td>{x.clos}</td>
                      <td>{x.assess}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        ))}
      </div>
    </main>
  );
}
