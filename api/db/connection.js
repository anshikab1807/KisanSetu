const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/kisansetu";
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error (${process.env.MONGO_URI}): ${error.message}`);
    console.log("Attempting connection to local MongoDB (mongodb://127.0.0.1:27017/kisansetu)...");
    try {
      const localConn = await mongoose.connect("mongodb://127.0.0.1:27017/kisansetu");
      console.log(`MongoDB Connected (Local): ${localConn.connection.host}`);
    } catch (localError) {
      console.error(`Local MongoDB Connection Error: ${localError.message}`);
    }
  }
};

module.exports = connectDB;

