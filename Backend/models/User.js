import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: 1,
    },

    password: {
      type: String,
      required: true,
    },

    kakaoId: String,
    name: String,
    gender: String,
    birthday: Date,
    // 키
    height: Number,
    // 체중
    weight: Number,
    // 체지방
    bodyFat: Number,
    // 골격근
    muscle: Number,
  },

  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
