const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const user = new Schema({
  addressWallet: String,
  jobapply : [
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Postjob",
        
    }
]
});
module.exports = mongoose.model("user", user);
