const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({
    date:{
        type:String
    },
    descriptions:{
        type:Array 
    }
})

const notifications = mongoose.model('notifications',notificationSchema)

module.exports = notifications