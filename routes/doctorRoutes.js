const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getDcotorInfoController,
  updateProfileController,
  getDoctorByIdController,
  doctorAppointmentController,
  updateStatusController,
} = require("../controllers/docotrCtrl");
const router = express.Router();

//POST SINGLE DOC INFO
router.post("/getDoctorInfo", authMiddleware, getDcotorInfoController);
// post update profile
router.post("/updateProfile", authMiddleware, updateProfileController);
// post get single doc info
router.post("/getDoctorById", authMiddleware, getDoctorByIdController);
//get appointments
router.get("/doctor-appointments", authMiddleware, doctorAppointmentController);
// post update status appointment by doc
router.post("/update-status", authMiddleware, updateStatusController);
module.exports = router;
