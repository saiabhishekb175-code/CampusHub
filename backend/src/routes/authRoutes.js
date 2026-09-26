const express = require("express");

const { registerUser, loginUser } = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/me", protect, (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

router.get("/admin-test", protect, authorizeRoles("ADMIN"), (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome Admin! You have access to this route.",
  });
});

module.exports = router;
