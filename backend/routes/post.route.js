const express = require("express");
const { auth } = require("../middleware/auth.middleware");
const { limiter } = require("../middleware/ratelimit.middleware");
const { PostModel } = require("../model/post.model");

const postRoute = express.Router();

postRoute.use(auth);
postRoute.use(limiter);

postRoute.post("/posts/add", async (req, res, next) => {
  try {
    let post = await new PostModel(req.body);
    post.save();
    res.status(200).send({ msg: "Post added" });
  } catch (error) {
    res.status(400).send({ error: error });
  }
});

postRoute.get("/posts/get", async (req, res, next) => {
  let { title } = req.query;
  try {
    let allPost;
    if (title) {
      allPost = await PostModel.find({ title });
    } else {
      allPost = await PostModel.find();
    }
    res.status(200).send(allPost);
  } catch (error) {
    res.status(400).send({ error: error });
  }
});

postRoute.patch("/posts/update/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    let postReq = await PostModel.findByIdAndUpdate({ _id: id }, req.body);
    res.status(200).send(req.body);
  } catch (error) {
    res.status(400).send({ error: error });
  }
});

postRoute.delete("/posts/delete/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    let postReq = await PostModel.findByIdAndDelete({ _id: id });
    res.status(200).send({ message: "post deleted" });
  } catch (error) {
    res.status(400).send({ error: error });
  }
});

module.exports = {
  postRoute,
};
