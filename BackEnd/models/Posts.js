const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const PostSchema = new Schema({
  title: { type: String, required: true },
  numberOfPeople: { type: String },
  postCode: { type: String },
  dateTime: { type: String },
  eventType: { type: String },
  privatePublic: { type: String },
  coverImg: { type: String },
  summary: { type: String },
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  attendingCounter: { type: Number, default: 0 },
  attendingUsers: [{}],
}, {
  timestamps: true,
});

const PostModel = model("Post", PostSchema);
module.exports = PostModel;
