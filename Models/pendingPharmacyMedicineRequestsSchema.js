const mongoose = require('mongoose')
const pendingPharmacyMedicineRequestsSchema = new mongoose.Schema({
    patId: {
        type: String
    },
    patientName: {
        type: String
    },
    doctorNameDep: {
        type: String
    },
    medication:{
        type: String
    },
    prescriptionDate:{
        type: String
    }
})

const pendingPharmacyMedicineRequests = mongoose.model("pendingPharmacyMedicineRequests",pendingPharmacyMedicineRequestsSchema)

module.exports = pendingPharmacyMedicineRequests