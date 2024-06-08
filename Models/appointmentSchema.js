const mongoose = require('mongoose')
const validator = require('validator')

const appointmentSchema = new mongoose.Schema({
    patientId:{
        type:String
    },
    patId:{
        type:String
    },
    patientName:{
        type:String 
    },
    department:{
        type:String
    },
    doctorId:{
        type:String 
    },
    doctorName:{
        type:String
    },
    appntDate:{
        type:String
    },
    tokenNumber:{
        type:Number
    }
})

const appointments = mongoose.model('appointments',appointmentSchema)

module.exports = appointments