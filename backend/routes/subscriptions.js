const express = require("express");
const router = express.Router();
const Subscription = require("../models/Subscription");
const Member = require("../models/Member");
const Plan = require("../models/Plan");
const { getSubscriptionStatus } = require("../utils/subscriptionStatus");

// create a new subscription
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

    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(400).json({ message: "الخطة غير موجودة" });
    }

    const start = startDate ? new Date(startDate) : new Date();
    const end = new Date(start);
    end.setDate(end.getDate() + plan.durationDays);

    const subscription = new Subscription({
      memberId,
      planId,
      type,
      sportId,
      groupId,
      coachId,
      privateTrainer,
      classTypes,
      startDate: start,
      endDate: end,
    });

    await subscription.save();

    res.status(201).json({ message: "تم إنشاء الاشتراك بنجاح", subscription });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "خطأ أثناء إنشاء الاشتراك" });
  }
});

// get subscriptions for a member
router.get("/member/:memberId", async (req, res) => {
  try {
    const subs = await Subscription.find({ memberId: req.params.memberId })
      .populate("planId")
      .populate("sportId")
      .populate("groupId")
      .populate("coachId");

    const withStatus = subs.map((sub) => ({
      ...sub.toObject(),
      status: getSubscriptionStatus(sub),
    }));

    res.json(withStatus);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "خطأ أثناء جلب الاشتراكات" });
  }
});

module.exports = router;
