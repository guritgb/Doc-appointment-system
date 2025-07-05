const express = require("express");
const {
  loginController,
  registerController,
  authController,
  applyDoctorController,
  getAllNotificationController,
  deleteAllNotificationController,
  getAllDoctorsController,
  bookAppointmentController,
  bookingAvailabilityController,
  userAppointmentsController,
} = require("../controllers/userCtrl");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// LOGIN || POST
router.post("/login", loginController);

// REGISTER || POST
router.post("/register", registerController);

// Auth || POST
router.post("/getUserData", authMiddleware, authController);

// Apply Doctor || POST
router.post("/apply-doctor", authMiddleware, applyDoctorController);

// Notification || POST
router.post("/get-all-notification", authMiddleware, getAllNotificationController);

// Notification || POST
router.post("/delete-all-notification", authMiddleware, deleteAllNotificationController);

// Get all doctors
router.get("/getAllDoctors", authMiddleware, getAllDoctorsController);

// Book appointment
router.post("/book-appointment", authMiddleware, bookAppointmentController);

// Check availability
router.post("/booking-availability", authMiddleware, bookingAvailabilityController);

// Appointment list
router.get("/user-appointments", authMiddleware, userAppointmentsController);

// ✅ Export at the END
module.exports = router;
