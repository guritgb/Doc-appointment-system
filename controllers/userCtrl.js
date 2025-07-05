const userModel = require("../models/userModels");
const bcrypt = require("bcryptjs");
const jwd = require("jsonwebtoken");
const doctorModel = require("../models/doctorModel");
const appointmentModel = require("../models/appointmentModel");
const moment = require("moment");
const { message } = require("antd");
const registerController = async (req, res) => {
  try {
    const exisitingUser = await userModel.findOne({ email: req.body.email });
    if (exisitingUser) {
      return res
        .status(200)
        .send({ message: "User Already Exist", success: false });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashedPassword;
    const newUser = new userModel(req.body);
    await newUser.save();
    res.status(201).send({ message: "Register Successfully", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `Register Controller ${error.message}`,
    });
  }
};

const loginController = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user)
      return res
        .status(200)
        .send({ message: "user not found", success: false });

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch)
      return res
        .status(200)
        .send({ message: "Invalid Email or Password", success: false });

    const token = jwd.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(200).send({ message: "Login Success", success: true, token });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: `Error in login CTRL ${error.message}` });
  }
};

const authController = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId);
    if (!user)
      return res
        .status(200)
        .send({ message: "user not found", success: false });
    user.password = undefined;
    res.status(200).send({ success: true, data: user });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "auth error", success: false, error });
  }
};

const applyDoctorController = async (req, res) => {
  try {
    console.log("✅ Apply Doctor API hit");
    console.log("📦 Request Body:", req.body);

    // Check if all required fields exist
    const {
      firstName,
      lastName,
      phone,
      email,
      website,
      address,
      specialization,
      experience,
      feesPerConsultation,
      timings,
      userId,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !phone ||
      !email ||
      !address ||
      !specialization ||
      !experience ||
      !feesPerConsultation ||
      !timings ||
      !userId
    ) {
      return res.status(400).send({
        success: false,
        message: "❌ Missing required fields for doctor application",
      });
    }
    let newDoctor;
    try {
      newDoctor = new doctorModel({ ...req.body, status: "pending" });
      await newDoctor.save();
      console.log("✅ Doctor saved to DB:", newDoctor);
    } catch (err) {
      console.error("❌ Error saving doctor:", err.message);
      return res.status(500).send({
        success: false,
        message: "❌ Failed to save doctor",
        error: err.message,
      });
    }

    const adminUser = await userModel.findOne({ isAdmin: true });
    if (!adminUser) {
      return res.status(404).send({
        success: false,
        message: "❌ Admin user not found",
      });
    }

    adminUser.notification.push({
      type: "apply-doctor-request",
      message: `${newDoctor.firstName} ${newDoctor.lastName} has applied for a Doctor Account`,
      data: {
        doctorId: newDoctor._id,
        name: `${newDoctor.firstName} ${newDoctor.lastName}`,
        onClickPath: "/admin/doctors",
      },
    });

    await adminUser.save();
    console.log("✅ Notification added to admin");

    res.status(201).send({
      success: true,
      message: "🎉 Doctor Account Applied Successfully",
    });
  } catch (error) {
    console.error("❌ General error in applyDoctorController:", error.message);
    res.status(500).send({
      success: false,
      error: error.message,
      message: "❌ Error While Applying For Doctor",
    });
  }
};

const getAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId);
    user.seennotification.push(...user.notification);
    user.notification = [];
    const updateUser = await user.save();
    res.status(200).send({
      success: true,
      message: "all notifications marked as read",
      data: updateUser,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Error in notification", success: false, error });
  }
};

const deleteAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    user.notification = [];
    user.seennotification = [];
    const updatedUser = await user.save();
    updatedUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "Notifications deleted successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "unable to delete all notifications",
      error,
    });
  }
};

const getAllDoctorsController = async (req, res) => {
  try {
    const doctors = await doctorModel.find({ status: "approved" });
    res.status(200).send({
      success: true,
      message: "doctors list fecthed successfully",
      data: doctors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error while fetching doctor",
      error,
    });
  }
};

//book apointment
const bookAppointmentController = async (req, res) => {
  try {
    req.body.date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    req.body.time = moment(req.body.time, "HH:mm").toISOString();
    req.body.status = "pending";
    const newAppointment = new appointmentModel(req.body);
    await newAppointment.save();
    const user = await userModel.findOne({ _id: req.body.doctorInfo.userId });
    user.notification.push({
      type: "New-appointment-request",
      message: `A new Appointment Request from ${req.body.userInfo.name}`,
      onClickPath: "/user/appointments",
    });
    await user.save();
    res.status(200).send({
      success: true,
      message: "Appointment book successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "book appointment failed",
      error,
    });
  }
};

// check availability
const bookingAvailabilityController = async (req, res) => {
  try {
    const date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    const fromTime = moment(req.body.time, "HH:mm")
      .subtract(1, "hours")
      .toISOString();
    const toTime = moment(req.body.time, "HH:mm").add(1, "hours").toISOString();
    const doctorId = req.body.doctorId;
    const appointments = await appointmentModel.find({
      doctorId,
      date,
      time: {
        $gte: fromTime,
        $lte: toTime,
      },
    });
    if (appointments.length > 0) {
      return res.status(200).send({
        message: "Appointments not available at this time",
        success: false,
      });
    } else {
      return res.status(200).send({
        success: true,
        message: "Appointments Available",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "check avaialability issue",
      error,
    });
  }
};

//appointment list controller
const userAppointmentsController = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({
      userId: req.userId,
    });
    res.status(200).send({
      success: true,
      message: "users appointments fetch successfully ",
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "appointment list error",
      error,
    });
  }
};

module.exports = {
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
};
