import mongoose from "mongoose";

export default async function connetDB() {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.info("mongoose conneted successfuly");
  } catch (err) {
    console.error("Error occur while connecting", { err });
  }
}
