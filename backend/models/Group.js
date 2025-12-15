const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  sportId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Sport",
    required: true,
  },
  coachId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Coach",
  },
  schedule: String,
});

module.exports = mongoose.model("Group", groupSchema);
