const mongoose = require("mongoose");

const connection = mongoose.connect("mongodb+srv://sanju01sahu:sanju01sahu@cluster0.r89pjhs.mongodb.net/testConnect");



module.exports = {
    connection
}