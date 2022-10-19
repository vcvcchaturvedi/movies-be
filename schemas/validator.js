const Joi = require("@hapi/joi");
const registrationValidation = Joi.object().keys({
  username: Joi.string().required().max(45),
  password: Joi.string().required().max(45),
  firstname: Joi.string().required().max(45),
  lastname: Joi.string().required().max(45),
});
const movieValidation = Joi.object().keys({
  name: Joi.string().required().max(75),
  rating: Joi.number(),
  cast: Joi.array().items(Joi.string().required()),
  genre: Joi.string(),
  date: Joi.date(),
});
module.exports = { registrationValidation, movieValidation };
