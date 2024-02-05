const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const DB_Url = process.env.MONGOOSE_URL;

const connection = async () => {
  const dbName = "elevatewell";
  try {
    await mongoose.connect(DB_Url, {
      dbName: dbName,    
    });
    console.log("MongoDB Connected Successfully ✅");
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error.message);
  }
};

module.exports = connection;
