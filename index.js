//1. imported dotenv and loaded .env file
require('dotenv').config()

//2.1 imported express
const express = require('express')

//2.2 imported router
const router = require('./Routes/routes')

//2.3 imported db
require('./DB/connection')

//2.4 imported cors
const cors = require('cors')

    //3. created express server
    const hmsServer = express()

        //4.1 used cors in express
        hmsServer.use(cors())

        //4.2 parsed json data using server app
        hmsServer.use(express.json())

        //4.3 use router
        hmsServer.use(router)


            //5. customised port for server app
            const PORT = process.env.PORT || 5050

                // export uploads folder
                hmsServer.use('/uploads',express.static('./uploads'))

            //6. running server app
            hmsServer.listen(PORT,()=>{
                console.log(`HMS Server started at port : ${PORT}`);
            })

            //7. Resolving request to localhost:4000

            hmsServer.get('/',(req,res)=>{
                res.send(`<h1>Hospital Management System Server Started & Waiting For Request!!!!</h1>`)
            })
