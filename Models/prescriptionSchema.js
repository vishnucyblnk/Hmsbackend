const mongoose = require('mongoose')

const prescriptionSchema = new mongoose.Schema({
    
    patientId:{
        type:String
    },
    doctorNameDep:{
        type:String
    },
    complaint:{
        type:String
    },
    reviewPhysical:{
        type:String
    },
    diagonisationFinding:{
        type:String
    },
    medication:{
        type:String
    },
    assessment:{
        type:String
    },
    plan:{
        type:String
    },
    followup:{
        type:String
    },
    prescriptionDate:{
        type:String
    }
})

const prescriptions = mongoose.model('prescriptions',prescriptionSchema)

module.exports = prescriptions