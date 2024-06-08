const calenderEvents = require('../Models/calenderEventSchema')
const stickyNotes = require('../Models/stickyNotesSchema')
const notifcations = require('../Models/notificationSchema');
const notifications = require('../Models/notificationSchema');


// ----------Adding Events of each Users-------------------------------------------------------------

exports.calenderEventAdd = async(req,res)=>{
    console.log("Inside calender events adding function");
    const {date,eventTitles,userId} = req.body;
    try{
        const existingEvent = await calenderEvents.findOne({userId,date})
        if(existingEvent){
            existingEvent.eventTitles.push(eventTitles);
            await existingEvent.save();
            res.status(200).json(existingEvent);
        }else{
            // adding event
            const newEvent = new calenderEvents({
                date,eventTitles,userId
            });
            await newEvent.save();
            res.status(200).json(newEvent);
        }

    }catch(err){
        res.status(401).json(`Error transaction failed: ${err}`);
    }
}

// ----------Fetching Events of Users-----------------------------------------------------------------

    exports.calenderEventFetch = async(req,res)=>{
        console.log("Inside Calender Events fetching function");
        const {userId} = req.body
        const query = userId ? { userId: { $regex: userId, $options: "i" } } : {};
        try{
            const allEvents = await calenderEvents.find(query);
            res.status(200).json(allEvents)
        }catch(err){
            res.status(401).json(`Error transaction failed: ${err}`);
        }
    }

// ---------Removing Each Events of Users-------------------------------------------------------------

    exports.calenderEventRemove = async (req, res) => {
        console.log("Inside Calendar Events removing function");
        const { id, title } = req.body;
        try {
            await calenderEvents.updateOne({ "_id": id }, { $pull: { eventTitles: title } });
            
            const updatedDoc = await calenderEvents.findOne({ "_id": id });
            // Check if all eventTitles are empty
            if (!updatedDoc.eventTitles || updatedDoc.eventTitles.length === 0) {
                // If all eventTitles are empty, delete the document
                await calenderEvents.deleteOne({ "_id": id });
                return res.status(200).json({ message: "Calendar event removed successfully" });
            }
            res.status(200).json({ message: "Calendar event removed successfully", updatedDoc });
        } catch (err) {
            res.status(500).json({ error: `Error!!! Transaction failed: ${err}` });
        }
    };


// ----------Adding Sticky Notes of each Users-------------------------------------------------------------

exports.stickyNotesAdd = async(req,res)=>{
    console.log("Inside sticky Notes adding function");
    const {notes,userId} = req.body;
    try{
        const existingNotesofUser = await stickyNotes.findOne({userId})
        if(existingNotesofUser){
            existingNotesofUser.notes.push(notes);
            await existingNotesofUser.save();
            res.status(200).json(existingNotesofUser);
        }else{
            // adding Notes
            const newNotes = new stickyNotes({
                notes,userId
            });
            await newNotes.save();
            res.status(200).json(newNotes);
        }

    }catch(err){
        res.status(401).json(`Error transaction failed: ${err}`);
    }
}


// ----------Fetching Sticky Notes of Users-----------------------------------------------------------------

exports.stickyNotesFetch = async(req,res)=>{
    console.log("Inside Sticky NOtes fetching function");
    const {userId} = req.body
    const query = userId ? { userId: { $regex: userId, $options: "i" } } : {};
    try{
        const allNotes = await stickyNotes.find(query);
        res.status(200).json(allNotes)
    }catch(err){
        res.status(401).json(`Error transaction failed: ${err}`);
    }
}


// ---------Removing Each Sticky Notes of Users-------------------------------------------------------------

exports.stickyNotesRemove = async (req, res) => {
    console.log("Inside Sticky Notes removing function");
    const { id, eachNote } = req.body;
    try {
        await stickyNotes.updateOne({ "_id": id }, { $pull: { notes: eachNote } });
        
        const updatedDoc = await stickyNotes.findOne({ "_id": id });
        // Check if all notes are empty for that user
        if (!updatedDoc.notes || updatedDoc.notes.length === 0) {
            // If all notes are empty, delete the document
            await stickyNotes.deleteOne({ "_id": id });
            return res.status(200).json({ message: "Sticky Notes removed successfully" });
        }
        res.status(200).json({ message: "Sticky Notes removed successfully", updatedDoc });
    } catch (err) {
        res.status(500).json({ error: `Error!!! Transaction failed: ${err}` });
    }
};

// -----------Adding New Notifications----------------------------------------------------------------

exports.notificationAdding = async(req,res)=>{
    console.log('Inside Adding Notification function');
    const {descriptions,date} = req.body;
    try{
        const existingNotifications = await notifications.findOne({date})
        if(existingNotifications){
            existingNotifications.descriptions.push(descriptions);
            await existingNotifications.save();
            res.status(200).json(existingNotifications);
        }else{
            // adding Notification
            const newNotif = new notifications({
                descriptions,date
            });
            await newNotif.save();
            res.status(200).json(newNotif);
        }

    }catch(err){
        res.status(401).json(`Error transaction failed: ${err}`);
    }
}


// -----------Fetching All Notifications----------------------------------------------------------------
exports.notificationFetching = async(req,res)=>{
    console.log('Inside Fetching All Notifications');
    try{
        const allNotifications = await notifications.find()
        res.status(200).json(allNotifications)
    }catch(err){
        res.status(401).json(`Error!!! Transaction failed : ${err}`)
    }
}

exports.notificationRemove = async (req, res) => {
    console.log("Inside Notification removing function");
    const { id, eachNotif } = req.body;
    try {
        // Update the document by removing the specified description
        await notifications.updateOne({ "_id": id }, { $pull: { descriptions: eachNotif } });
        
        // Retrieve the updated document
        const updatedDoc = await notifications.findOne({ "_id": id });

        // Check if all descriptions are empty for that notification
        if (!updatedDoc.descriptions || updatedDoc.descriptions.length === 0) {
            // If all descriptions are empty, delete the document
            await notifications.deleteOne({ "_id": id });
            return res.status(200).json({ message: "Notification removed successfully" });
        }
        res.status(200).json({ message: "Notification removed successfully", updatedDoc });
    } catch (err) {
        // Handle errors
        res.status(500).json({ error: `Error!!! Transaction failed: ${err}` });
    }
};
