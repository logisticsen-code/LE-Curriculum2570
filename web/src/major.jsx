import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MAJORS } from "./generated/meta.js";

/* ตัวสลับวิชาเอกส่วนกลาง (SRS: FR-02)
   - ค่า: "IE" | "SC" | "ALL"
   - แหล่งความจริงคือ query ?major= ใน URL เพื่อให้ลิงก์ที่แชร์เปิดวิชาเอกเดียวกันได้
   - เมื่อเปลี่ยนหน้าด้วยลิงก์ที่ไม่มี ?major= จะเติมค่าเดิมกลับเข้า URL ให้อัตโนมัติ (replace ไม่เพิ่ม history)
   - จำค่าล่าสุดไว้ใน localStorage สำหรับการเปิดเว็บครั้งถัดไป */

export const MAJOR_IDS = ["ALL", ...MAJORS.map(m => m.id)];
export const MAJOR_LABEL = {
  ALL: { short: "ทั้งหมด", th: "ทุกวิชาเอก" },
  ...Object.fromEntries(MAJORS.map(m => [m.id, { short: m.id, th: m.th, en: m.en }])),
};

const KEY = "le-major";
const valid = v => MAJOR_IDS.includes(v);
const readStored = () => {
  try { const v = localStorage.getItem(KEY); return valid(v) ? v : "ALL"; } catch { return "ALL"; }
};

const MajorCtx = createContext({ major: "ALL", setMajor: () => {} });

export function MajorProvider({ children }) {
  const { pathname, search, hash } = useLocation();
  const navigate = useNavigate();
  const fromUrl = new URLSearchParams(search).get("major");
  const [major, setMajorState] = useState(() => (valid(fromUrl) ? fromUrl : readStored()));

  /* URL เปลี่ยนเป็นค่าที่ถูกต้องอื่น (เช่น กด back) → ตามค่าใน URL */
  useEffect(() => {
    if (valid(fromUrl) && fromUrl !== major) setMajorState(fromUrl);
  }, [fromUrl]); // eslint-disable-line react-hooks/exhaustive-deps

  /* URL ไม่มี ?major= หรือค่าไม่ถูกต้อง → เติมค่าปัจจุบันกลับเข้า URL */
  useEffect(() => {
    if (fromUrl === major) return;
    if (valid(fromUrl)) return;                       // effect ด้านบนจะจัดการ
    const q = new URLSearchParams(search);
    q.set("major", major);
    navigate({ pathname, search: `?${q}`, hash }, { replace: true });
  }, [pathname, search]); // eslint-disable-line react-hooks/exhaustive-deps

  const setMajor = useCallback(v => {
    if (!valid(v)) return;
    setMajorState(v);
    try { localStorage.setItem(KEY, v); } catch { /* โหมดส่วนตัว */ }
    const q = new URLSearchParams(search);
    q.set("major", v);
    navigate({ pathname, search: `?${q}`, hash }, { replace: true });
  }, [pathname, search, hash, navigate]);

  const value = useMemo(() => ({ major, setMajor }), [major, setMajor]);
  return <MajorCtx.Provider value={value}>{children}</MajorCtx.Provider>;
}

export const useMajor = () => useContext(MajorCtx);

/* ใช้กรองรายการตามวิชาเอก: item.majors เป็น array เช่น ["IE","SC"] */
export const inMajor = (major, majors) => major === "ALL" || !majors || majors.includes(major);

export function MajorSwitch() {
  const { major, setMajor } = useMajor();
  return (
    <div className="major-switch" role="radiogroup" aria-label="เลือกวิชาเอก">
      {MAJOR_IDS.map(id => (
        <button key={id} type="button" role="radio" aria-checked={major === id}
          className={"major-opt" + (major === id ? " on" : "")}
          title={MAJOR_LABEL[id].th}
          onClick={() => setMajor(id)}>
          {MAJOR_LABEL[id].short}
        </button>
      ))}
    </div>
  );
}
