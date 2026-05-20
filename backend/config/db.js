import mongoose from "mongoose";

export default async function connetDB() {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log("mongoose conneted successfuly");
  } catch (err) {
    console.log("Error occur while connecting", { err });
  }
}
