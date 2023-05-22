const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const attendSchema = new Schema({
  
userFrom: {type: Schema.Types.ObjectId, ref: 'UserData'},
postId : {
    type:String
},
title: {
    type:String
}

});
const Attend = model("Attend", attendSchema);
module.exports = {Attend};
