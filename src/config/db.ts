import mongoose from "mongoose";

console.log(process.env);

export const connectDB = async () => {
  try {
    const MONGO_URL = process.env.MONGO_URI; // DB URI
    await mongoose.connect(MONGO_URL);
    console.log("MongoDB Connected");
  } catch (error) {
    mongoose.connection.on("error", (error: Error) => console.log(error));
    console.log(error);
  }
};
