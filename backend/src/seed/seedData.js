const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

const connectDB = require("../config/db");

const User = require("../models/User");
const Club = require("../models/Club");
const Activity = require("../models/Activity");

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    await User.deleteMany({});
    await Club.deleteMany({});
    await Activity.deleteMany({});

    const hashedPassword = await bcrypt.hash("Password@123", 10);

    const admin = await User.create({
      name: "CampusHub Admin",
      email: "admin@campushub.com",
      password: hashedPassword,
      role: "ADMIN",
      department: "CSE-AIML",
      year: 4,
    });

    const user1 = await User.create({
      name: "Rahul Kumar",
      email: "rahul@campushub.com",
      password: hashedPassword,
      role: "USER",
      department: "CSE-AIML",
      year: 3,
    });

    const user2 = await User.create({
      name: "Ananya Sharma",
      email: "ananya@campushub.com",
      password: hashedPassword,
      role: "USER",
      department: "CSE",
      year: 2,
    });

    const clubs = await Club.insertMany([
      {
        name: "AIML Club",
        description:
          "A community for students interested in Artificial Intelligence and Machine Learning.",
        category: "Technical",
        status: "ACTIVE",
        createdBy: admin._id,
      },
      {
        name: "CodeCraft Club",
        description:
          "A coding community focused on programming, problem solving and competitive coding.",
        category: "Technical",
        status: "ACTIVE",
        createdBy: admin._id,
      },
      {
        name: "Creative Arts Club",
        description:
          "A platform for students interested in art, design, photography and creative expression.",
        category: "Cultural",
        status: "ACTIVE",
        createdBy: admin._id,
      },
    ]);

    await Activity.insertMany([
      {
        title: "Introduction to Artificial Intelligence",
        description:
          "A beginner-friendly workshop covering AI fundamentals and applications.",
        club: clubs[0]._id,
        date: new Date("2026-10-05T10:00:00"),
        location: "Seminar Hall",
        createdBy: admin._id,
        status: "UPCOMING",
      },
      {
        title: "Competitive Programming Bootcamp",
        description:
          "Hands-on session covering problem solving and competitive programming techniques.",
        club: clubs[1]._id,
        date: new Date("2026-10-10T14:00:00"),
        location: "E-Block Lab",
        createdBy: admin._id,
        status: "UPCOMING",
      },
      {
        title: "Photography Walk",
        description: "A creative photography activity around the campus.",
        club: clubs[2]._id,
        date: new Date("2026-10-15T09:00:00"),
        location: "Main Campus",
        createdBy: admin._id,
        status: "UPCOMING",
      },
    ]);

    console.log("Seed data inserted successfully");
    console.log("");
    console.log("ADMIN LOGIN");
    console.log("Email: admin@campushub.com");
    console.log("Password: Password@123");
    console.log("");
    console.log("USER LOGIN");
    console.log("Email: rahul@campushub.com");
    console.log("Password: Password@123");
    console.log("");
    console.log("USER LOGIN");
    console.log("Email: ananya@campushub.com");
    console.log("Password: Password@123");

    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error.message);
    process.exit(1);
  }
};

seedData();
