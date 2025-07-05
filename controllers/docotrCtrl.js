const appointmentModel = require("../models/appointmentModel");
const doctorModel = require("../models/doctorModel");
const userModel = require("../models/userModels");
const getDcotorInfoController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ userId: req.body.userId });
    res.status(200).send({
      success: true,
      message: "doctor data fetch success",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "error in fetching doctor details",
    });
  }
};

// update doc profile
const updateProfileController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOneAndUpdate(
      { userId: req.body.userId },
      req.body,
      { new: true } // returns updated doc
    );
    res.status(200).send({
      success: true,
      message: "Doctor profile updated successfully",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Doctor profile update failed",
      error,
    });
  }
};

//get single doc
const getDoctorByIdController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ _id: req.body.doctorId });
    res.status(200).send({
      success: true,
      message: "single doc info fetched",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error in gettind single doc info",
      error,
    });
  }
};

// doc appointment control
const doctorAppointmentController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ userId: req.userId });
    const appointments = await appointmentModel.find({
      doctorId: doctor._id,
    });
    res.status(200).send({
      success: true,
      message: "Doctor Appointment fetch successfully",
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error in doc appointments",
      error,
    });
  }
};
//doc appointment status update
const updateStatusController = async (req, res) => {
  try {
    const { appointmentId, status } = req.body;
    const appointments = await appointmentModel.findByIdAndUpdate(
      appointmentId,
      { status }
    );
    const user = await userModel.findOne({ _id: appointments.userId });
    const notification = user.notification;
    notification.push({
      type: "status updated",
      message: `your appointment has been updated ${status}`,
      onClickPath: "/doctor-appointments",
    });
    await user.save();
    res.status(200).send({
      success: true,
      message: "appointment status updated",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "issue in updaitng status of appointment",
      error,
    });
  }
};

module.exports = {
  getDcotorInfoController,
  updateProfileController,
  getDoctorByIdController,
  doctorAppointmentController,
  updateStatusController,
};
