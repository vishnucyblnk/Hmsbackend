const mongoose = require('mongoose')
const validator = require('validator')

const patientSchema = new mongoose.Schema({
    patId:{
        type:String,
        required:[true,'patient id required']
    },
    username:{
        type:String,
        required:[true,'Username required']
    },
    role:{
        type:String,
        required:[true,"Designation required"]
    },
    email:{
        type:String,
        required:[true,'Email required'],
        unique:true,
        validator(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email")
            }
        }
    },
    gender:{
        type:String,
        required:[true,'Gender required']
    },
    dob:{
        type:String,
        required:[true,'DOB required']
    },
    age:{
        type:String,
        required:[true,'Age required']
    },
    bloodgroup:{
        type:String,
        required:[true,'Blood Group required']
    },
    phone:{
        type:String,
        required:[true,'Phone required']
    },
    address:{
        type:String,
        required:[true,'Address required']
    },
    profImg:{
        type:String
    }

})

const patients = mongoose.model("patients",patientSchema)

module.exports = patients