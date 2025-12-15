const express = require("express");
const router = express.Router();
const prisma = require("../prismaClient");

router.post("/", async (req, res) => {
  try {
    const { type, durationDays, price, name } = req.body;

    const plan = await prisma.plan.create({
      data: {
        type,
        durationDays: Number(durationDays),
        price: price ?? null,
        name: name || null,
      },
    });

    res.status(201).json({ message: "تم إضافة الخطة", plan });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "خطأ أثناء إضافة الخطة" });
  }
});

router.get("/", async (req, res) => {
  try {
    const type = req.query.type || null;

    const plans = await prisma.plan.findMany({
      where: type ? { type } : {},
      orderBy: { durationDays: "asc" },
    });

    res.json(plans);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "خطأ أثناء جلب الخطط" });
  }
});

module.exports = router;
