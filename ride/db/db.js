const mongoose=require('mongoose')

const connectDB=async()=>{
    try {
        await mongoose.connect("mongodb://localhost:27017/ridedb")
        console.log("Connected to MongoDB successfully");
    } catch (error) {
        console.error("Error connecting to MongoDB:",error); 
    }
}

module.exports=connectDB;