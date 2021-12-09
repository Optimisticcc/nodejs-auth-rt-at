const mongoose = require("mongoose");

module.exports = async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB connected: ${conn.connection.host}\n`);
  } catch (err) {
    console.error(`Error: ${err.message}`);

    process.exit(1);
  }
};
