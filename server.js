const express = require("express");
const colors = require("colors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const path = require("path");

//dotenv config
const result = dotenv.config();
console.log("Dotenv result:", result);
console.log("Parsed MONGO_URI:", process.env.MONGO_URI);

const app = express();
//mongodb connect
connectDB();
//rest obj

//middlewares
app.use(express.json());
app.use(morgan("dev"));

//routes
app.use("/api/v1/user", require("./routes/userRoutes"));
app.use("/api/v1/admin", require("./routes/adminRoutes"));
app.use("/api/v1/doctor", require("./routes/doctorRoutes"));

//static files
app.use(express.static(path.join(__dirname, "./client/build")));

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

//port
const port = process.env.PORT || 8080;
const node = process.env.NODE_MODE || "";
//listen port
app.listen(port, () => {
  console.log(`Server Running in ${node} Mode on port ${port}`.bgCyan.white);
});
