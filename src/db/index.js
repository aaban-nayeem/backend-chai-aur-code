import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: "./env" });

const connectDB = async () => {
  try {
    const connectionOnInstance = await mongoose.connect(
      `${process.env.MONGO_URI}`
    );
    console.log(`\n MongoDB connected ${connectionOnInstance.connection.host}`);
  } catch (error) {
    console.log("Catch the Error", error);
    process.exit(1);
  }
};

export default connectDB;
