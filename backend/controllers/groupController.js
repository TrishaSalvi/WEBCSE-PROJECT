const Group = require("../models/Group");

exports.createGroup = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Group name is required" });
    }

   
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const group = await Group.create({
      name,
      createdBy: req.user.id,
      members: [req.user.id], 
    });

    res.status(201).json(group);
  } catch (error) {
    console.error("Create group error:", error);
    res.status(500).json({ message: "Error creating group" });
  }
};
