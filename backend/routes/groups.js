const express = require("express");
const router = express.Router();
const prisma = require("../prismaClient");

router.post("/", async (req, res) => {
  try {
    const { name, sportId, coachId } = req.body;

    const group = await prisma.group.create({
      data: {
        name,
        sportId: Number(sportId),
        coachId: coachId ? Number(coachId) : null,
      },
      include: { sport: true, coach: true },
    });

    res.status(201).json({ message: "تم إضافة الجروب", group });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "خطأ أثناء إضافة الجروب" });
  }
});

router.get("/", async (req, res) => {
  try {
    const sportId = req.query.sportId ? Number(req.query.sportId) : null;

    const groups = await prisma.group.findMany({
      where: sportId ? { sportId } : {},
      include: { sport: true, coach: true },
    });

    res.json(groups);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "خطأ أثناء جلب الجروبات" });
  }
});

module.exports = router;
