const Joi = require("joi");

const userValidate = (data) => {
  const userSchema = Joi.object({
    email: Joi.string().pattern(new RegExp("gmail.com$")).email().required(),
    password: Joi.string().min(6).max(30).required(),
  });

  return userSchema.validate(data);
};

module.exports = {
  userValidate,
};
