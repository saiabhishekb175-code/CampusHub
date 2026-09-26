const Club = require("../models/Club");

const createClub = async (req, res) => {
  try {
    const { name, description, category, status } = req.body;

    if (!name || !description || !category) {
      return res.status(400).json({
        success: false,
        message: "Name, description and category are required",
      });
    }

    const existingClub = await Club.findOne({ name });

    if (existingClub) {
      return res.status(409).json({
        success: false,
        message: "A club with this name already exists",
      });
    }

    const club = await Club.create({
      name,
      description,
      category,
      status: status || "ACTIVE",
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Club created successfully",
      club,
    });
  } catch (error) {
    console.error("Create club error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error while creating club",
    });
  }
};

const getAllClubs = async (req, res) => {
  try {
    const clubs = await Club.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: clubs.length,
      clubs,
    });
  } catch (error) {
    console.error("Get clubs error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error while fetching clubs",
    });
  }
};
const getClubById = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id).populate(
      "createdBy",
      "name email",
    );

    if (!club) {
      return res.status(404).json({
        success: false,
        message: "Club not found",
      });
    }

    res.status(200).json({
      success: true,
      club,
    });
  } catch (error) {
    console.error("Get club error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error while fetching club",
    });
  }
};
const updateClub = async (req, res) => {
  try {
    const { name, description, category, status } = req.body;

    const club = await Club.findById(req.params.id);

    if (!club) {
      return res.status(404).json({
        success: false,
        message: "Club not found",
      });
    }

    if (name) {
      const existingClub = await Club.findOne({
        name,
        _id: { $ne: req.params.id },
      });

      if (existingClub) {
        return res.status(409).json({
          success: false,
          message: "A club with this name already exists",
        });
      }

      club.name = name;
    }

    if (description) {
      club.description = description;
    }

    if (category) {
      club.category = category;
    }

    if (status) {
      club.status = status;
    }

    await club.save();

    res.status(200).json({
      success: true,
      message: "Club updated successfully",
      club,
    });
  } catch (error) {
    console.error("Update club error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error while updating club",
    });
  }
};
const deleteClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);

    if (!club) {
      return res.status(404).json({
        success: false,
        message: "Club not found",
      });
    }

    await Club.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Club deleted successfully",
    });
  } catch (error) {
    console.error("Delete club error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error while deleting club",
    });
  }
};
module.exports = {
  createClub,
  getAllClubs,
  getClubById,
  updateClub,
  deleteClub,
};
