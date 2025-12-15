const express = require("express");
const router = express.Router();
const Member = require("../models/Member");

// Generate code for new member
async function generateMemberCode() {
  const count = await Member.countDocuments();
  const number = (count + 1).toString().padStart(4, "0");
  return `FA-${number}`;
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Create a new member
router.post("/", async (req, res) => {
  try {
    const { name, phone, gender, birthDate, interests, notes } = req.body;

    const code = await generateMemberCode();

    const member = new Member({
      code,
      name,
      phone,
      gender,
      birthDate,
      interests,
      notes,
    });

    await member.save();

    res.status(201).json({
      message: "✅ تم إضافة العضو بنجاح",
      member,
    });
  } catch (err) {
    console.error("Error while creating member:", err);
    res
      .status(500)
      .json({ message: "❌ حدث خطأ أثناء إضافة العضو", error: err.message });
  }
});

// Get all members with optional search (name, phone, code)
router.get("/", async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search && search.trim() !== "") {
      const safe = escapeRegex(search.trim());
      const regex = new RegExp(safe, "i");

      query = {
        $or: [{ name: regex }, { phone: regex }, { code: regex }],
      };
    }

    const members = await Member.find(query).sort({ createdAt: -1 }).lean();

    res.json(members);
  } catch (err) {
    console.error("Error while fetching members:", err);
    res
      .status(500)
      .json({ message: "❌ حدث خطأ أثناء جلب الأعضاء", error: err.message });
  }
});

// Get single member by id
router.get("/:id", async (req, res) => {
  try {
    const member = await Member.findById(req.params.id).lean();

    if (!member) {
      return res.status(404).json({ message: "العضو غير موجود" });
    }

    res.json(member);
  } catch (err) {
    console.error("Error while fetching member by id:", err);
    res.status(500).json({
      message: "❌ حدث خطأ أثناء جلب بيانات العضو",
      error: err.message,
    });
  }
});

module.exports = router;
