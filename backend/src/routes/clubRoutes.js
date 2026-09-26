const express = require("express");

const {
  createClub,
  getAllClubs,
  getClubById,
  updateClub,
  deleteClub,
} = require("../controllers/clubController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/", protect, authorizeRoles("ADMIN"), createClub);

router.get("/", protect, getAllClubs);

router.get("/:id", protect, getClubById);

router.put("/:id", protect, authorizeRoles("ADMIN"), updateClub);

router.delete("/:id", protect, authorizeRoles("ADMIN"), deleteClub);

module.exports = router;
