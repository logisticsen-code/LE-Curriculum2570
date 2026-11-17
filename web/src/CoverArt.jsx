/* ภาพหน้าปกหน้าแรก — ภาพประกอบต้นฉบับ (SVG) แนวคิด "วิศวกรรมโลจิสติกส์"
   คลังสินค้า · โรงงาน (วิศวกรรมอุตสาหการ) · รถขนส่ง · เครือข่ายโซ่อุปทาน · กราฟข้อมูล
   ใช้ตัวแปรสีของธีม (--navy, --navy2, --gold, --ie, --sc ฯลฯ) จึงเปลี่ยนตามโหมดสว่าง/มืดอัตโนมัติ */
export default function CoverArt() {
  return (
    <svg className="cover-art" viewBox="0 0 600 420" role="img"
      aria-labelledby="cover-t cover-d" xmlns="http://www.w3.org/2000/svg">
      <title id="cover-t">ภาพหน้าปกหลักสูตรวิศวกรรมโลจิสติกส์</title>
      <desc id="cover-d">คลังสินค้า โรงงาน และรถขนส่ง เชื่อมกันด้วยเส้นทางของโซ่อุปทาน พร้อมกราฟข้อมูลและหมุดตำแหน่ง</desc>
      <defs>
        <linearGradient id="cv-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--cv-sky-a)" />
          <stop offset="1" stopColor="var(--cv-sky-b)" />
        </linearGradient>
        <linearGradient id="cv-roof" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--navy2)" />
          <stop offset="1" stopColor="var(--navy)" />
        </linearGradient>
        <pattern id="cv-shutter" width="8" height="8" patternUnits="userSpaceOnUse">
          <rect width="8" height="8" fill="var(--cv-wall)" />
          <rect y="6" width="8" height="2" fill="var(--cv-line)" />
        </pattern>
        <filter id="cv-soft" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="var(--navy)" floodOpacity=".16" />
        </filter>
      </defs>

      {/* พื้นหลัง: วงกลมนุ่ม + เส้นขอบฟ้า */}
      <circle cx="320" cy="200" r="190" fill="url(#cv-sky)" />
      <circle cx="505" cy="92" r="46" fill="var(--gold)" opacity=".45" />
      <circle cx="120" cy="96" r="22" fill="var(--gold)" opacity=".35" />
      <path d="M40 318 H580" stroke="var(--cv-line)" strokeWidth="3" strokeLinecap="round" />

      {/* เครือข่ายโซ่อุปทาน (เส้นประเชื่อมจุด) */}
      <g fill="none" stroke="var(--navy2)" strokeWidth="2.4" strokeDasharray="2 7" strokeLinecap="round" opacity=".85">
        <path d="M150 150 C 210 70, 330 70, 392 128" />
        <path d="M392 128 C 450 100, 480 110, 505 92" />
        <path d="M505 92 C 560 170, 540 240, 470 270" />
      </g>
      <g>
        {[[150, 150, "var(--sc)"], [392, 128, "var(--ie)"], [505, 92, "var(--navy)"]].map(([x, y, c], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="11" fill="var(--card)" stroke={c} strokeWidth="3" />
            <circle cx={x} cy={y} r="4.5" fill={c} />
          </g>
        ))}
      </g>

      {/* หมุดตำแหน่งปลายทาง */}
      <g transform="translate(505 92)">
        <path d="M0 -44 C -16 -44 -26 -32 -26 -19 C -26 -2 0 18 0 18 C 0 18 26 -2 26 -19 C 26 -32 16 -44 0 -44 Z"
          fill="var(--navy)" transform="translate(0 -14)" filter="url(#cv-soft)" />
        <circle cx="0" cy="-33" r="9" fill="var(--card)" />
      </g>

      {/* กราฟข้อมูล (การวิเคราะห์ข้อมูลโซ่อุปทาน) */}
      <g transform="translate(58 40)" filter="url(#cv-soft)">
        <rect width="118" height="78" rx="12" fill="var(--card)" />
        <rect x="16" y="44" width="14" height="20" rx="3" fill="var(--gold)" />
        <rect x="38" y="32" width="14" height="32" rx="3" fill="var(--navy2)" />
        <rect x="60" y="22" width="14" height="42" rx="3" fill="var(--sc)" />
        <rect x="82" y="12" width="14" height="52" rx="3" fill="var(--navy)" />
        <path d="M16 30 L45 20 L67 14 L96 6" fill="none" stroke="var(--ie)" strokeWidth="2.5" strokeLinecap="round" />
      </g>

      {/* คลังสินค้า */}
      <g filter="url(#cv-soft)">
        <path d="M70 200 L160 150 L250 200 Z" fill="url(#cv-roof)" />
        <rect x="80" y="198" width="160" height="120" fill="var(--cv-wall)" />
        <rect x="102" y="232" width="74" height="86" rx="4" fill="url(#cv-shutter)" stroke="var(--cv-line)" strokeWidth="2" />
        <rect x="190" y="232" width="36" height="28" rx="4" fill="var(--cv-sky-b)" stroke="var(--cv-line)" strokeWidth="2" />
        <rect x="132" y="206" width="56" height="18" rx="5" fill="var(--navy)" />
        <text x="160" y="219.5" textAnchor="middle" fontSize="12" fontWeight="800" fill="#fff" fontFamily="var(--font-mono)">LE</text>
      </g>

      {/* กองกล่องสินค้า */}
      <g stroke="var(--cv-box-line)" strokeWidth="2">
        {[[246, 288, 30], [278, 288, 30], [262, 258, 30]].map(([x, y, s], i) => (
          <g key={i}>
            <rect x={x} y={y} width={s} height={s} rx="3" fill="var(--cv-box)" />
            <path d={`M${x + s / 2 - 5} ${y} V${y + 10} M${x + s / 2 + 5} ${y} V${y + 10}`} />
          </g>
        ))}
      </g>

      {/* โรงงาน (วิศวกรรมอุตสาหการ) หลังคาฟันเลื่อย + เฟือง */}
      <g filter="url(#cv-soft)">
        <rect x="430" y="150" width="18" height="70" fill="var(--cv-line)" />
        <path d="M330 220 V182 L362 200 V182 L394 200 V182 L426 200 V182 L458 200 V318 H330 Z" fill="var(--cv-wall)" />
        <path d="M330 182 L362 200 M362 182 L394 200 M394 182 L426 200 M426 182 L458 200" stroke="var(--navy2)" strokeWidth="5" strokeLinecap="round" />
        {[350, 384, 418].map(x => <rect key={x} x={x} y="236" width="22" height="18" rx="3" fill="var(--cv-sky-b)" stroke="var(--cv-line)" strokeWidth="2" />)}
        <g transform="translate(394 286)">
          <circle r="17" fill="var(--ie)" />
          {[0, 45, 90, 135].map(a => <rect key={a} x="-3.5" y="-23" width="7" height="46" rx="2" fill="var(--ie)" transform={`rotate(${a})`} />)}
          <circle r="7" fill="var(--cv-wall)" />
        </g>
      </g>
      <g fill="var(--card)" opacity=".85">
        <circle cx="446" cy="138" r="9" /><circle cx="458" cy="124" r="12" /><circle cx="476" cy="114" r="8" />
      </g>

      {/* ถนนและรถขนส่ง */}
      <path d="M40 360 H580" stroke="var(--cv-line)" strokeWidth="22" strokeLinecap="round" opacity=".55" />
      <path d="M60 360 H560" stroke="var(--card)" strokeWidth="3" strokeDasharray="16 14" />
      <g transform="translate(150 300)" filter="url(#cv-soft)">
        <rect x="0" y="0" width="150" height="54" rx="8" fill="var(--card)" stroke="var(--navy2)" strokeWidth="3" />
        <path d="M14 18 H60 M14 30 H96 M14 42 H78" stroke="var(--gold)" strokeWidth="5" strokeLinecap="round" />
        <path d="M150 14 H186 L210 34 V54 H150 Z" fill="var(--navy)" />
        <path d="M158 20 H182 L198 34 H158 Z" fill="var(--cv-sky-b)" />
        {[36, 116, 184].map(x => (
          <g key={x}><circle cx={x} cy="58" r="13" fill="var(--cv-tire)" /><circle cx={x} cy="58" r="5" fill="var(--card)" /></g>
        ))}
      </g>
      <g stroke="var(--navy2)" strokeWidth="3" strokeLinecap="round" opacity=".6">
        <path d="M100 318 H132" /><path d="M86 330 H126" /><path d="M110 342 H138" />
      </g>
    </svg>
  );
}
