const JWT = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    JWT.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        return res.status(403).send({
          message: "Auth failed",
          success: false,
        });
      } else {
        req.userId = decode.id; // ✅ Use req.userId instead of req.body.userId
        next();
      }
    });
  } catch (error) {
    console.log(error);
    res.status(401).send({
      message: "Auth failed",
      success: false,
    });
  }
};
