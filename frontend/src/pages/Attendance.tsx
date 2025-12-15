// src/pages/Attendance.tsx
import React, { useState } from "react";
import { registerAttendance, type AttendanceResponse } from "../api";

const Attendance: React.FC = () => {
  const [search, setSearch] = useState<string>("");
  const [type, setType] = useState<"gym" | "sport">("gym");
  const [result, setResult] = useState<AttendanceResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = await registerAttendance({ search, type });
      setResult(data);
      alert(data.message);
    } catch (error) {
      console.error(error);
      alert("❌ خطأ أثناء تسجيل الحضور أو العضو غير موجود");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600 }}>
      <h2>تسجيل حضور</h2>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 10 }}>
        <label>
          ابحث بالاسم أو الكود أو رقم الهاتف:
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            required
          />
        </label>

        <label>
          نوع الحضور:
          <select
            value={type}
            onChange={(e) => setType(e.target.value as "gym" | "sport")}
          >
            <option value="gym">جيم</option>
            <option value="sport">أكاديمية</option>
          </select>
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "جاري التسجيل..." : "تسجيل حضور"}
        </button>
      </form>

      {result && (
        <div style={{ marginTop: 20 }}>
          <h3>بيانات العضو</h3>
          <p>الاسم: {result.member.name}</p>
          <p>الكود: {result.member.code ?? "-"}</p>
          <p>رقم الهاتف: {result.member.phone ?? "-"}</p>

          <h4>الاشتراكات</h4>
          {result.subscriptions.map((sub) => (
            <div
              key={sub.id}
              style={{
                border: "1px solid #ccc",
                padding: 10,
                marginBottom: 8,
                borderRadius: 4,
              }}
            >
              <p>النوع: {sub.type === "gym" ? "جيم" : "أكاديمية"}</p>
              <p>الخطة: {sub.plan?.name ?? "-"}</p>
              <p>من: {new Date(sub.startDate).toLocaleDateString("ar-EG")}</p>
              <p>إلى: {new Date(sub.endDate).toLocaleDateString("ar-EG")}</p>
              <p>
                الحالة:{" "}
                {sub.status === "active"
                  ? "ساري ✅"
                  : sub.status === "expiringSoon"
                  ? "قارب على الانتهاء ⚠️"
                  : "منتهي ❌"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Attendance;
