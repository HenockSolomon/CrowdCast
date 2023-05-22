const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const AttendSchema = new Schema({
  username: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'UserData', required: true },
  title: { type: String, required: true },
  postId: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  attending: { type: Boolean, default: false },
  attendeeCount: { type: Number, default: 0 },
});

const AttendModel = model("Attend", AttendSchema);
module.exports = AttendModel;
