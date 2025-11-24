const express=require('express');
const PORT=3001;
const app=express();
const http=require('http');
const userRouter=require('./routes/user.routes')
const connectDB=require('./db/db')

app.use('/',userRouter)

server=http.createServer(app);
server.listen(PORT,()=>{
    connectDB();
    console.log(`User Service running on port ${PORT}`);
})