import mongoose from "mongoose";

const authSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },

    //인증코드(쿼리스트링으로 이메일 인증 url의 인증코드를 줘서 db에 저장된 인증코드가 있으면 이메일 인증을 true로 변경)
    emailKey: {
      type: String,
      required: true,
    },

    // 이메일 인증 유효시간 설정
    ttl: {
      type: Number,
      default: 30000,
    },

    emailCreatedAt: {
      type: Date,
      required: true,
    },
  },

  { timestamps: true }
);

export const Auth = mongoose.model("Auth", authSchema);
