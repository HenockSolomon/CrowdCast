const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const UserDetailSchema = new Schema({
  
  username: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const UserDetailModel = model("UserData", UserDetailSchema);
module.exports = UserDetailModel;
