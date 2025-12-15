const mongoose = require("mongoose");

const coachSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  phone: String,
  specialty: String,
});

module.exports = mongoose.model("Coach", coachSchema);
