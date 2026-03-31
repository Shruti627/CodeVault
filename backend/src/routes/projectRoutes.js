const express = require("express");
const router = express.Router();

const projectController = require("../controllers/projectController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const upload = require("../middlewares/uploadMiddleware");
const { hasPurchasedProject } = require("../middlewares/purchaseMiddleware");

/**
 * PUBLIC/BUYER: View all approved projects
 * GET /api/projects
 */
router.get("/", projectController.getApprovedProjects);

/**
 * SELLER: Upload a new project
 * POST /api/projects
 */
router.post(
  "/",
  authMiddleware,
  roleMiddleware("seller"),
  (req, res, next) => {
    upload.single("sourceCodeZip")(req, res, (err) => {
      if (err) return res.status(400).json({ message: err.message });
      next();
    });
  },
  projectController.uploadProject
);

/**
 * SELLER: View own projects
 * GET /api/projects/my
 */
router.get(
  "/my",
  authMiddleware,
  roleMiddleware("seller"),
  projectController.getMyProjects
);

/**
 * BUYER: Download project source code
 * GET /api/projects/download/:projectId
 */
router.get(
  "/download/:projectId",
  authMiddleware,
  roleMiddleware("buyer"),
  hasPurchasedProject,
  projectController.downloadProject
);

/**
 * ADMIN: Approve a project
 * PATCH /api/projects/:projectId/approve
 */
router.patch(
  "/:projectId/approve",
  authMiddleware,
  roleMiddleware("admin"),
  projectController.approveProject
);

/**
 * ADMIN: Reject a project
 * PATCH /api/projects/:projectId/reject
 */
router.patch(
  "/:projectId/reject",
  authMiddleware,
  roleMiddleware("admin"),
  projectController.rejectProject
);

/**
 * ADMIN: View all projects (unfiltered)
 * GET /api/projects/admin
 */
router.get(
  "/admin",
  authMiddleware,
  roleMiddleware("admin"),
  projectController.getAllProjectsForAdmin
);
/**
 * BUYER: View owned projects
 * GET /api/projects/owned
 */
router.get(
  "/owned",
  authMiddleware,
  roleMiddleware("buyer"),
  projectController.getOwnedProjects
);

module.exports = router;