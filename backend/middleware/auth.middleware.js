const jwt = require("jsonwebtoken");
const BlacklistModel = require("../model/blacklist.model");

const auth = async (req, res, next) => {
  try {
    const token = req.headers?.authorization?.split(" ")[1];
    if (token) {
      let checkToken = await BlacklistModel.find({ token });
      if (checkToken.length > 0) {
        return res.status(400).send({ error: "please login again" });
      }

      let decrypt = jwt.verify(token, "nem111c3");
      req.body.id = decrypt.id;
      return next();
    } else {
      return res.status(400).send("Please Login");
    }
  } catch (error) {
    return res.status(400).send({ error: error });
  }
};

module.exports = {
  auth,
};
