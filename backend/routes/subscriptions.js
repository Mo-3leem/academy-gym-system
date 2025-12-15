const express = require("express");
const router = express.Router();
const prisma = require("../prismaClient");
const { getSubscriptionStatus } = require("../utils/subscriptionStatus");

router.post("/", async (req, res) => {
  try {
    const {
      memberId,
      planId,
      type,
      sportId,
      groupId,
      coachId,
      privateTrainer,
      classTypes,
      startDate,
    } = req.body;

    const plan = await prisma.plan.findUnique({
      where: { id: Number(planId) },
    });
    if (!plan) return res.status(400).json({ message: "الخطة غير موجودة" });

    const start = startDate ? new Date(startDate) : new Date();
    const end = new Date(start);
    end.setDate(end.getDate() + plan.durationDays);

    const subscription = await prisma.subscription.create({
      data: {
        memberId: Number(memberId),
        planId: Number(planId),
        type,
        sportId: sportId ? Number(sportId) : null,
        groupId: groupId ? Number(groupId) : null,
        coachId: coachId ? Number(coachId) : null,
        privateTrainer: privateTrainer ?? false,
        classTypes: classTypes ?? null,
        startDate: start,
        endDate: end,
      },
    });

    res.status(201).json({ message: "تم إنشاء الاشتراك بنجاح", subscription });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "خطأ أثناء إنشاء الاشتراك" });
  }
});

router.get("/member/:memberId", async (req, res) => {
  try {
    const memberId = Number(req.params.memberId);

    const subs = await prisma.subscription.findMany({
      where: { memberId },
      include: {
        plan: true,
        sport: true,
        group: { include: { sport: true, coach: true } },
        coach: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const withStatus = subs.map((sub) => ({
      ...sub,
      status: getSubscriptionStatus(sub),
    }));

    res.json(withStatus);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "خطأ أثناء جلب الاشتراكات" });
  }
});

module.exports = router;
