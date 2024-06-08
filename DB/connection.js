const mongoose = require('mongoose')
require('dotenv').config()

const connectionString = process.env.DATABASE

mongoose.connect(connectionString).then(()=>{
    console.log('Mongodb Atlas connected successfully with hmsServer');
}).catch((err)=>{
    console.log('Mongodb Atlas connection failed : '+ err);
})