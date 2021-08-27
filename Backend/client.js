const axios = require("axios");

console.log("client code running.");

const URI = "http://localhost:4000";

const test = async () => {
  console.time("loading time: ");

  try {
    await axios.post(`${URI}/api/register`, {
      email: "asdasaxcvxcvsddsd@naver.com",
      password: "asdas123",
    });
  } catch (error) {
    console.log(error);
  }

  console.timeEnd("loading time: ");
};

const testGroup = async () => {
  try {
    await test();
    await test();
    await test();
    await test();
    await test();
    await test();
    await test();
  } catch (error) {
    console.log(error);
  }
};

testGroup();
