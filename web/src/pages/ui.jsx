import { Link } from "react-router-dom";
import { COURSE, GROUP, GROUP_SHORT, PLO, ploColor, ploShort } from "../lib.js";

/* ป้าย PLO — คลิกไปหน้ารายละเอียด (id แบบ "PLO_IE3") */
export function PloChip({ id, level, small, link = true }) {
  const p = PLO[id];
  const title = p ? `${id} ${p.th}` : id;
  const style = { "--pc": ploColor(id) };
  const inner = <>{ploShort(id)}{level ? <i>{level}</i> : null}</>;
  return link
    ? <Link to={`/plo/${id}`} className={`plochip${small ? " sm" : ""}`} style={style} title={title}>{inner}</Link>
    : <span className={`plochip${small ? " sm" : ""}`} style={style} title={title}>{inner}</span>;
}

export function YloChip({ id, link = true }) {
  if (!id) return null;
  return link ? <Link to={`/ylo/${id}`} className="ylochip">{id}</Link> : <span className="ylochip">{id}</span>;
}

export function MajorTag({ m }) {
  return <span className={`mtag ${m}`}>{m === "ALL" || m === "LE" ? "ร่วม" : m}</span>;
}

export function GroupTag({ g }) {
  return <span className={`gtag g-${g}`}><i className="gdot" /> {GROUP_SHORT[g] || GROUP[g]?.th || g}</span>;
}

export function IRM({ v }) {
  if (!v) return null;
  const label = { I: "Introduce", R: "Reinforce", M: "Mastery", A: "Assessed" }[v];
  return <span className={`irm irm-${v}`} title={label}>{v}</span>;
}

/* แถวรายวิชา — คลิกไปหน้ารายวิชา */
export function CourseRow({ code, extra }) {
  const c = COURSE[code];
  if (!c) return <div className="crow ghost"><span className="bar" /><span className="ccode">{code}</span><span className="cname">ไม่พบรายวิชานี้ในเล่ม</span></div>;
  return (
    <Link to={`/courses/${c.code}`} className={`crow g-${c.group}`}>
      <span className="bar" />
      <span className="ccode">{c.code}</span>
      <span className="cname">{c.th}<small>{c.en}</small></span>
      {extra ? <span className="cextra">{extra}</span> : null}
      <span className="ccr">{c.credits}</span>
    </Link>
  );
}

/* หัวหน้าเพจ + breadcrumb */
export function PageHead({ eyebrow, title, lead, crumbs, children }) {
  return (
    <div className="pagehead">
      <div className="wrap">
        {crumbs && (
          <div className="crumbs">
            <Link to="/">หน้าแรก</Link>
            {crumbs.map((c, i) => (
              <span key={i}>
                <i>›</i>{c.to ? <Link to={c.to}>{c.label}</Link> : <b>{c.label}</b>}
              </span>
            ))}
          </div>
        )}
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1>{title}</h1>
        {lead && <p className="lead">{lead}</p>}
        {children}
      </div>
    </div>
  );
}

export function Section({ title, sub, children, id }) {
  return (
    <section className="sect" id={id}>
      {title && <h2 className="sect-h">{title}{sub && <small>{sub}</small>}</h2>}
      {children}
    </section>
  );
}

/* ป้ายเตือนข้อมูลที่เล่มขาดหรือผิด (SRS: FR-21)
   ใช้แทนการปล่อยช่องว่าง เพื่อให้ผู้อ่านรู้ว่า "ไม่มีในเล่ม" ไม่ใช่ "เว็บโหลดไม่ขึ้น" */
export function Warn({ children, iss }) {
  return (
    <span className="warn-badge" title={iss ? `ดูข้อสังเกต ${iss}` : undefined}>
      <i aria-hidden="true">⚠</i>{children}{iss && <small>{iss}</small>}
    </span>
  );
}

/* หน้าที่ยังไม่มีข้อมูล — แสดงว่าจะถูกสร้างในขั้นใดของ Build Tutorial */
export function Pending({ title, step, to }) {
  return (
    <main>
      <PageHead eyebrow={`รอข้อมูลขั้นที่ ${step}`} title={title}
        lead="หน้านี้ยังไม่มีข้อมูล จะถูกสร้างตามคู่มือ Build Tutorial ในวอลต์"
        crumbs={[{ label: title }]} />
      <div className="wrap">
        <div className="note pending-note">
          <b>รอข้อมูลขั้นที่ {step}</b> — ดูวิธีสร้างใน <code>LE_Vault/02_Build_Tutorial/</code>
          {to && <> · เส้นทาง <code>{to}</code></>}
        </div>
      </div>
    </main>
  );
}
