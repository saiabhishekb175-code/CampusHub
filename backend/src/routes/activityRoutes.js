const express = require("express");

const {
  createActivity,
  getAllActivities,
  getActivitiesByClub,
  getActivityById,
  updateActivity,
  deleteActivity,
} = require("../controllers/activityController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/", protect, authorizeRoles("ADMIN"), createActivity);

router.get("/", protect, getAllActivities);

router.get("/club/:clubId", protect, getActivitiesByClub);

router.get("/:id", protect, getActivityById);

router.put("/:id", protect, authorizeRoles("ADMIN"), updateActivity);

router.delete("/:id", protect, authorizeRoles("ADMIN"), deleteActivity);

module.exports = router;
