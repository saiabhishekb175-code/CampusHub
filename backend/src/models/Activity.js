const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    club: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Club",
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["UPCOMING", "COMPLETED", "CANCELLED"],
      default: "UPCOMING",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Activity", activitySchema);
