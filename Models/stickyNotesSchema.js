const mongoose = require('mongoose')
const stickyNotesSchema = new mongoose.Schema({
    userId: {
        type: String
    },
    notes:{
        type: Array
    }
})

const stickyNotes = mongoose.model("stickyNotes",stickyNotesSchema)

module.exports = stickyNotes