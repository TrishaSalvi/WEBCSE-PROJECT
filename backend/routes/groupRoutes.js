const express = require("express");
const router = express.Router();
const Group = require("../models/Group");
const User = require("../models/User");
const auth = require("../middleware/authMiddleware");

// Get all groups for logged-in user
router.get("/", auth, async (req, res) => {
  try {
    const groups = await Group.find({ 
      members: req.user.id 
    }).populate("members", "name email");
    
    res.json(groups);
  } catch (err) {
    console.error("Error fetching groups:", err);
    res.status(500).json({ message: "Error fetching groups" });
  }
});

// Get user's pending invites
router.get("/invites", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const groups = await Group.find({
      "pendingInvites.email": user.email
    }).populate("createdBy", "name email");
    
    res.json(groups);
  } catch (err) {
    console.error("Error fetching invites:", err);
    res.status(500).json({ message: "Error fetching invites" });
  }
});

// Accept invite
router.post("/invites/accept", auth, async (req, res) => {
  try {
    const { groupId } = req.body;
    const user = await User.findById(req.user.id);
    
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });
    
    // Remove from pending invites
    group.pendingInvites = group.pendingInvites.filter(
      invite => invite.email !== user.email
    );
    
    // Add to members if not already
    if (!group.members.includes(req.user.id)) {
      group.members.push(req.user.id);
    }
    
    await group.save();
    res.json({ message: "Invite accepted", group });
  } catch (err) {
    console.error("Error accepting invite:", err);
    res.status(500).json({ message: "Error accepting invite" });
  }
});

// Create Group
router.post("/", auth, async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: "Name is required" });

    const group = new Group({
      name,
      description,
      createdBy: req.user.id,
      members: [req.user.id]
    });

    await group.save();
    res.status(201).json(group);
  } catch (err) {
    console.error("❌ ERROR:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Invite Member
router.post("/invite", auth, async (req, res) => {
  try {
    const { groupId, email } = req.body;
    
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });
    
    // Check if user exists
    const userToInvite = await User.findOne({ email });
    
    if (userToInvite) {
      // User exists - add directly to members
      if (!group.members.includes(userToInvite._id)) {
        group.members.push(userToInvite._id);
      }
    } else {
      // User doesn't exist - add to pending invites
      const alreadyInvited = group.pendingInvites.some(
        invite => invite.email === email
      );
      
      if (!alreadyInvited) {
        group.pendingInvites.push({ email });
      }
    }
    
    await group.save();
    res.json({ message: "Member invited", group });
  } catch (err) {
    console.error("Invite error:", err);
    res.status(500).json({ message: "Invite failed" });
  }
});

module.exports = router;