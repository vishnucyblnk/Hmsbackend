const mongoose = require('mongoose')
const validator = require('validator')

const employeeSchema = new mongoose.Schema({
    empId:{
        type:String,
        required:[true,'employee id required']
    },
    username:{
        type:String,
        required:[true,'Username required']
    },
    role:{
        type:String,
        required:[true,'Designation required']
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
    password:{
        type:String,
        required:[true,'Password required']
    },
    department:{
        type:String
    },
    bloodgroup:{
        type:String
    },
    gender:{
        type:String
    },
    dob:{
        type:String
    },
    age:{
        type:String
    },
    phone:{
        type:String
    },
    address:{
        type:String
    },
    profImg:{
        type:String
    }
})

const employees = mongoose.model('employees',employeeSchema)

module.exports = employees