const Project = require("../models/Project");
const Purchase = require("../models/Purchase");
const path = require("path");
const fs = require("fs");

/* =====================================================
   SELLER: UPLOAD PROJECT (WITH SOURCE CODE ZIP)
   ===================================================== */
exports.uploadProject = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Source code ZIP required" });
    }

    const project = await Project.create({
      title: req.body.title,
      description: req.body.description,
      techStack: req.body.techStack,
      price: req.body.price,
      githubRepo: req.body.githubRepo,
      demoLink: req.body.demoLink,
      sourceCodeZip: req.file.path, // stored as relative path
      seller: req.user.id,
      isApproved: false
    });

    res.status(201).json({
      message: "Project uploaded successfully (awaiting admin approval)",
      project
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* =====================================================
   ADMIN: APPROVE PROJECT
   ===================================================== */
exports.approveProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.isApproved) {
      return res.status(400).json({ message: "Project already approved" });
    }

    project.isApproved = true;
    project.rejectionReason = undefined;
    await project.save();

    res.status(200).json({ message: "Project approved successfully" });
  } catch (err) {
    console.error("Approve error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* =====================================================
   ADMIN: REJECT PROJECT
   ===================================================== */
exports.rejectProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({ message: "Rejection reason required" });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    project.isApproved = false;
    project.rejectionReason = reason;
    await project.save();

    res.status(200).json({ message: "Project rejected successfully" });
  } catch (err) {
    console.error("Reject error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* =====================================================
   ADMIN: VIEW ALL PROJECTS
   ===================================================== */
exports.getAllProjectsForAdmin = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("seller", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json(projects);
  } catch (err) {
    console.error("Admin list error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* =====================================================
   BUYER: VIEW APPROVED PROJECTS
   ===================================================== */
exports.getApprovedProjects = async (req, res) => {
  try {
    const projects = await Project.find({ isApproved: true })
      .select("-sourceCodeZip")
      .populate("seller", "name email");

    res.status(200).json(projects);
  } catch (err) {
    console.error("Approved list error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* =====================================================
   SELLER: VIEW OWN PROJECTS
   ===================================================== */
exports.getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({ seller: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json(projects);
  } catch (err) {
    console.error("My projects error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* =====================================================
   BUYER: DOWNLOAD SOURCE CODE (SECURE + FIXED)
   ===================================================== */
  // this is a demoversion for testing download functionality only
  
// exports.downloadProject = async (req, res) => {
//   try {
//     console.log("DOWNLOAD HIT");
//     console.log("User:", req.user);
//     console.log("Project ID:", req.params.projectId);

//     const project = await Project.findById(req.params.projectId);
//     console.log("Project:", project);

//     const hasPurchased = await Purchase.findOne({
//       buyer: req.user.id,
//       project: req.params.projectId
//     });

//     console.log("Purchase:", hasPurchased);

//     return res.json({
//       ok: true,
//       projectExists: !!project,
//       purchased: !!hasPurchased
//     });
//   } catch (err) {
//     console.error("DOWNLOAD ERROR:", err);
//     return res.status(500).json({ message: err.message });
//   }
// };

exports.downloadProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project || !project.sourceCodeZip) {
      return res.status(404).json({ message: "Project or file not found" });
    }

    const filePath = path.resolve(project.sourceCodeZip);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Source file missing" });
    }

    return res.download(filePath);
  } catch (err) {
    console.error("DOWNLOAD ERROR:", err);
    res.status(500).json({ message: "Download failed" });
  }
};




/* =====================================================
   BUYER: VIEW OWNED PROJECTS
   ===================================================== */
exports.getOwnedProjects = async (req, res) => {
  try {
    const purchases = await Purchase.find({
      buyer: req.user.id,
      status: "paid"
    }).populate({
      path: "project",
      select: "-sourceCodeZip",
      populate: { path: "seller", select: "name email" }
    });

    const ownedProjects = purchases
      .filter(p => p.project)
      .map(p => ({
        ...p.project.toObject(),
        owned: true,
        purchasedAt: p.updatedAt
      }));

    res.status(200).json(ownedProjects);
  } catch (err) {
    console.error("Owned projects error:", err);
    res.status(500).json({ message: err.message });
  }
};
