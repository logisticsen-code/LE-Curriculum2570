import { Link } from "react-router-dom";
import { PageHead, Section, MajorTag, Warn } from "./ui.jsx";
import { useMajor } from "../major.jsx";
import { GROUPS, CAT_LABEL, GROUP_SHORT } from "../lib.js";
import { COUNTS } from "../generated/meta.js";

/* โครงสร้าง 122 หน่วยกิต: GE 24 · เฉพาะ 92 · เสรี 6 (SRS: FR-04) */
export default function Structure() {
  const { major } = useMajor();
  const show = g => !g.major || major === "ALL" || g.major === major;
  const ge = GROUPS.filter(g => g.cat === "ge");
  const spec = GROUPS.filter(g => g.cat === "spec");
  const pe = GROUPS.filter(g => g.cat === "pe");
  const sum = gs => gs.reduce((s, g) => s + g.credits, 0);
  const geCr = sum(ge);
  const specCr = sum(spec.filter(g => !g.major)) + 24 + pe[0].credits;  // วิชาบังคับเอก 24 + วิชาชีพเลือก 3
  const free = COUNTS.credits - geCr - specCr;

  const row = g => (
    <tr key={g.id} className={show(g) ? "" : "dim"}>
      <td><Link className="lnk" to={`/structure/${g.id}`}>{g.th}</Link>{g.pick && <span className="sub">{g.pick}</span>}</td>
      <td>{g.major ? <MajorTag m={g.major} /> : <MajorTag m="ALL" />}</td>
      <td className="r">{g.courseCount}</td>
      <td className="r"><b>{g.credits}</b></td>
    </tr>
  );

  return (
    <main>
      <PageHead eyebrow="หลักสูตร" title="โครงสร้างหลักสูตร"
        lead={`หน่วยกิตรวมไม่น้อยกว่า ${COUNTS.credits} หน่วยกิต เท่ากันทั้งสองวิชาเอก — ต่างกันเฉพาะวิชาบังคับเอก 24 หน่วยกิต`}
        crumbs={[{ label: "โครงสร้างหลักสูตร" }]} />
      <div className="wrap">
        <Section id="bar" title="สัดส่วนหน่วยกิต">
          <div className="creditbar big">
            <div className="cbseg s0" style={{ flex: geCr }}><b>{geCr}</b><span>{CAT_LABEL.ge}</span></div>
            <div className="cbseg s1" style={{ flex: specCr }}><b>{specCr}</b><span>{CAT_LABEL.spec}</span></div>
            <div className="cbseg s2" style={{ flex: Math.max(free, 4) }}><b>{free}</b><span>{CAT_LABEL.free}</span></div>
          </div>
        </Section>

        <Section id="table" title="หมวดและกลุ่มวิชา" sub={major === "ALL" ? "แสดงทั้งสองวิชาเอก" : `เน้นวิชาเอก ${major} (กลุ่มของอีกวิชาเอกแสดงจาง)`}>
          <div className="tblwrap">
            <table className="tbl">
              <thead><tr><th>หมวด / กลุ่มวิชา</th><th>วิชาเอก</th><th className="r">จำนวนวิชาในเล่ม</th><th className="r">หน่วยกิต</th></tr></thead>
              <tbody>
                <tr className="total"><td colSpan={3}>1. {CAT_LABEL.ge}</td><td className="r">{geCr}</td></tr>
                {ge.map(row)}
                <tr className="total"><td colSpan={3}>2. {CAT_LABEL.spec}</td><td className="r">{specCr}</td></tr>
                {spec.map(row)}
                <tr><td colSpan={4} className="mut">{CAT_LABEL.pe} — เลือก {pe[0].credits} หน่วยกิตจาก {pe.length} กลุ่มต่อไปนี้</td></tr>
                {pe.map(g => row({ ...g, pick: null }))}
                <tr className="total"><td colSpan={3}>3. {CAT_LABEL.free}</td><td className="r">{free}</td></tr>
                <tr className="total"><td colSpan={3}>รวมตลอดหลักสูตร</td><td className="r">{geCr + specCr + free}</td></tr>
              </tbody>
            </table>
          </div>
          <div className="warnlist">
            <Warn iss="ISS-17">วิชาชีพเลือก 4 กลุ่มไม่ได้ระบุในเล่มว่าเหมาะกับวิชาเอกใด และเลือกเรียนเพียง 3 หน่วยกิต</Warn>
            <Warn iss="ISS-10">ตารางวิชาบังคับเอก IE ในเล่มมี EN-788-13009 ซ้ำ 2 แถว (เว็บนับครั้งเดียว)</Warn>
          </div>
        </Section>

        <Section id="groups" title="เปิดดูรายวิชาตามกลุ่ม">
          <div className="cardgrid">
            {GROUPS.filter(show).map(g => (
              <Link key={g.id} to={`/structure/${g.id}`} className={`navcard g-${g.id}`} style={{ borderLeft: "5px solid var(--gc)" }}>
                <b>{GROUP_SHORT[g.id]}</b>
                <p>{g.th}</p>
                <span className="go">{g.courseCount} วิชา · {g.credits} หน่วยกิต →</span>
              </Link>
            ))}
          </div>
        </Section>
      </div>
    </main>
  );
}
