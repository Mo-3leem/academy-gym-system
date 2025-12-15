// src/pages/AddMember.tsx
import React, { useEffect, useState } from "react";
import { getSports, createMember, type Sport } from "../api";

interface MemberForm {
  name: string;
  phone: string;
  gender: "" | "ذكر" | "أنثى";
  birthDate: string;
  interests: {
    gym: boolean;
    academy: boolean;
    academySports: string[]; // IDs of sports
  };
  notes: string;
}

const AddMember: React.FC = () => {
  const [sports, setSports] = useState<Sport[]>([]);
  const [loadingSports, setLoadingSports] = useState<boolean>(false);
  const [form, setForm] = useState<MemberForm>({
    name: "",
    phone: "",
    gender: "",
    birthDate: "",
    interests: {
      gym: false,
      academy: false,
      academySports: [],
    },
    notes: "",
  });

  useEffect(() => {
    const fetchSports = async () => {
      try {
        setLoadingSports(true);
        const data = await getSports();
        setSports(data);
      } catch (error) {
        console.error(error);
        alert("خطأ أثناء جلب الرياضات");
      } finally {
        setLoadingSports(false);
      }
    };
    fetchSports();
  }, []);

  const handleBasicChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleInterestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      interests: {
        ...prev.interests,
        [name]: checked,
      },
    }));
  };

  const handleSportSelect = (sportId: string) => {
    setForm((prev) => {
      const exists = prev.interests.academySports.includes(sportId);
      return {
        ...prev,
        interests: {
          ...prev.interests,
          academySports: exists
            ? prev.interests.academySports.filter((id) => id !== sportId)
            : [...prev.interests.academySports, sportId],
        },
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMember(form);
      alert("✅ تم إضافة العضو بنجاح");
      setForm({
        name: "",
        phone: "",
        gender: "",
        birthDate: "",
        interests: {
          gym: false,
          academy: false,
          academySports: [],
        },
        notes: "",
      });
    } catch (error) {
      console.error(error);
      alert("❌ حدث خطأ أثناء إضافة العضو");
    }
  };

  return (
    <div style={{ maxWidth: 600 }}>
      <h2>إضافة عضو جديد</h2>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 10 }}>
        <label>
          الاسم:
          <input
            name="name"
            value={form.name}
            onChange={handleBasicChange}
            required
          />
        </label>

        <label>
          رقم الهاتف:
          <input
            name="phone"
            value={form.phone}
            onChange={handleBasicChange}
            required
          />
        </label>

        <label>
          النوع:
          <select
            name="gender"
            value={form.gender}
            onChange={handleBasicChange}
          >
            <option value="">اختر</option>
            <option value="ذكر">ذكر</option>
            <option value="أنثى">أنثى</option>
          </select>
        </label>

        <label>
          تاريخ الميلاد:
          <input
            type="date"
            name="birthDate"
            value={form.birthDate}
            onChange={handleBasicChange}
          />
        </label>

        <div>
          <span>الاهتمامات:</span>
          <div>
            <label style={{ marginRight: 10 }}>
              <input
                type="checkbox"
                name="gym"
                checked={form.interests.gym}
                onChange={handleInterestChange}
              />
              جيم
            </label>
            <label>
              <input
                type="checkbox"
                name="academy"
                checked={form.interests.academy}
                onChange={handleInterestChange}
              />
              أكاديمية فنون قتالية
            </label>
          </div>
        </div>

        {form.interests.academy && (
          <div>
            <span>الرياضات المهتم بها:</span>
            {loadingSports && <p>جاري تحميل الرياضات...</p>}
            {!loadingSports && sports.length === 0 && (
              <p>لا توجد رياضات مسجّلة حتى الآن.</p>
            )}
            {!loadingSports &&
              sports.map((sport) => (
                <label key={sport._id} style={{ display: "block" }}>
                  <input
                    type="checkbox"
                    checked={form.interests.academySports.includes(sport._id)}
                    onChange={() => handleSportSelect(sport._id)}
                  />
                  {sport.name}
                </label>
              ))}
          </div>
        )}

        <label>
          ملاحظات:
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleBasicChange}
          />
        </label>

        <button type="submit">حفظ العضو</button>
      </form>
    </div>
  );
};

export default AddMember;
