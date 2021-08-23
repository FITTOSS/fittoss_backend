import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
    },

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

    //인증여부(유저가 이메일 인증을 완료하면 true로 바꾼다)
    emailVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
  },

  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
