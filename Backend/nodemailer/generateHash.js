import crypto from "crypto";

export const generateHash = () => {
  const keyOne = crypto.randomBytes(256).toString("hex").substr(100, 5);
  const keyTwo = crypto.randomBytes(256).toString("base64").substr(50, 5);
  return keyOne + keyTwo;
};
