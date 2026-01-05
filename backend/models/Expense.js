const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema({
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
    required: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  paidBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  splitType: {
    type: String,
    enum: ["equal", "custom"],
    default: "equal"
  },
  splits: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    amount: {
      type: Number,
      required: true
    }
  }],
  date: {
    type: Date,
    default: Date.now
  },
  category: {
    type: String,
    default: "General"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Expense", ExpenseSchema);