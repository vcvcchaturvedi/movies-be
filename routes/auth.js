const Express = require("express");
const bcrypt = require("bcrypt");
const { registrationValidation } = require("../schemas/validator");
const {
  addUser,
  userExists,
  fetchAllMovies,
} = require("../dbCalls.controller");
const router = Express.Router();
router.post("/register", async (req, res) => {
  let bodyRequest = req.body;
  let { error } = registrationValidation.validate(bodyRequest);
  if (error)
    return res.status(400).send({
      status: "failure",
      message: "Invalid request parameters to register, " + error.message,
    });
  let { username, password, firstname, lastname } = bodyRequest;
  let userValid = !(await userExists(username));
  if (!userValid)
    return res.status(400).send({
      status: "failure",
      message: "Username is already taken, please try another username",
    });
  let hashedPassword;

  try {
    const salt = await bcrypt.genSalt(10);
    hashedPassword = await bcrypt.hash(password, salt);
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ message: "Internal server error in creating profile" });
  }
  const user = {
    username,
    password: hashedPassword,
    firstname,
    lastname,
  };
  let id = await addUser(user);
  if (id == 0)
    return res
      .status(500)
      .send({ status: "failure", message: "Error in adding user to db" });
  return res.send({
    status: "success",
    message: "Successfully added user in db",
  });
});
router.get("/movies", async (req, res) => {
  console.log("HI    HI    HI");
  console.log(req.socket.remoteAddress);
  try {
    let allMovies = await fetchAllMovies();
    res.send(allMovies);
  } catch (error) {
    console.log(error);
    res.send([]);
  }
});
module.exports = router;
