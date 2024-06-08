const prescriptions = require('../Models/prescriptionSchema')
const pendingPharmacyMedicineRequests = require('../Models/pendingPharmacyMedicineRequestsSchema')
const patients = require('../Models/patientSchema')

// register new Prescription
    exports.prescriptionRegister = async(req,res)=>{
        console.log("Inside Prescription Adding");
        const {patientId,doctorNameDep,complaint,reviewPhysical,diagonisationFinding,medication,assessment,plan,followup,prescriptionDate} = req.body
        try{   
            // Find patient details
            const patient = await patients.findById(patientId);

            // adding prescription
            const newPrescription = new prescriptions({
                patientId,doctorNameDep,complaint,reviewPhysical,diagonisationFinding,medication,assessment,plan,followup,prescriptionDate
            })

            await newPrescription.save()
            res.status(200).json(newPrescription) 

            // Add data to pendingBilling collection
            const newPendingPharmacyRequest = new pendingPharmacyMedicineRequests({
                patId: patient.patId, patientName: patient.username, doctorNameDep, medication, prescriptionDate
            }); 
            await newPendingPharmacyRequest.save();

        }catch(err){
            res.status(401).json(`Error!!! Transaction failed: ${err}`)
        }

    }

// Fetching presciptions of a particular patient
    exports.prescriptionList = async(req,res)=>{
        const {patientId} = req.body
        console.log("Inside Displaying List of Prescription ");
        const query = { patientId: { $regex: patientId, $options: "i" } }
        try{
            const allPrescription = await prescriptions.find(query)
            res.status(200).json(allPrescription)

        }catch(err){
            res.status(401).json(`Error!!! Transcation failed: ${err}`)
        } 
    } 