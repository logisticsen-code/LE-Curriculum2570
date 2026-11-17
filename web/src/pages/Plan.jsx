import { useState } from "react";
import { Link } from "react-router-dom";
import { PageHead, Section, Warn, MajorTag } from "./ui.jsx";
import { useMajor } from "../major.jsx";
import { PLANS, COURSE, MAJOR, YEAR_COLOR } from "../lib.js";
import PlanBoard from "../PlanBoard.jsx";

/* แผนการเรียน 8 ภาคแยกวิชาเอก พร้อมยอดรายภาคและยอดสะสม (SRS: FR-07) */
export default function Plan() {
  const { major, setMajor } = useMajor();
  const [local, setLocal] = useState("IE");
  const mj = major === "ALL" ? local : major;
  const plan = PLANS[mj];
  const total = plan.at(-1)?.cumulative;

  return (
    <main>
      <PageHead eyebrow="หลักสูตร" title="แผนการเรียนตลอดหลักสูตร"
        lead="แผนการเรียนปกติ 4 ปี 8 ภาคการศึกษา — ภาคแรกของปี 4 เป็นสหกิจศึกษา"
        crumbs={[{ label: "แผนการเรียน" }]} />
      <div className="wrap">
        <div className="plantabs" style={{ marginTop: 18 }}>
          {["IE", "SC"].map(id => (
            <button key={id} className={"plantab" + (mj === id ? " on" : "")} style={{ "--acc": `var(--${id.toLowerCase()})` }}
              onClick={() => (major === "ALL" ? setLocal(id) : setMajor(id))}>
              <b>{MAJOR[id].th}</b><span>{MAJOR[id].en} · {PLANS[id].at(-1)?.cumulative} หน่วยกิต</span>
            </button>
          ))}
        </div>

        <Section id="summary" title={<>สรุปหน่วยกิตรายภาค <MajorTag m={mj} /></>}>
          <div className="tblwrap">
            <table className="tbl">
              <thead><tr><th>ปี/ภาค</th>{plan.map(s => <th key={`${s.year}-${s.sem}`} className="r">{s.year}/{s.sem}</th>)}<th className="r">รวม</th></tr></thead>
              <tbody>
                <tr><td>หน่วยกิตลงทะเบียน</td>{plan.map(s => <td key={`${s.year}-${s.sem}`} className="r"><b>{s.credits}</b></td>)}<td className="r"><b>{total}</b></td></tr>
                <tr><td>สะสม</td>{plan.map(s => <td key={`${s.year}-${s.sem}`} className="r mut">{s.cumulative}</td>)}<td /></tr>
              </tbody>
            </table>
          </div>
          <div className="warnlist">
            {plan.filter(s => s.computed !== s.credits).map(s => <Warn key={`${s.year}-${s.sem}`}>ปี {s.year} ภาค {s.sem}: รวมจากรายวิชา {s.computed} ไม่ตรงกับที่ระบุ {s.credits}</Warn>)}
            {plan.some(s => s.year === 3 && s.sem === 2 && s.credits < 9) && <Warn iss="ISS-21">ปี 3 ภาค 2 มีเพียง {plan.find(s => s.year === 3 && s.sem === 2).credits} หน่วยกิต — ควรตรวจกับภาระขั้นต่ำในข้อบังคับ</Warn>}
          </div>
        </Section>

        <Section id="board" title="ภาพรวมแผนการเรียนทั้งหลักสูตรในภาพเดียว" sub="กระดาน 4 ชั้นปี × 2 ภาคการศึกษา — กดปุ่ม ⛶ ดูเต็มจอ เพื่อดูครบทั้งแผนโดยไม่ต้องเลื่อน">
          <PlanBoard major={mj} />
        </Section>

        <Section id="detail" title="รายวิชารายภาคการศึกษา" />
        <div className="semgrid2" style={{ marginTop: 10 }}>
          {plan.map(s => (
            <div key={`${s.year}-${s.sem}`} className="semcard" id={`y${s.year}s${s.sem}`} style={{ "--yc": YEAR_COLOR[s.year] }}>
              <div className="sem-h"><b>ปีที่ {s.year} · ภาคการศึกษาที่ {s.sem}</b><span className="sem-cr">{s.credits} หน่วยกิต</span></div>
              <div className="sem-sub">สะสม {s.cumulative} หน่วยกิต</div>
              <table className="semtbl">
                <tbody>
                  {s.courses.map((e, i) => {
                    const c = COURSE[e.code];
                    return (
                      <tr key={i}>
                        <td className="c">{c ? <Link className="lnk" to={`/courses/${e.code}`}>{e.code}</Link> : e.code}</td>
                        <td>{c?.th || e.name}{e.prereq && <span className="sub mut" style={{ display: "block", fontSize: ".72rem" }}>ก่อน: {e.prereq}</span>}</td>
                        <td className="k">{e.credits}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
