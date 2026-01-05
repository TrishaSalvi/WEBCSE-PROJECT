const Expense = require("../models/Expense");
const Group = require("../models/Group");

/**
 * @route   POST /expenses
 * @desc    Add a new expense
 */
exports.addExpense = async (req, res) => {
  try {
    const {
      groupId,
      amount,
      payer,
      participants,
      splitType,
      description,
      date
    } = req.body;

    if (!groupId || !amount || !payer || !participants || !splitType) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const expense = await Expense.create({
      groupId,
      amount,
      payer,
      participants,
      splitType,
      description,
      date: date || new Date()
    });

    // Add expense to group ledger
    await Group.findByIdAndUpdate(groupId, {
      $push: { ledger: expense._id }
    });

    res.status(201).json({
      message: "Expense added successfully",
      expense
    });
  } catch (error) {
    console.error("Add expense error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @route   GET /expenses/group/:groupId
 * @desc    Get all expenses + settlement for a group
 */
exports.getGroupLedger = async (req, res) => {
  try {
    const { groupId } = req.params;

    const expenses = await Expense.find({ groupId })
      .populate("payer", "name email")
      .populate("participants.user", "name email")
      .sort({ date: 1 });

    // Calculate balances
    const balances = {};

    expenses.forEach(exp => {
      const total = exp.amount;

      exp.participants.forEach(p => {
        const userId = p.user._id.toString();
        const share = p.share;

        if (!balances[userId]) balances[userId] = 0;
        balances[userId] -= share;
      });

      const payerId = exp.payer._id.toString();
      if (!balances[payerId]) balances[payerId] = 0;
      balances[payerId] += total;
    });

    // Settlement algorithm
    const creditors = [];
    const debtors = [];

    for (const userId in balances) {
      if (balances[userId] > 0) {
        creditors.push({ userId, amount: balances[userId] });
      } else if (balances[userId] < 0) {
        debtors.push({ userId, amount: -balances[userId] });
      }
    }

    const settlements = [];
    let i = 0, j = 0;

    while (i < debtors.length && j < creditors.length) {
      const payAmount = Math.min(debtors[i].amount, creditors[j].amount);

      settlements.push({
        from: debtors[i].userId,
        to: creditors[j].userId,
        amount: payAmount
      });

      debtors[i].amount -= payAmount;
      creditors[j].amount -= payAmount;

      if (debtors[i].amount === 0) i++;
      if (creditors[j].amount === 0) j++;
    }

    res.json({
      expenses,
      balances,
      settlements
    });
  } catch (error) {
    console.error("Get ledger error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
