import mongoose from "mongoose";
import createServer from "./app";

mongoose
  .connect(process.env.DB_HOST, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("MongoDB Connected♥");

    const app = createServer();
    app.listen(app.get("port"), () => {
      console.log(`Server is Running ${app.get("port")}`);
    });
  })
  .catch((err) => console.error(err.message));
