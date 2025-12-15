const mongoose = require("mongoose");

const sportSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: String,
});

module.exports = mongoose.model("Sport", sportSchema);
