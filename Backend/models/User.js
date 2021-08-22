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

    //인증여부(유저가 이메일 인증을 완료하면 true로 바꾼다)
    emailVerified: {
      type: Boolean,
      required: true,
      default: false,
    },

    //인증코드(쿼리스트링으로 이메일 인증 url의 인증코드를 줘서 db에 저장된 인증코드가 있으면 이메일 인증을 true로 변경)
    emailKey: {
      type: String,
      required: true,
    },

    // 이메일 인증 유효시간 설정
    ttl: {
      type: Number,
      default: 10000,
    },

    emailCreatedAt: {
      type: Date,
      required: true,
    },
  },

  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
