const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const client = require("../helpers/connection_redis");
const signAccessToken = async (userID) => {
  return new Promise((resolve, reject) => {
    const payload = {
      userID,
    };
    const secret = process.env.ACCESS_TOKEN_SECRET;
    const options = {
      expiresIn: "5m",
    };
    jwt.sign(payload, secret, options, (err, token) => {
      if (err) {
        reject(err);
      }
      resolve(token);
    });
  });
};
const signRefreshToken = async (userID) => {
  return new Promise((resolve, reject) => {
    const payload = {
      userID,
    };
    const secret = process.env.REFRESH_TOKEN_SECRET;
    const options = {
      expiresIn: "30d",
    };
    jwt.sign(payload, secret, options, (err, token) => {
      if (err) {
        reject(err);
      }
      client.set(
        userId.toString(),
        token,
        "EX",
        30 * 24 * 60 * 60,
        (err, reply) => {
          if (err) {
            return reject(createError.InternalServerError());
          }
        }
      );
      resolve(token);
    });
  });
};

const verifyAccessToken = (req, res, next) => {
  if (!req.headers["authorization"]) {
    next(createError.Unauthorized());
  }
  const authHeader = req.headers["authorization"];
  const bearerToken = authHeader.split(" ");
  const token = bearerToken[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, payload) => {
    if (error) {
      if (error.name === "JsonWebTokenError") {
        next(createError.Unauthorized());
      }
      next(createError.Unauthorized(error.message));
    }
    req.payload = payload;
    next();
  });
};

const verifyRefreshToken = async (refreshToken) => {
  return new Promise((resolve, reject) => {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (error, payload) => {
        if (error) {
          return reject(error);
        }
        client.get(payload.userId, (err, reply) => {
          if (err) {
            return reject(createError.InternalServerError());
          }
          if (refreshToken === reply) {
            return resolve(payload);
          }
          return reject(createError.Unauthorized());
        });
      }
    );
  });
};
module.exports = {
  signAccessToken,
  verifyAccessToken,
  signRefreshToken,
  verifyRefreshToken,
};
