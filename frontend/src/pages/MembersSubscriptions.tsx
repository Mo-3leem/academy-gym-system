// src/pages/MembersSubscriptions.tsx
import React, { useState } from "react";
import {
  searchMembers,
  type Member,
  getMemberSubscriptions,
  type Subscription,
  getPlans,
  type Plan,
  getSports,
  type Sport,
  getGroups,
  type Group,
  getCoaches,
  type Coach,
  createSubscription,
  type CreateSubscriptionPayload,
} from "../api";

const MembersSubscriptions: React.FC = () => {
  const [search, setSearch] = useState("");
  const [members, setMembers] = useState<Member[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);

  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loadingSubs, setLoadingSubs] = useState(false);

  // بيانات الفورم لإنشاء اشتراك
  const [subType, setSubType] = useState<"gym" | "sport">("gym");
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [sports, setSports] = useState<Sport[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [selectedSportId, setSelectedSportId] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [selectedCoachId, setSelectedCoachId] = useState("");
  const [privateTrainer, setPrivateTrainer] = useState(false);
  const [classTypesInput, setClassTypesInput] = useState("");
  const [startDate, setStartDate] = useState("");

  const [creatingSub, setCreatingSub] = useState(false);

  // البحث عن الأعضاء
  const handleSearchMembers = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoadingMembers(true);
      const data = await searchMembers(search);
      setMembers(data);
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء البحث عن الأعضاء");
    } finally {
      setLoadingMembers(false);
    }
  };

  // عند اختيار عضو
  const handleSelectMember = async (member: Member) => {
    setSelectedMember(member);
    setSubscriptions([]);
    setLoadingSubs(true);
    try {
      const subs = await getMemberSubscriptions(member._id);
      setSubscriptions(subs);
    } catch (err) {
      console.error(err);
      alert("خطأ أثناء جلب اشتراكات العضو");
    } finally {
      setLoadingSubs(false);
    }

    // إعادة ضبط فورم الاشتراك
    setSubType("gym");
    setSelectedPlanId("");
    setSelectedSportId("");
    setSelectedGroupId("");
    setSelectedCoachId("");
    setPrivateTrainer(false);
    setClassTypesInput("");
    setStartDate("");

    // تحميل الخطط (جيم افتراضيًا)
    try {
      const gymPlans = await getPlans("gym");
      setPlans(gymPlans);
      const sps = await getSports();
      setSports(sps);
      const cs = await getCoaches();
      setCoaches(cs);
    } catch (error) {
      console.error(error);
    }
  };

  // عند تغيير نوع الاشتراك (جيم / رياضة)
  const handleChangeSubType = async (value: "gym" | "sport") => {
    setSubType(value);
    setSelectedPlanId("");
    setSelectedSportId("");
    setSelectedGroupId("");
    setSelectedCoachId("");
    setPrivateTrainer(false);
    setClassTypesInput("");

    try {
      const p = await getPlans(value);
      setPlans(p);
    } catch (error) {
      console.error(error);
      alert("خطأ أثناء جلب الخطط");
    }
  };

  // عند اختيار رياضة → نجيب الجروبات
  const handleSelectSport = async (sportId: string) => {
    setSelectedSportId(sportId);
    setSelectedGroupId("");
    try {
      const grps = await getGroups(sportId);
      setGroups(grps);
    } catch (error) {
      console.error(error);
      alert("خطأ أثناء جلب الجروبات");
    }
  };

  // إنشاء اشتراك جديد
  const handleCreateSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember) {
      alert("من فضلك اختر عضو أولاً");
      return;
    }
    if (!selectedPlanId) {
      alert("من فضلك اختر خطة اشتراك");
      return;
    }

    const payload: CreateSubscriptionPayload = {
      memberId: selectedMember._id,
      planId: selectedPlanId,
      type: subType,
    };

    if (startDate) {
      payload.startDate = startDate;
    }

    if (subType === "sport") {
      if (!selectedSportId || !selectedGroupId) {
        alert("من فضلك اختر رياضة وجروب");
        return;
      }
      payload.sportId = selectedSportId;
      payload.groupId = selectedGroupId;
      if (selectedCoachId) payload.coachId = selectedCoachId;
    }

    if (subType === "gym") {
      payload.privateTrainer = privateTrainer;
      if (classTypesInput.trim()) {
        payload.classTypes = classTypesInput
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }
    }

    try {
      setCreatingSub(true);
      await createSubscription(payload);
      alert("✅ تم إنشاء الاشتراك بنجاح");

      // إعادة تحميل الاشتراكات
      const subs = await getMemberSubscriptions(selectedMember._id);
      setSubscriptions(subs);

      // إعادة ضبط فورم الاشتراك
      setSelectedPlanId("");
      setSelectedSportId("");
      setSelectedGroupId("");
      setSelectedCoachId("");
      setPrivateTrainer(false);
      setClassTypesInput("");
      setStartDate("");
    } catch (error) {
      console.error(error);
      alert("❌ حدث خطأ أثناء إنشاء الاشتراك");
    } finally {
      setCreatingSub(false);
    }
  };

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <h2>الأعضاء والاشتراكات</h2>

      {/* البحث عن عضو */}
      <section
        style={{
          border: "1px solid #ddd",
          padding: 10,
          borderRadius: 4,
        }}
      >
        <h3>بحث عن عضو</h3>
        <form
          onSubmit={handleSearchMembers}
          style={{ display: "flex", gap: 10, alignItems: "center" }}
        >
          <input
            placeholder="اكتب الاسم أو الكود أو رقم الهاتف"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1 }}
          />
          <button type="submit" disabled={loadingMembers}>
            {loadingMembers ? "جاري البحث..." : "بحث"}
          </button>
        </form>

        {members.length > 0 && (
          <div style={{ marginTop: 10 }}>
            <h4>نتائج البحث:</h4>
            {members.map((m) => (
              <div
                key={m._id}
                style={{
                  padding: 6,
                  border: "1px solid #ccc",
                  borderRadius: 4,
                  marginBottom: 4,
                  cursor: "pointer",
                  backgroundColor:
                    selectedMember?._id === m._id ? "#e6f4ff" : "white",
                }}
                onClick={() => handleSelectMember(m)}
              >
                <strong>{m.name}</strong> — {m.phone} — كود: {m.code}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* بيانات عضو + الاشتراكات + فورم اشتراك جديد */}
      {selectedMember && (
        <section
          style={{
            border: "1px solid #ddd",
            padding: 10,
            borderRadius: 4,
          }}
        >
          <h3>بيانات العضو المختار</h3>
          <p>الاسم: {selectedMember.name}</p>
          <p>الكود: {selectedMember.code}</p>
          <p>الهاتف: {selectedMember.phone}</p>

          <hr />

          <h4>الاشتراكات الحالية</h4>
          {loadingSubs && <p>جاري تحميل الاشتراكات...</p>}
          {!loadingSubs && subscriptions.length === 0 && (
            <p>لا توجد اشتراكات مسجّلة لهذا العضو.</p>
          )}
          {!loadingSubs &&
            subscriptions.map((sub) => (
              <div
                key={sub._id}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: 4,
                  padding: 8,
                  marginBottom: 6,
                }}
              >
                <p>النوع: {sub.type === "gym" ? "جيم" : "أكاديمية"}</p>
                <p>الخطة: {sub.planId?.name ?? "-"}</p>
                {sub.type === "sport" && (
                  <>
                    <p>الرياضة: {sub.sportId?.name ?? "-"}</p>
                    <p>الجروب: {sub.groupId?.name ?? "-"}</p>
                    <p>المدرب: {sub.coachId?.name ?? "-"}</p>
                  </>
                )}
                <p>
                  من: {new Date(sub.startDate).toLocaleDateString("ar-EG")} |
                  إلى: {new Date(sub.endDate).toLocaleDateString("ar-EG")}
                </p>
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

          <hr />

          <h4>إضافة / تجديد اشتراك جديد</h4>
          <form
            onSubmit={handleCreateSubscription}
            style={{ display: "grid", gap: 10 }}
          >
            <label>
              نوع الاشتراك:
              <select
                value={subType}
                onChange={(e) =>
                  handleChangeSubType(e.target.value as "gym" | "sport")
                }
              >
                <option value="gym">جيم</option>
                <option value="sport">أكاديمية (فنون قتالية)</option>
              </select>
            </label>

            <label>
              الخطة:
              <select
                value={selectedPlanId}
                onChange={(e) => setSelectedPlanId(e.target.value)}
              >
                <option value="">اختر الخطة</option>
                {plans.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name} ({p.durationDays} يوم)
                  </option>
                ))}
              </select>
            </label>

            <label>
              تاريخ بداية الاشتراك (اختياري):
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </label>

            {subType === "sport" && (
              <>
                <label>
                  الرياضة:
                  <select
                    value={selectedSportId}
                    onChange={(e) => handleSelectSport(e.target.value)}
                  >
                    <option value="">اختر رياضة</option>
                    {sports.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  الجروب:
                  <select
                    value={selectedGroupId}
                    onChange={(e) => setSelectedGroupId(e.target.value)}
                  >
                    <option value="">اختر الجروب</option>
                    {groups.map((g) => (
                      <option key={g._id} value={g._id}>
                        {g.name} {g.schedule ? `(${g.schedule})` : ""}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  المدرب (اختياري):
                  <select
                    value={selectedCoachId}
                    onChange={(e) => setSelectedCoachId(e.target.value)}
                  >
                    <option value="">بدون تحديد</option>
                    {coaches.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </label>
              </>
            )}

            {subType === "gym" && (
              <>
                <label>
                  <input
                    type="checkbox"
                    checked={privateTrainer}
                    onChange={(e) => setPrivateTrainer(e.target.checked)}
                  />
                  يحتاج مدرب خاص (Private Trainer)
                </label>

                <label>
                  الكلاسات (اختياري) – اكتبها مفصولة بـ , مثل:
                  <br />
                  <small>زومبا, رقص شرقي, HIIT</small>
                  <input
                    value={classTypesInput}
                    onChange={(e) => setClassTypesInput(e.target.value)}
                  />
                </label>
              </>
            )}

            <button type="submit" disabled={creatingSub}>
              {creatingSub ? "جاري إنشاء الاشتراك..." : "حفظ الاشتراك"}
            </button>
          </form>
        </section>
      )}
    </div>
  );
};

export default MembersSubscriptions;
