const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const UserDetailSchema = new Schema({
  
  username: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
});

const UserDetailModel = model("UserData", UserDetailSchema);
module.exports = UserDetailModel;
