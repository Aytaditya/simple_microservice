const express=require('express');
const PORT=3002;
const app=express();
const http=require('http');
const captainRouter=require('./routes/captain.routes');
const cookieParser = require('cookie-parser');
const connectDB=require('./db/db')
const rabbitMQ=require('./service/rabbit')

app.use(express.json()); 
app.use(express.urlencoded({extended:true}));
app.use(cookieParser())
app.use('/',captainRouter)

const server=http.createServer(app);
server.listen(PORT,()=>{
    connectDB();
    rabbitMQ.connect();
    console.log(`Captain Service running on port ${PORT}`);
})