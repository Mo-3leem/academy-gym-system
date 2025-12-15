// src/pages/Settings.tsx
import React, { useEffect, useState } from "react";
import {
  getSports,
  createSport,
  type Sport,
  getCoaches,
  createCoach,
  type Coach,
  getGroups,
  createGroup,
  type Group,
  getPlans,
  createPlan,
  type Plan,
} from "../api";

type Tab = "sports" | "coaches" | "groups" | "plans";

const Settings: React.FC = () => {
  const [tab, setTab] = useState<Tab>("sports");

  // Sports
  const [sports, setSports] = useState<Sport[]>([]);
  const [sportForm, setSportForm] = useState({ name: "", description: "" });

  // Coaches
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [coachForm, setCoachForm] = useState({
    name: "",
    phone: "",
    specialty: "",
  });

  // Groups
  const [groups, setGroups] = useState<Group[]>([]);
  const [groupForm, setGroupForm] = useState({
    name: "",
    sportId: "",
    coachId: "",
    schedule: "",
  });

  // Plans
  const [plans, setPlans] = useState<Plan[]>([]);
  const [planForm, setPlanForm] = useState({
    name: "",
    type: "gym" as "gym" | "sport",
    durationDays: 30,
    price: "",
  });

  const [loading, setLoading] = useState(false);

  // تحميل البيانات حسب التاب الحالي
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        if (tab === "sports") {
          const s = await getSports();
          setSports(s);
        } else if (tab === "coaches") {
          const c = await getCoaches();
          setCoaches(c);
        } else if (tab === "groups") {
          const [s, c, g] = await Promise.all([
            getSports(),
            getCoaches(),
            getGroups(),
          ]);
          setSports(s);
          setCoaches(c);
          setGroups(g);
        } else if (tab === "plans") {
          const [gymPlans, sportPlans] = await Promise.all([
            getPlans("gym"),
            getPlans("sport"),
          ]);
          setPlans([...gymPlans, ...sportPlans]);
        }
      } catch (err) {
        console.error(err);
        alert("حدث خطأ أثناء تحميل البيانات");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [tab]);

  // 🥋 إضافة رياضة جديدة
  const handleSportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sportForm.name.trim()) {
      alert("من فضلك أدخل اسم الرياضة");
      return;
    }
    try {
      await createSport({
        name: sportForm.name.trim(),
        description: sportForm.description.trim() || undefined,
      });
      const s = await getSports();
      setSports(s);
      setSportForm({ name: "", description: "" });
      alert("✅ تم إضافة الرياضة");
    } catch (err) {
      console.error(err);
      alert("❌ خطأ أثناء إضافة الرياضة");
    }
  };

  // 🧑‍🏫 إضافة مدرب جديد
  const handleCoachSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coachForm.name.trim()) {
      alert("من فضلك أدخل اسم المدرب");
      return;
    }
    try {
      await createCoach({
        name: coachForm.name.trim(),
        phone: coachForm.phone.trim() || undefined,
        specialty: coachForm.specialty.trim() || undefined,
      });
      const c = await getCoaches();
      setCoaches(c);
      setCoachForm({ name: "", phone: "", specialty: "" });
      alert("✅ تم إضافة المدرب");
    } catch (err) {
      console.error(err);
      alert("❌ خطأ أثناء إضافة المدرب");
    }
  };

  // 👥 إضافة جروب جديد
  const handleGroupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupForm.name.trim() || !groupForm.sportId) {
      alert("من فضلك أدخل اسم الجروب وحدد الرياضة");
      return;
    }
    try {
      await createGroup({
        name: groupForm.name.trim(),
        sportId: groupForm.sportId,
        coachId: groupForm.coachId || undefined,
        schedule: groupForm.schedule.trim() || undefined,
      });
      const g = await getGroups();
      setGroups(g);
      setGroupForm({ name: "", sportId: "", coachId: "", schedule: "" });
      alert("✅ تم إضافة الجروب");
    } catch (err) {
      console.error(err);
      alert("❌ خطأ أثناء إضافة الجروب");
    }
  };

  // 📅 إضافة خطة اشتراك جديدة
  const handlePlanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!planForm.name.trim() || !planForm.durationDays) {
      alert("من فضلك أدخل اسم الخطة وعدد الأيام");
      return;
    }
    try {
      await createPlan({
        name: planForm.name.trim(),
        type: planForm.type,
        durationDays: Number(planForm.durationDays),
        price: planForm.price ? Number(planForm.price) : undefined,
      });
      const [gymPlans, sportPlans] = await Promise.all([
        getPlans("gym"),
        getPlans("sport"),
      ]);
      setPlans([...gymPlans, ...sportPlans]);
      setPlanForm({ name: "", type: "gym", durationDays: 30, price: "" });
      alert("✅ تم إضافة الخطة");
    } catch (err) {
      console.error(err);
      alert("❌ خطأ أثناء إضافة الخطة");
    }
  };

  return (
    <div className="settings-root">
      <h2>الإعدادات</h2>

      {/* Tabs */}
      <div className="settings-tabs">
        <button
          className={tab === "sports" ? "active" : ""}
          onClick={() => setTab("sports")}
        >
          الرياضات
        </button>
        <button
          className={tab === "coaches" ? "active" : ""}
          onClick={() => setTab("coaches")}
        >
          المدربين
        </button>
        <button
          className={tab === "groups" ? "active" : ""}
          onClick={() => setTab("groups")}
        >
          الجروبات
        </button>
        <button
          className={tab === "plans" ? "active" : ""}
          onClick={() => setTab("plans")}
        >
          خطط الاشتراك
        </button>
      </div>

      {loading && <p>جاري تحميل البيانات...</p>}

      {/* 🥋 تبويب الرياضات */}
      {tab === "sports" && !loading && (
        <div className="settings-grid">
          <section className="card">
            <h3>إضافة رياضة جديدة</h3>
            <form onSubmit={handleSportSubmit} className="form-grid">
              <label>
                اسم الرياضة:
                <input
                  value={sportForm.name}
                  onChange={(e) =>
                    setSportForm((f) => ({ ...f, name: e.target.value }))
                  }
                  required
                />
              </label>
              <label>
                وصف (اختياري):
                <textarea
                  value={sportForm.description}
                  onChange={(e) =>
                    setSportForm((f) => ({
                      ...f,
                      description: e.target.value,
                    }))
                  }
                />
              </label>
              <button type="submit">حفظ الرياضة</button>
            </form>
          </section>

          <section className="card">
            <h3>الرياضات المسجّلة</h3>
            {sports.length === 0 && <p>لا توجد رياضات حتى الآن.</p>}
            <ul className="list">
              {sports.map((s) => (
                <li key={s._id}>
                  <strong>{s.name}</strong>
                  {s.description && <span> — {s.description}</span>}
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}

      {/* 🧑‍🏫 تبويب المدربين */}
      {tab === "coaches" && !loading && (
        <div className="settings-grid">
          <section className="card">
            <h3>إضافة مدرب جديد</h3>
            <form onSubmit={handleCoachSubmit} className="form-grid">
              <label>
                الاسم:
                <input
                  value={coachForm.name}
                  onChange={(e) =>
                    setCoachForm((f) => ({ ...f, name: e.target.value }))
                  }
                  required
                />
              </label>
              <label>
                رقم الهاتف (اختياري):
                <input
                  value={coachForm.phone}
                  onChange={(e) =>
                    setCoachForm((f) => ({ ...f, phone: e.target.value }))
                  }
                />
              </label>
              <label>
                التخصص (مثال: كونغ فو، جيم...):
                <input
                  value={coachForm.specialty}
                  onChange={(e) =>
                    setCoachForm((f) => ({
                      ...f,
                      specialty: e.target.value,
                    }))
                  }
                />
              </label>
              <button type="submit">حفظ المدرب</button>
            </form>
          </section>

          <section className="card">
            <h3>المدربين المسجّلين</h3>
            {coaches.length === 0 && <p>لا يوجد مدربين حتى الآن.</p>}
            <ul className="list">
              {coaches.map((c) => (
                <li key={c._id}>
                  <strong>{c.name}</strong>
                  {c.specialty && <span> — {c.specialty}</span>}
                  {c.phone && <div>📞 {c.phone}</div>}
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}

      {/* 👥 تبويب الجروبات */}
      {tab === "groups" && !loading && (
        <div className="settings-grid">
          <section className="card">
            <h3>إضافة جروب جديد</h3>
            <form onSubmit={handleGroupSubmit} className="form-grid">
              <label>
                اسم الجروب:
                <input
                  value={groupForm.name}
                  onChange={(e) =>
                    setGroupForm((f) => ({ ...f, name: e.target.value }))
                  }
                  required
                />
              </label>

              <label>
                الرياضة:
                <select
                  value={groupForm.sportId}
                  onChange={(e) =>
                    setGroupForm((f) => ({ ...f, sportId: e.target.value }))
                  }
                  required
                >
                  <option value="">اختر الرياضة</option>
                  {sports.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                المدرب (اختياري):
                <select
                  value={groupForm.coachId}
                  onChange={(e) =>
                    setGroupForm((f) => ({ ...f, coachId: e.target.value }))
                  }
                >
                  <option value="">بدون</option>
                  {coaches.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                المواعيد (مثال: الأحد والثلاثاء 6-7م):
                <input
                  value={groupForm.schedule}
                  onChange={(e) =>
                    setGroupForm((f) => ({ ...f, schedule: e.target.value }))
                  }
                />
              </label>

              <button type="submit">حفظ الجروب</button>
            </form>
          </section>

          <section className="card">
            <h3>الجروبات المسجّلة</h3>
            {groups.length === 0 && <p>لا توجد جروبات حتى الآن.</p>}
            <ul className="list">
              {groups.map((g) => (
                <li key={g._id}>
                  <strong>{g.name}</strong>
                  <div>الرياضة: {g.sportId?.name}</div>
                  {g.coachId && <div>المدرب: {g.coachId.name}</div>}
                  {g.schedule && <div>المواعيد: {g.schedule}</div>}
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}

      {/* 📅 تبويب الخطط */}
      {tab === "plans" && !loading && (
        <div className="settings-grid">
          <section className="card">
            <h3>إضافة خطة اشتراك جديدة</h3>
            <form onSubmit={handlePlanSubmit} className="form-grid">
              <label>
                اسم الخطة:
                <input
                  value={planForm.name}
                  onChange={(e) =>
                    setPlanForm((f) => ({ ...f, name: e.target.value }))
                  }
                  required
                />
              </label>

              <label>
                نوع الخطة:
                <select
                  value={planForm.type}
                  onChange={(e) =>
                    setPlanForm((f) => ({
                      ...f,
                      type: e.target.value as "gym" | "sport",
                    }))
                  }
                >
                  <option value="gym">جيم</option>
                  <option value="sport">أكاديمية</option>
                </select>
              </label>

              <label>
                مدة الخطة (بالأيام):
                <input
                  type="number"
                  min={1}
                  value={planForm.durationDays}
                  onChange={(e) =>
                    setPlanForm((f) => ({
                      ...f,
                      durationDays: Number(e.target.value),
                    }))
                  }
                  required
                />
              </label>

              <label>
                السعر (اختياري):
                <input
                  type="number"
                  min={0}
                  value={planForm.price}
                  onChange={(e) =>
                    setPlanForm((f) => ({ ...f, price: e.target.value }))
                  }
                />
              </label>

              <button type="submit">حفظ الخطة</button>
            </form>
          </section>

          <section className="card">
            <h3>خطط الاشتراك المسجّلة</h3>
            {plans.length === 0 && <p>لا توجد خطط بعد.</p>}
            <ul className="list">
              {plans.map((p) => (
                <li key={p._id}>
                  <strong>{p.name}</strong>{" "}
                  {p.type === "gym" ? "— جيم" : "— أكاديمية"} — {p.durationDays}{" "}
                  يوم
                  {p.price !== undefined && p.price !== null && (
                    <> — {p.price} جنيـه</>
                  )}
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </div>
  );
};

export default Settings;
