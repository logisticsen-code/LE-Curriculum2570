import { useParams, Link } from "react-router-dom";
import { PageHead, Section, CourseRow, MajorTag, Warn } from "./ui.jsx";
import { GROUP, GROUP_SHORT, COURSE, totalCredits } from "../lib.js";
import NotFound from "./NotFound.jsx";

export default function StructureGroup() {
  const { id } = useParams();
  const g = GROUP[id];
  if (!g) return <NotFound />;
  const sum = totalCredits(g.courses);
  const isElective = g.cat === "pe" || id === "ge-elec";
  return (
    <main>
      <PageHead eyebrow={g.major ? `วิชาเอก ${g.major}` : "ทุกวิชาเอก"} title={g.th}
        lead={`${g.courses.length} รายวิชา · ${isElective ? `รวมในกลุ่ม ${sum} หน่วยกิต · ต้องเรียน ${g.credits} หน่วยกิต` : `${g.credits} หน่วยกิต`}`}
        crumbs={[{ to: "/structure", label: "โครงสร้างหลักสูตร" }, { label: GROUP_SHORT[g.id] }]}>
        <div className="tags" style={{ marginTop: 10 }}>{g.major ? <MajorTag m={g.major} /> : <MajorTag m="ALL" />}{g.pick && <span className="pill ghost">{g.pick}</span>}</div>
      </PageHead>
      <div className="wrap">
        <Section title="รายวิชา">
          <div className="rowlist">
            {g.courses.map(c => <CourseRow key={c} code={c}
              extra={COURSE[c]?.issues.length ? <Warn>{COURSE[c].issues.join(", ")}</Warn> : null} />)}
          </div>
          {!isElective && sum !== g.credits && (
            <div className="warnlist"><Warn>ผลรวมหน่วยกิตของรายวิชา ({sum}) ไม่เท่ากับที่กำหนดในโครงสร้าง ({g.credits})</Warn></div>
          )}
        </Section>
        <p className="hint"><Link to="/structure">← กลับโครงสร้างหลักสูตร</Link></p>
      </div>
    </main>
  );
}
