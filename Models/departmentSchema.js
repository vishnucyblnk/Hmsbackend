const mongoose = require('mongoose')
const validator = require('validator')

const departmentSchema = new mongoose.Schema({
    name:{
        type:String
    },
    description:{
        type:String 
    }
})

const departments = mongoose.model('departments',departmentSchema)

module.exports = departments 