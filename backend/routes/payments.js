const express = require("express");
const router = express.Router();
const prisma = require("../prismaClient");

// create payment
router.post("/", async (req, res) => {
  try {
    const { memberId, amount, method, note } = req.body;

    const payment = await prisma.payment.create({
      data: {
        memberId: Number(memberId),
        amount,
        method: method || "CASH",
        note: note || null,
      },
    });

    res.status(201).json({ message: "تم تسجيل الدفع", payment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "خطأ أثناء تسجيل الدفع" });
  }
});

// get all payments
router.get("/", async (req, res) => {
  try {
    const payments = await prisma.payment.findMany({
      include: { member: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(payments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "خطأ أثناء جلب المدفوعات" });
  }
});

module.exports = router;
