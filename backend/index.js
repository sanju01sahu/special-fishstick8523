const express = require("express");
const { connection } = require("./db");
const { postRoute } = require("./routes/post.routes");
const { userRoute } = require("./routes/user.routes");

const app = express();

app.use(express.json());

app.use("/users", userRoute);
app.use("/posts", postRoute);

app.listen(8080, async () => {
  try {
    await connection;
    console.log("db connect sucessful");
  } catch (error) {
    console.log("db connect fail msg:", error);
  }
  console.log("server running @ port 8080");
});
