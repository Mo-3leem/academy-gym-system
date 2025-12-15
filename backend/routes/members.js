const express = require("express");
const router = express.Router();
const prisma = require("../prismaClient");

// Create a new member
router.post("/", async (req, res) => {
  try {
    const { name, phone, gender, birthDate, interests, notes } = req.body;

    const member = await prisma.$transaction(async (tx) => {
      const created = await tx.member.create({
        data: {
          name,
          phone: phone || null,
          gender: gender || null,
          birthDate: birthDate ? new Date(birthDate) : null,
          interests: interests ?? null,
          notes: notes || null,
        },
      });

      const code = `FA-${String(created.id).padStart(4, "0")}`;

      return tx.member.update({
        where: { id: created.id },
        data: { code },
      });
    });

    res.status(201).json({ message: "✅ تم إضافة العضو بنجاح", member });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "❌ حدث خطأ أثناء إضافة العضو", error: err.message });
  }
});

// Get all members with optional search (name, phone, code)
router.get("/", async (req, res) => {
  try {
    const search = (req.query.search || "").trim();

    const where = search
      ? {
          OR: [
            { name: { contains: search } },
            { phone: { contains: search } },
            { code: { contains: search } },
          ],
        }
      : {};

    const members = await prisma.member.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    res.json(members);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "❌ حدث خطأ أثناء جلب الأعضاء", error: err.message });
  }
});

// Get single member by id
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const member = await prisma.member.findUnique({ where: { id } });
    if (!member) return res.status(404).json({ message: "العضو غير موجود" });

    res.json(member);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({
        message: "❌ حدث خطأ أثناء جلب بيانات العضو",
        error: err.message,
      });
  }
});

module.exports = router;
