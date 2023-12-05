const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  title: String,
  constent: String,
});
const PostModel = mongoose.model("post", postSchema);

module.exports = { PostModel };
