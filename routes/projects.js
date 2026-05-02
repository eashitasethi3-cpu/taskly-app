const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const authMiddleware = require("../middleware/auth");

// Get all projects
router.get("/", authMiddleware, async (req, res) => {
  try {
    const projects = await Project.find().populate("createdBy", "name email");
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create project (Admin only)
router.post("/", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "Admin")
      return res.status(403).json({ message: "Only Admins can create projects" });
    const project = await Project.create({ ...req.body, createdBy: req.user.id });
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete project (Admin only)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "Admin")
      return res.status(403).json({ message: "Only Admins can delete projects" });
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: "Project deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;