const express = require("express");
const router = express.Router();
const prisma = require("../prismaClient");

router.post("/", async (req, res) => {
  try {
    const sport = await prisma.sport.create({ data: { name: req.body.name } });
    res.status(201).json({ message: "تم إضافة الرياضة", sport });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "خطأ أثناء إضافة الرياضة" });
  }
});

router.get("/", async (req, res) => {
  try {
    const sports = await prisma.sport.findMany({ orderBy: { name: "asc" } });
    res.json(sports);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "خطأ أثناء جلب الرياضات" });
  }
});

module.exports = router;
