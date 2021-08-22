import nodemailer from "nodemailer";
import smtpTransporter from "nodemailer-smtp-transport";
import inlineCss from "nodemailer-juice";
import { BACK_URL } from "./config";
import { emailForm } from "./emailForm";

// eslint-disable-next-line import/prefer-default-export
export const nodemail = (email, emailKey) => {
  const smtpTransport = nodemailer.createTransport(
    smtpTransporter({
      service: "Gmail",
      host: "smtp.gmail.com",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    })
  );

  smtpTransport.use("compile", inlineCss());

  //url
  const url = `${BACK_URL}/api/email?emailKey=${emailKey}`;

  const mailOpt = {
    from: "FITTOSS",
    to: email,
    subject: "이메일 인증을 진행해주세요.",
    html: emailForm(url),
  };
  //전송
  smtpTransport.sendMail(mailOpt, (err) => {
    if (err) {
      console.error("err", err);
    } else {
      console.log("email has been sent.");
    }
    smtpTransport.close();
  });
};
