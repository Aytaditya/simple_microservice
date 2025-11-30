const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const captainSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    isAvailable:{
        type:Boolean,
        default:true
    }
});

module.exports=mongoose.model('Captain',captainSchema);