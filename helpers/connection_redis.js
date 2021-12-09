const redis = require("redis");
const client = redis.createClient();

client.ping((err, pong) => {
  console.log(pong);
});

client.on("error", function (err) {
  console.error(err);
});

client.on("connected", function (err) {
  console.log("Connected");
});

client.on("ready", function (err) {
  console.log("Redis to ready");
});

module.exports = client;
