/* แสดงเนื้อหาหมวดของเล่มตามลำดับเดิม (หัวข้อ · ย่อหน้า · ตาราง) — ใช้กับหมวด 5–9
   ไม่แต่งเนื้อหาเพิ่ม เพื่อให้ผู้อ่านเทียบกับเล่มได้ตรง ๆ */

export const headId = (prefix, i) => `${prefix}-h${i}`;

/* สารบัญจากหัวข้อระดับ 2–3 ของ blocks */
export function DocToc({ blocks, prefix, from = 0, to = Infinity }) {
  const hs = blocks.map((b, i) => ({ b, i })).filter(({ b, i }) => b.t === "h" && b.lvl <= 3 && i >= from && i < to);
  if (!hs.length) return null;
  return (
    <nav className="doctoc" aria-label="สารบัญหมวด">
      {hs.map(({ b, i }) => (
        <a key={i} href={`#${headId(prefix, i)}`} className={`lv${b.lvl}`}>{b.text}</a>
      ))}
    </nav>
  );
}

export function DocView({ blocks, prefix, from = 0, to = Infinity }) {
  return (
    <div className="docview">
      {blocks.map((b, i) => {
        if (i < from || i >= to) return null;
        if (b.t === "h") {
          const Tag = b.lvl <= 2 ? "h2" : b.lvl === 3 ? "h3" : "h4";
          return <Tag key={i} id={headId(prefix, i)} className={`doc-h lv${b.lvl}`}>{b.text}</Tag>;
        }
        if (b.t === "p") return <p key={i} className="doc-p">{b.text}</p>;
        return (
          <div key={i} className="tblwrap doc-tbl">
            <table className="tbl">
              <thead><tr>{b.header.map((h, j) => <th key={j}>{h}</th>)}</tr></thead>
              <tbody>
                {b.rows.map((r, j) => (
                  <tr key={j}>{r.map((c, k) => <td key={k}>{splitBullets(c)}</td>)}</tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}

/* เซลล์ที่เล่มเขียนเป็นรายการ "- ก - ข" หรือ "• ก • ข" → แยกบรรทัด */
function splitBullets(s) {
  const parts = s.split(/\s(?=[-•]\s)/);
  if (parts.length < 2) return s;
  return <ul className="cell-ul">{parts.map((p, i) => <li key={i}>{p.replace(/^[-•]\s*/, "")}</li>)}</ul>;
}

export { splitBullets };
