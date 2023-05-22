const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const PostSchema = new Schema({
  
  title: {type: String,required: true },
  numberOfPeople: {type: String },
  postCode: {type: String},
  dateTime: {type: String},
  eventType: {type: String},
  privetPublic: {type: String},
  coverImg: {type: String},
  
  summary: {type: String},
 
  author: {type: Schema.Types.ObjectId, ref: 'UserData'},
  attendingUsers: [
    {
      id: { type: String, ref: 'UserData' },
     
    },
  ], 
},{
    timestamps: true,

});  

const PostDetailModel = model("Post", PostSchema);
module.exports = PostDetailModel;
