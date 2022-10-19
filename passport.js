const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken;
const { checkPassword, userExists } = require("./dbCalls.controller");
const dotenv = require("dotenv");
dotenv.config();
passport.use(
  new LocalStrategy(async (username, password, done) => {
    let checkUser = await checkPassword(username, password);
    if (checkUser)
      done(null, { username }, { message: "Logged in successfully" });
    else done(null, false, { message: "Incorrect username or password" });
  })
);
passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT(),
      secretOrKey: process.env.JWT_KEY,
    },
    async function (jwtPayload, cb) {
      let check = await userExists(jwtPayload.username);
      if (check) cb(null, { username: jwtPayload.username });
      else cb(new Error("Not a valid token"));
    }
  )
);
