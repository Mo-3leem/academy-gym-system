const express = require("express");
const router = express.Router();
const Attendance = require("../models/Attendance");
const Member = require("../models/Member");
const Subscription = require("../models/Subscription");
const { getSubscriptionStatus } = require("../utils/subscriptionStatus");

// attendance with code or phone or name
router.post("/", async (req, res) => {
  try {
    const { search, type } = req.body; // type: 'gym' or 'sport'

    const member = await Member.findOne({
      $or: [
        { code: search },
        { phone: search },
        { name: { $regex: search, $options: "i" } },
      ],
    });

    if (!member) {
      return res.status(404).json({ message: "العضو غير موجود" });
    }

    const subs = await Subscription.find({ memberId: member._id }).populate(
      "planId sportId groupId coachId"
    );

    const withStatus = subs.map((sub) => ({
      ...sub.toObject(),
      status: getSubscriptionStatus(sub),
    }));

    let selectedSub = null;
    if (type) {
      selectedSub = withStatus.find((s) => s.type === type);
    }

    const attendance = new Attendance({
      memberId: member._id,
      subscriptionId: selectedSub?._id,
      type: type || null,
    });

    await attendance.save();

    res.json({
      message: "تم تسجيل الحضور",
      member,
      subscriptions: withStatus,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "خطأ أثناء تسجيل الحضور" });
  }
});

module.exports = router;
