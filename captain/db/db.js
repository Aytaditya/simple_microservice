const mongoose=require('mongoose');

const connectDB=async()=>{
    try {
        await mongoose.connect("mongodb://localhost:27017/captaindb")
        console.log("Connected to database successfully");
    } catch (error) {
        console.log("Error connecting to database:",error)
    }
}

module.exports=connectDB;