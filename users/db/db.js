const mongoose=require('mongoose');

const connectDB=async()=>{
    try{
        await mongoose.connect("mongodb://localhost:27017/usersdb")
        console.log("Connected to database successfully");

    }catch{
        console.log("Error connecting to database");
    }
}

module.exports = connectDB;