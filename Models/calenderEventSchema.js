const mongoose = require('mongoose')
const calenderEventSchema = new mongoose.Schema({
    userId: {
        type: String
    },
    date: {
        type: String
    },
    eventTitles:{
        type: Array
    }
})

const calenderEvents = mongoose.model("calenderEvents",calenderEventSchema)

module.exports = calenderEvents