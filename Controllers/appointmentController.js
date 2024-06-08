const appointments = require('../Models/appointmentSchema')


// ----- Registering new Appointment for Patients ---------------------------------------------------

exports.appointmentRegister = async (req, res) => {
    console.log("Inside Appointment register function");
    const { patientId, patId, patientName, department, doctorId, doctorName, appntDate } = req.body;
    try {
        // Count the number of appointments for the doctor on the given date
        const countAppointments = await appointments.countDocuments({ doctorId, appntDate });

        // Check if the count is less than 50
        if (countAppointments < 3) {
            // Check if the appointment already exists
            const existingAppnt = await appointments.findOne({ patientId, doctorId, appntDate });
            if (existingAppnt) {
                res.status(406).json(`Patient Named ${patientName} had already taken Appointment with ${doctorName} on ${appntDate}`);
            } else {
                // Get the token number for the new appointment
                const tokenNumber = countAppointments + 1;

                // Registering the Appointment with token number
                const newAppointment = new appointments({
                    patientId, patId, patientName, department, doctorId, doctorName, appntDate, tokenNumber
                });
                await newAppointment.save();
                res.status(200).json(newAppointment);
            }
        } else {
            res.status(406).json(`Doctor ${doctorName} has already reached the maximum appointments limit for ${appntDate}`);
        }

    } catch (err) {
        res.status(401).json(`Error!!! Transaction failed: ${err}`);
    }
}



// ----- Displaying Appointment List of Patients ------------------------------------------------------

exports.appointmentList = async (req, res) => {
    console.log("Inside Displaying Appointment List Function");
    const { patientId, doctorId } = req.body
    const query = doctorId ? { doctorId: { $regex: doctorId, $options: "i" } } : patientId ? { patientId: { $regex: patientId, $options: "i" } } : {};
    try {
        const allAppointments = await appointments.find(query)
        res.status(200).json(allAppointments)
    } catch (err) {
        res.status(401).json(`Error!!! Transaction failed : ${err}`)
    }
}



// --------- Editing Appointment List of Patients --------------------------------------------------------------------


exports.editAppointment = async (req, res) => {
    console.log('Inside editing a Appointment Function')
    const userId = req.payload
    const { patientId, patId, patientName, department, doctorId, doctorName, appntDate } = req.body
    const { id } = req.params
    try {
        // Count the number of appointments for the doctor on the given date
            const countAppointments = await appointments.countDocuments({ doctorId, appntDate });

        // Check if the count is less than 50
            if (countAppointments < 3) {
                // Check if the appointment already exists
                const existingAppnt = await appointments.findOne({ patientId, doctorId, appntDate });
                if (existingAppnt) {
                    res.status(406).json(`Patient Named ${patientName} had already taken Appointment with ${doctorName} on ${appntDate}`);
                } else {
                    // Get the token number for the new appointment
                    const tokenNumber = countAppointments + 1;
                    const updateAppointment = await appointments.findByIdAndUpdate({ _id: id }, {
                        patientId, patId, patientName, department, doctorId, doctorName, appntDate , tokenNumber
                    }, { new: true })
                    await updateAppointment.save()
                    res.status(200).json(updateAppointment)

                }
            }

    } catch (err) {
        res.status(401).json(`Error!!! Transaction failed: ${err}`)
    }

}

// ------Deleting Department----------------------------------------------------------------------------


exports.deleteAppointment = async(req,res)=>{
    console.log('Inside deleting a Appointment function')
    const {id} = req.params
    try{
        const removeAppointment = await appointments.findByIdAndDelete({_id:id})
        const { doctorId, appntDate, tokenNumber } = removeAppointment;

        // // Find all appointments of the same doctor on the same date with token numbers greater than the deleted appointment
        const appointmentsToUpdate = await appointments.find({ doctorId, appntDate, tokenNumber: { $gt: tokenNumber } });

        // // Update the token numbers of subsequent appointments
        for (const appointment of appointmentsToUpdate) {
            appointment.tokenNumber -= 1;
            await appointment.save();
        }
        res.status(200).json(removeAppointment)
        
    }catch(err){
        res.status(401).json(`Error!!! Transaction failed: ${err}`)
    }
}