const User = require("../models/user");
const {
  signAccessToken,
  verifyAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require("../service/jwt.service");
const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { error } = userValidate(req.body);
    if (error) {
      throw createError(error.details[0].message);
    }

    const isExits = await User.findOne({
      email,
    });
    if (isExits) {
      throw createError.Conflict(`${email} is already use`);
    }

    const user = new User({
      email,
      password,
    });

    const saveUser = await user.save();

    return res.json({
      status: "OKE",
      elements: saveUser,
    });
  } catch (error) {
    next(error);
  }
};

const getAccessTokenFromRefreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw createError.BadRequest();
    }
    const payload = await verifyRefreshToken(refreshToken);
    const { userId } = payload;
    const accessToken = await signAccessToken(userId);
    const refToken = await signRefreshToken(userId);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { error } = userValidate(req.body);
    if (error) {
      throw createError(error.details[0].message);
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw createError.NotFound("User not registered");
    }

    const isValid = await user.isPasswordMatch(req.body.password);
    if (!isValid) {
      throw createError.Unauthorized("Password not match");
    }

    const accessToken = await signAccessToken(user._id);
    const refreshToken = await signRefreshToken(user._id);
    return res.status(200).json({
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw createError.BadRequest();
    }
    const { userId } = await verifyRefreshToken(refreshToken);
    client.del(userId.toString(), (err, reply) => {
      if (err) throw createError.InternalServerError();
      res.json({
        message: "Logout",
      });
    });
  } catch (error) {
    next(error);
  }
};

const getAllUser = (req, res, next) => {
  const listUsers = [
    { email: "asdasda@gmail.com" },
    { email: "aqweqwda@gmail.com" },
  ];
  res.json({
    listUsers,
  });
};

module.exports = {
  getAllUser,
  register,
  getAccessTokenFromRefreshToken,
  login,
  logout,
};
