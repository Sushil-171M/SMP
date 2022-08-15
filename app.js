const express = require('express')
const mongoose = require('mongoose')
const app = express()
app.use(express.json());

// MongoDB  STuff
 mongoose.connect('mongodb://localhost:27017/Insta',()=>{
    console.log('Database is Connected')
})

//   Routes 
const authRoute = require('./routes/auth')


app.use('/',authRoute);

const PORT  = 4000 ;
app.listen( PORT, ()=>{
    console.log(`Server is Listening on Port ${PORT}`);
})