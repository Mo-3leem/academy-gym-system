const express = require("express");
const router = express.Router();
const prisma = require("../prismaClient");
const { getSubscriptionStatus } = require("../utils/subscriptionStatus");

router.post("/", async (req, res) => {
  try {
    const { search, type } = req.body;

    const member = await prisma.member.findFirst({
      where: {
        OR: [
          { code: search },
          { phone: search },
          { name: { contains: search } },
        ],
      },
    });

    if (!member) return res.status(404).json({ message: "العضو غير موجود" });

    const subs = await prisma.subscription.findMany({
      where: { memberId: member.id },
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

    let selectedSub = null;
    if (type) selectedSub = withStatus.find((s) => s.type === type);

    await prisma.attendance.create({
      data: {
        memberId: member.id,
        subscriptionId: selectedSub?.id || null,
        type: type || null,
      },
    });

    res.json({ message: "تم تسجيل الحضور", member, subscriptions: withStatus });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "خطأ أثناء تسجيل الحضور" });
  }
});

module.exports = router;
