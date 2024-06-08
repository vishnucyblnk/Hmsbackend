const jwt = require('jsonwebtoken');
require('dotenv').config()

const jwtMiddleware = (req,res,next)=>{
    console.log("Inside jwtMiddleware");
    const token = req.headers['authorization'].split(" ")[1]
    try{
        const jwtResponse = jwt.verify(token,process.env.SECRET_KEY)
        // console.log(jwtResponse);
        req.payload = jwtResponse.userId;
        next()
    }catch(err){
        res.status(401).json("Authorization failed!!! Please Login again...")
    }
}

module.exports = jwtMiddleware