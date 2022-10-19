const Express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const auth = require("./routes/auth");
const users = require("./routes/user");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { pool_async } = require("./pool");
const pool = (async function () {
  return await pool_async();
})();
dotenv.config();
require("./passport");
const PORT = process.env.PORT || 5000;
const app = Express();
// app.use(cors())
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
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
module.exports = { pool };
