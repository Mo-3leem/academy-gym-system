// backend/models/Member.js
const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  gender: {
    type: String,
    enum: ["ذكر", "أنثى"],
  },
  birthDate: {
    type: Date,
  },
  interests: {
    gym: {
      type: Boolean,
      default: false,
    },
    academy: {
      type: Boolean,
      default: false,
    },
    academySports: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Sport",
      },
    ],
  },
  notes: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Member", memberSchema);
