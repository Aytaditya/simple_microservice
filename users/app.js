const express=require('express');
const PORT=3001;
const app=express();
const http=require('http');
const userRouter=require('./routes/user.routes')
const connectDB=require('./db/db')
const cookieParser=require('cookie-parser')

app.use(express.json()); // Middleware to parse JSON request bodies
app.use(cookieParser()); // Middleware to parse cookies
app.use(express.urlencoded({extended:true})); // Middleware to parse URL-encoded request bodies
app.use('/',userRouter)

server=http.createServer(app);
server.listen(PORT,()=>{
    connectDB();
    console.log(`User Service running on port ${PORT}`);
})