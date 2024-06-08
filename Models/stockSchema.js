const mongoose = require('mongoose')

const stockSchema = new mongoose.Schema({
    medicineName:{
        type:String
    },
    batchNo:{
        type:String 
    },
    expDate:{
        type:String 
    },
    price:{
        type:String 
    },
    stockQuantity:{
        type:String 
    }
})

const stocks = mongoose.model('stocks',stockSchema)

module.exports = stocks 