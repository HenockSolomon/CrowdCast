const mongoose = require("mongoose");
 
const { Schema, model } = mongoose;

const PostSchema = new Schema({
  title: { type: String, required: true },
  numberOfPeople: { type: String , required: true },
  postCode: { type: String , required: true },
  dateTime: { type: String , required: true },
  eventType: { type: String , required: true },
  privatePublic: { type: String , required: true },
  coverImg: { type: String , required: true },
  summary: { type: String , required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User' , required: true  },
  attendingCounter: { type: Number, default: 0 , required: true },
  attendingUsers: [{}],
}, {
  timestamps: true,
});

const PostModel = model("Post", PostSchema);
module.exports = PostModel;
