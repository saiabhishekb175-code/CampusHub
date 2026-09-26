const Membership = require("../models/Membership");
const Club = require("../models/Club");
const Notification = require("../models/Notification");

const requestMembership = async (req, res) => {
  try {
    const { clubId } = req.body;

    if (!clubId) {
      return res.status(400).json({
        success: false,
        message: "Club ID is required",
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
        message: "Cannot request membership for an inactive club",
      });
    }

    const existingMembership = await Membership.findOne({
      user: req.user._id,
      club: clubId,
    });

    if (existingMembership) {
      return res.status(409).json({
        success: false,
        message: "You have already requested membership for this club",
      });
    }

    const membership = await Membership.create({
      user: req.user._id,
      club: clubId,
      status: "PENDING",
    });

    res.status(201).json({
      success: true,
      message: "Membership request submitted successfully",
      membership,
    });
  } catch (error) {
    console.error("Membership request error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error while requesting membership",
    });
  }
};

const getAllMembershipRequests = async (req, res) => {
  try {
    const memberships = await Membership.find()
      .populate("user", "name email department year")
      .populate("club", "name category")
      .populate("reviewedBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: memberships.length,
      memberships,
    });
  } catch (error) {
    console.error("Get membership requests error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error while fetching membership requests",
    });
  }
};

const approveMembership = async (req, res) => {
  try {
    const membership = await Membership.findById(req.params.id).populate(
      "club",
      "name",
    );

    if (!membership) {
      return res.status(404).json({
        success: false,
        message: "Membership request not found",
      });
    }

    if (membership.status !== "PENDING") {
      return res.status(400).json({
        success: false,
        message: "Only pending membership requests can be approved",
      });
    }

    membership.status = "APPROVED";
    membership.reviewedAt = new Date();
    membership.reviewedBy = req.user._id;

    await membership.save();

    await Notification.create({
      user: membership.user,
      title: "Membership Approved",
      message: `Your membership request for ${membership.club.name} has been approved.`,
      type: "MEMBERSHIP",
    });

    res.status(200).json({
      success: true,
      message: "Membership approved successfully",
      membership,
    });
  } catch (error) {
    console.error("Approve membership error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error while approving membership",
    });
  }
};

const rejectMembership = async (req, res) => {
  try {
    const membership = await Membership.findById(req.params.id).populate(
      "club",
      "name",
    );

    if (!membership) {
      return res.status(404).json({
        success: false,
        message: "Membership request not found",
      });
    }

    if (membership.status !== "PENDING") {
      return res.status(400).json({
        success: false,
        message: "Only pending membership requests can be rejected",
      });
    }

    membership.status = "REJECTED";
    membership.reviewedAt = new Date();
    membership.reviewedBy = req.user._id;

    await membership.save();

    await Notification.create({
      user: membership.user,
      title: "Membership Rejected",
      message: `Your membership request for ${membership.club.name} has been rejected.`,
      type: "MEMBERSHIP",
    });

    res.status(200).json({
      success: true,
      message: "Membership rejected successfully",
      membership,
    });
  } catch (error) {
    console.error("Reject membership error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error while rejecting membership",
    });
  }
};
const getMyMemberships = async (req, res) => {
  try {
    const memberships = await Membership.find({
      user: req.user._id,
    })
      .populate("club", "name description category status")
      .populate("reviewedBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: memberships.length,
      memberships,
    });
  } catch (error) {
    console.error("Get my memberships error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error while fetching your memberships",
    });
  }
};
module.exports = {
  requestMembership,
  getAllMembershipRequests,
  approveMembership,
  rejectMembership,
  getMyMemberships,
};
