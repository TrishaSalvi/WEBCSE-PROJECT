const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");
const Group = require("../models/Group");
const Settlement = require("../models/Settlement");
const auth = require("../middleware/authMiddleware");

// Get all expenses for a group
router.get("/group/:groupId", auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ group: req.params.groupId })
      .populate("paidBy", "name email")
      .populate("splits.user", "name email")
      .sort({ date: -1 });
    
    res.json(expenses);
  } catch (err) {
    console.error("Error fetching expenses:", err);
    res.status(500).json({ message: "Error fetching expenses" });
  }
});

// Add new expense
router.post("/", auth, async (req, res) => {
  try {
    const { groupId, description, amount, splitType, splits, category } = req.body;
    
    if (!groupId || !description || !amount) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Verify user is member of group
    const group = await Group.findById(groupId);
    if (!group || !group.members.includes(req.user.id)) {
      return res.status(403).json({ message: "Not a member of this group" });
    }

    let expenseSplits = [];
    
    if (splitType === "equal") {
      // Equal split among all members
      const splitAmount = amount / group.members.length;
      expenseSplits = group.members.map(memberId => ({
        user: memberId,
        amount: parseFloat(splitAmount.toFixed(2))
      }));
    } else if (splitType === "custom") {
      // Custom splits provided
      expenseSplits = splits;
    }

    const expense = new Expense({
      group: groupId,
      description,
      amount: parseFloat(amount),
      paidBy: req.user.id,
      splitType,
      splits: expenseSplits,
      category: category || "General"
    });

    await expense.save();
    
    // Populate before sending response
    await expense.populate("paidBy", "name email");
    await expense.populate("splits.user", "name email");
    
    res.status(201).json(expense);
  } catch (err) {
    console.error("Error creating expense:", err);
    res.status(500).json({ message: "Error creating expense" });
  }
});

// Calculate balances for a group
router.get("/balances/:groupId", auth, async (req, res) => {
  try {
    const groupId = req.params.groupId;
    
    // Get all expenses
    const expenses = await Expense.find({ group: groupId });
    
    // Get all settlements
    const settlements = await Settlement.find({ group: groupId });
    
    // Calculate net balances
    const balances = {};
    
    // Process expenses
    expenses.forEach(expense => {
      const paidById = expense.paidBy.toString();
      
      // Person who paid gets credited
      balances[paidById] = (balances[paidById] || 0) + expense.amount;
      
      // Each person in split owes their share
      expense.splits.forEach(split => {
        const userId = split.user.toString();
        balances[userId] = (balances[userId] || 0) - split.amount;
      });
    });
    
    // Process settlements
    settlements.forEach(settlement => {
      const fromId = settlement.from.toString();
      const toId = settlement.to.toString();
      
      balances[fromId] = (balances[fromId] || 0) + settlement.amount;
      balances[toId] = (balances[toId] || 0) - settlement.amount;
    });
    
    // Get group members for user details
    const group = await Group.findById(groupId).populate("members", "name email");
    
    // Format response with user details
    const balanceDetails = group.members.map(member => ({
      user: {
        _id: member._id,
        name: member.name,
        email: member.email
      },
      balance: parseFloat((balances[member._id.toString()] || 0).toFixed(2))
    }));
    
    res.json(balanceDetails);
  } catch (err) {
    console.error("Error calculating balances:", err);
    res.status(500).json({ message: "Error calculating balances" });
  }
});

// Get settlement suggestions (who should pay whom)
router.get("/settlements/:groupId", auth, async (req, res) => {
  try {
    const groupId = req.params.groupId;
    
    // Get balances
    const expenses = await Expense.find({ group: groupId });
    const settlements = await Settlement.find({ group: groupId });
    const group = await Group.findById(groupId).populate("members", "name email");
    
    const balances = {};
    
    expenses.forEach(expense => {
      const paidById = expense.paidBy.toString();
      balances[paidById] = (balances[paidById] || 0) + expense.amount;
      expense.splits.forEach(split => {
        const userId = split.user.toString();
        balances[userId] = (balances[userId] || 0) - split.amount;
      });
    });
    
    settlements.forEach(settlement => {
      const fromId = settlement.from.toString();
      const toId = settlement.to.toString();
      balances[fromId] = (balances[fromId] || 0) + settlement.amount;
      balances[toId] = (balances[toId] || 0) - settlement.amount;
    });
    
    // Separate debtors and creditors
    const debtors = [];
    const creditors = [];
    
    Object.entries(balances).forEach(([userId, balance]) => {
      if (balance < -0.01) {
        debtors.push({ userId, amount: -balance });
      } else if (balance > 0.01) {
        creditors.push({ userId, amount: balance });
      }
    });
    
    // Calculate optimal settlements
    const suggestions = [];
    
    debtors.sort((a, b) => b.amount - a.amount);
    creditors.sort((a, b) => b.amount - a.amount);
    
    let i = 0, j = 0;
    
    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i];
      const creditor = creditors[j];
      
      const amount = Math.min(debtor.amount, creditor.amount);
      
      const debtorUser = group.members.find(m => m._id.toString() === debtor.userId);
      const creditorUser = group.members.find(m => m._id.toString() === creditor.userId);
      
      suggestions.push({
        from: {
          _id: debtor.userId,
          name: debtorUser?.name,
          email: debtorUser?.email
        },
        to: {
          _id: creditor.userId,
          name: creditorUser?.name,
          email: creditorUser?.email
        },
        amount: parseFloat(amount.toFixed(2))
      });
      
      debtor.amount -= amount;
      creditor.amount -= amount;
      
      if (debtor.amount < 0.01) i++;
      if (creditor.amount < 0.01) j++;
    }
    
    res.json(suggestions);
  } catch (err) {
    console.error("Error calculating settlements:", err);
    res.status(500).json({ message: "Error calculating settlements" });
  }
});

// Record a settlement
router.post("/settle", auth, async (req, res) => {
  try {
    const { groupId, toUserId, amount, note } = req.body;
    
    if (!groupId || !toUserId || !amount) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    
    const settlement = new Settlement({
      group: groupId,
      from: req.user.id,
      to: toUserId,
      amount: parseFloat(amount),
      note
    });
    
    await settlement.save();
    
    res.status(201).json({ message: "Settlement recorded", settlement });
  } catch (err) {
    console.error("Error recording settlement:", err);
    res.status(500).json({ message: "Error recording settlement" });
  }
});

// Delete expense (only by creator)
router.delete("/:expenseId", auth, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.expenseId);
    
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    
    if (expense.paidBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Only creator can delete" });
    }
    
    await expense.deleteOne();
    res.json({ message: "Expense deleted" });
  } catch (err) {
    console.error("Error deleting expense:", err);
    res.status(500).json({ message: "Error deleting expense" });
  }
});

module.exports = router;