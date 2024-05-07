const jwt = require("jsonwebtoken");
const JWT_SECRET = "Awrejisagoodb$oy";

const fetchuser = async (req, res, next) => {
  // Get the user from the jwt token and add id to req object
  const authToken = req.header("auth-token");
  if (!authToken) {
    res.status(401).send({ error: "Please authenticate using a vaild token" });
  }

  try {
    //   Getting the data of the user from the JWT Token
    const data = jwt.verify(authToken, JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send({ error: "Please authenticate using a vaild token" });
  }
};

module.exports = fetchuser;
