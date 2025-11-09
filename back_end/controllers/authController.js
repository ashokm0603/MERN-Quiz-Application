const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { registerSchema, loginSchema } = require("../utils/validator");

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

// ✅ POST /api/auth/studentregistration or /facultyregistration
const register = asyncHandler(async (req, res) => {
  const { error } = registerSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { name, email, password, role, rollNo } = req.body;

  if (role === "student" && !rollNo) {
    return res
      .status(400)
      .json({ message: "Roll number is required for student registration" });
  }

  const existing = await User.findOne({ email });
  if (existing)
    return res.status(400).json({ message: "Email already registered" });

  if (role === "student") {
    const existingRoll = await User.findOne({ rollNo });
    if (existingRoll)
      return res
        .status(400)
        .json({ message: "Roll number already registered" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashed,
    role,
    rollNo: role === "student" ? rollNo : undefined,
  });

  const token = generateToken(user);

  res.status(201).json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      rollNo: user.rollNo || null,
    },
  });
});

// ✅ POST /api/auth/studentlogin or /facultylogin
const login = asyncHandler(async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { email, password, role } = req.body;

  const user = await User.findOne({ email, role });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: "Invalid credentials" });

  const token = generateToken(user);

  res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      rollNo: user.rollNo || null,
    },
  });
});

// ✅ GET /api/auth/student/:id → Fetch student details
const getStudentDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id).select("-password");
  if (!user) return res.status(404).json({ message: "Student not found" });

  if (user.role !== "student") {
    return res
      .status(403)
      .json({ message: "Access denied. Not a student account." });
  }

  res.status(200).json({
    id: user._id,
    name: user.name,
    email: user.email,
    rollNo: user.rollNo,
    role: user.role,
  });
});

module.exports = { register, login, getStudentDetails };
