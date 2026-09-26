const Activity = require("../models/Activity");
const Club = require("../models/Club");

const createActivity = async (req, res) => {
  try {
    const { title, description, clubId, date, location, status } = req.body;

    if (!title || !description || !clubId || !date || !location) {
      return res.status(400).json({
        success: false,
        message: "Title, description, club ID, date and location are required",
      });
    }

    const club = await Club.findById(clubId);

    if (!club) {
      return res.status(404).json({
        success: false,
        message: "Club not found",
      });
    }

    if (club.status !== "ACTIVE") {
      return res.status(400).json({
        success: false,
        message: "Cannot create activity for an inactive club",
      });
    }

    const activity = await Activity.create({
      title,
      description,
      club: clubId,
      date,
      location,
      createdBy: req.user._id,
      status: status || "UPCOMING",
    });

    res.status(201).json({
      success: true,
      message: "Activity created successfully",
      activity,
    });
  } catch (error) {
    console.error("Create activity error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error while creating activity",
    });
  }
};

const getAllActivities = async (req, res) => {
  try {
    const activities = await Activity.find()
      .populate("club", "name category")
      .populate("createdBy", "name email")
      .sort({ date: 1 });

    res.status(200).json({
      success: true,
      count: activities.length,
      activities,
    });
  } catch (error) {
    console.error("Get activities error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error while fetching activities",
    });
  }
};

const getActivitiesByClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.clubId);

    if (!club) {
      return res.status(404).json({
        success: false,
        message: "Club not found",
      });
    }

    const activities = await Activity.find({
      club: req.params.clubId,
    })
      .populate("club", "name category")
      .populate("createdBy", "name email")
      .sort({ date: 1 });

    res.status(200).json({
      success: true,
      count: activities.length,
      activities,
    });
  } catch (error) {
    console.error("Get club activities error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error while fetching club activities",
    });
  }
};

const getActivityById = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id)
      .populate("club", "name description category")
      .populate("createdBy", "name email");

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: "Activity not found",
      });
    }

    res.status(200).json({
      success: true,
      activity,
    });
  } catch (error) {
    console.error("Get activity error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error while fetching activity",
    });
  }
};

const updateActivity = async (req, res) => {
  try {
    const { title, description, clubId, date, location, status } = req.body;

    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: "Activity not found",
      });
    }

    if (clubId) {
      const club = await Club.findById(clubId);

      if (!club) {
        return res.status(404).json({
          success: false,
          message: "Club not found",
        });
      }

      if (club.status !== "ACTIVE") {
        return res.status(400).json({
          success: false,
          message: "Cannot assign activity to an inactive club",
        });
      }

      activity.club = clubId;
    }

    if (title) {
      activity.title = title;
    }

    if (description) {
      activity.description = description;
    }

    if (date) {
      activity.date = date;
    }

    if (location) {
      activity.location = location;
    }

    if (status) {
      activity.status = status;
    }

    await activity.save();

    res.status(200).json({
      success: true,
      message: "Activity updated successfully",
      activity,
    });
  } catch (error) {
    console.error("Update activity error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error while updating activity",
    });
  }
};

const deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: "Activity not found",
      });
    }

    await Activity.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Activity deleted successfully",
    });
  } catch (error) {
    console.error("Delete activity error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error while deleting activity",
    });
  }
};

module.exports = {
  createActivity,
  getAllActivities,
  getActivitiesByClub,
  getActivityById,
  updateActivity,
  deleteActivity,
};
