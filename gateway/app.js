const express=require('express');
const expressproxy=require('express-http-proxy');

const app=express();
const PORT=3000;

app.get('/',(req,res)=>{
    res.send('Welcome to the API Gateway');
})

app.use('/users',expressproxy('http://localhost:3001'));
app.use('/captains',expressproxy('http://localhost:3002'));
app.use('/rides',expressproxy('http://localhost:3003'));

app.listen(PORT,()=>{
    console.log(`API Gateway running on port ${PORT}`);
})