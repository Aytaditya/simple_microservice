const express=require('express');
const cookieParser=require('cookie-parser');
const http=require('http');
const PORT=3003
const app=express();
const ridesRouter=require('./routes/rides.routes')
const connectDB=require('./db/db')

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));
app.use('/',ridesRouter);

const server=http.createServer(app);

server.listen(PORT,()=>{
    connectDB();
    console.log(`Ride Service running on port ${PORT}`);
})