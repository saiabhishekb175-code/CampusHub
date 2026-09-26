const express = require("express");

const {
  requestMembership,
  getMyMemberships,
  getAllMembershipRequests,
  approveMembership,
  rejectMembership,
} = require("../controllers/membershipController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/request", protect, requestMembership);

router.get("/my", protect, getMyMemberships);

router.get("/", protect, authorizeRoles("ADMIN"), getAllMembershipRequests);

router.patch(
  "/:id/approve",
  protect,
  authorizeRoles("ADMIN"),
  approveMembership,
);

router.patch("/:id/reject", protect, authorizeRoles("ADMIN"), rejectMembership);

module.exports = router;
