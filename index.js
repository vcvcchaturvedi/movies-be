const Express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const auth = require("./routes/auth");
const users = require("./routes/user");
const passport = require("passport");
require("express-async-errors");
const jwt = require("jsonwebtoken");
dotenv.config();
require("./passport");
const PORT = process.env.PORT || 5000;
const app = Express();
// app.use(cors())               //required for validating frontend domain url
app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));
app.use("/api/auth", auth);
app.post("/login", function (req, res, next) {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err || !user)
      return res
        .status(401)
        .send({ status: "failure", message: "Invalid credentials" });
    req.login(user, { session: false }, (err) => {
      if (err) return res.status(500).send(err);
      const token = jwt.sign(user, process.env.JWT_KEY);
      return res.send({ user, token });
    });
  })(req, res, next);
});
app.use("/users", passport.authenticate("jwt", { session: false }), users);
app.use((err, req, res, next) => {
  if (!res.headersSent) {
    res.status(500);
    res.send("500 Internal Server error");
  }
  next();
});
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
