const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  memberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Member",
    required: true,
  },
  planId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Plan",
    required: true,
  },
  type: {
    type: String,
    enum: ["gym", "sport"],
    required: true,
  },
  sportId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Sport",
  },
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
  },
  coachId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Coach",
  },
  privateTrainer: {
    type: Boolean,
    default: false,
  },
  classTypes: [String],
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Subscription", subscriptionSchema);
