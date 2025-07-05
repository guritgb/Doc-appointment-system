const mongoose = require("mongoose");
const colors = require("colors");
const dotenv = require("dotenv");

dotenv.config();

const mongo = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    //console.log("Connecting to MongoDB with URI:", mongo);

    await mongoose.connect(mongo); // simplified

   // console.log(`Mongodb connected: ${mongoose.connection.host}`.bgGreen.white);
  } catch (error) {
    console.log(`Mongodb Server Issue ${error}`.bgRed.white);
  }
};

module.exports = connectDB;
