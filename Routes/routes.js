// imported express
const express = require('express');

require('dotenv').config()

const multerConfig = require('../Middlewares/multerMiddleware');
const jwtMiddleware = require('../Middlewares/jwtMiddleware');

const employeeController = require('../Controllers/employeeController');
const adminController = require('../Controllers/adminController');
const patientController = require('../Controllers/patientController');
const appointmentController = require('../Controllers/appointmentController');
const doctorController = require('../Controllers/doctorController');
const bloodController = require('../Controllers/bloodController');
const labDiagController =  require('../Controllers/labDiagController');
const dashBoardController = require('../Controllers/dashBoardController');
const stockController = require('../Controllers/stockController');

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// created router for express app using Router object
const router = new express.Router()



// GitHub Repository details
const GITHUB_REPO = "vishnucyblnk/Hmsbackend";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // GitHub Token stored in environment variable

// Function to upload file to GitHub
const uploadToGitHub = async (fileName, content, fileType) => {
    try {
        console.log(`Uploading ${fileType} to GitHub: ${fileName}`);
        const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/uploads/${fileType}s/${fileName}`;
        const data = {
            message: `Add ${fileName}`,
            content: content
        };
        const headers = {
            "Authorization": `token ${GITHUB_TOKEN}`,
            "Accept": "application/vnd.github.v3+json"
        };

        await axios.put(url, data, { headers });
        console.log(`${fileType} uploaded to GitHub successfully: ${fileName}`);
    } catch (error) {
        throw new Error(`Failed to upload ${fileType} to GitHub: ${error.message}`);
    }
};


// define different routes for server app


// -----ADMIN RELATED-----------------------------------------------------------------

    // employeeregister
    router.post('/employee/register',jwtMiddleware,multerConfig('image').single('profImg'), async (req, res) => {
    console.log("entered");
    const file = req.file;
    console.log(file);

    if (!file) {
        return res.status(400).json({ error: "No file uploaded or unsupported file type" });
    }

    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ error: "No file uploaded or unsupported file type" });
        }
        const fileType = req.file.fieldname === 'profImg' ? 'image' : 'pdf'; // Determine the file type
        const filePath = path.join(__dirname, '..', 'uploads', fileType + 's', file.filename);
        console.log("filePath",filePath);
        const fileContent = fs.readFileSync(filePath, { encoding: 'base64' });
        await uploadToGitHub(file.filename, fileContent, 'image');
        fs.unlinkSync(filePath); // Delete the file after upload
        employeeController.register(req,res);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
    // adminlogin
        router.post('/employee/login',employeeController.login)
    // admin member List
        router.post('/admin/membersList',adminController.memberList)
    // edit Employee - path parameter is id
        router.put('/employee/edit/:id',jwtMiddleware,multerConfig('image').single('profImg'),employeeController.editEmployee)
    // delete Employee
        router.delete('/employee/remove/:id',jwtMiddleware,employeeController.deleteEmployee)
    // A Employee details
        router.post('/admin/memberdisp',adminController.fetchMember)

// -----PATIENT RELATED-----------------------------------------------------------------

    // patient adding
        router.post('/patient/register',jwtMiddleware,multerConfig('image').single('profImg'),patientController.register)
    // patient list
        router.post('/patient/patientList',patientController.patientList)
    // edit Patient - path parameter is id
        router.put('/patient/edit/:id',jwtMiddleware,multerConfig('image').single('profImg'),patientController.editPatient)
    // delete Patient
        router.delete('/patient/remove/:id',jwtMiddleware,patientController.deletePatient)
    // A Patient details
        router.post('/patient/patientdisp',patientController.fetchPatient)

// -----DEPARTMENT RELATED-----------------------------------------------------------------

    // department register
        router.post('/department/register',jwtMiddleware,adminController.departmentRegister)
    // department list
        router.post('/department/departmentList',adminController.departmentList)
    // editdepartment - path parameter is id
        router.put('/department/edit/:id',jwtMiddleware,adminController.editDepartment)
    // deleteDepartment
        router.delete('/department/remove/:id',jwtMiddleware,adminController.deleteDepartment)

// -----NOTIFICATION RELATED----------------------------------------------------------------

    // notification Adding
        router.post('/notification/add',jwtMiddleware,dashBoardController.notificationAdding)
    // notification Showing
        router.get('/notification/showNotification',dashBoardController.notificationFetching)
    // notification removing
        router.post('/notifcation/remove',jwtMiddleware,dashBoardController.notificationRemove)


// -----APPOINTMENT RELATED-----------------------------------------------------------------

    // appointment register
        router.post('/appointment/register',jwtMiddleware,appointmentController.appointmentRegister) 
    // appointment List fetching
        router.post('/appointment/appointmentList',appointmentController.appointmentList)
    // edit Appointment - path parameter is id
        router.put('/appointment/edit/:id',jwtMiddleware,appointmentController.editAppointment)
     // deleteDepartment
        router.delete('/appointment/remove/:id',jwtMiddleware,appointmentController.deleteAppointment)

// -----DOCTOR RELATED-----------------------------------------------------------------

    // Prescription Adding
        router.post('/doctor/newPrescription',jwtMiddleware,doctorController.prescriptionRegister)
    // prescription fetching of a patient
        router.post('/doctor/prescriptionList',doctorController.prescriptionList)

// -----Laboratory Diagnostic Related--------------------------------------------------

    // laboratort Diagnostic Request sending
        router.post('/labDiag/req',jwtMiddleware,labDiagController.labDiagRequest)
    // fetching laboratory Diagnostic Request
        router.post('/labDiag/fetchReq',labDiagController.labDiagFetchReq)
    // adding laboratory Diagnostic Report of patient
        router.put('/labDiag/labDiagReport/:id',jwtMiddleware,multerConfig('pdf').single('lbDgReport'),labDiagController.labDiagAddingReport)

// -----BLOOD BANK RELATED---------------------------------------------------------------

    // Access all Data contain bloodBank
        router.post('/bloodbank/bloodDetails',bloodController.bloodBankDetails)

// -----DASHBOARD RELATED----------------------------------------------------------------

    // Calender events Adding
        router.post('/dashboard/eventAdd',jwtMiddleware,dashBoardController.calenderEventAdd)
    // Calender events Fetching
        router.post('/dashboard/eventFetch',dashBoardController.calenderEventFetch)
    // Calender events removing
        router.post('/dashboard/removeEvent',jwtMiddleware,dashBoardController.calenderEventRemove)
    // sticky Notes Adding
        router.post('/dashBoard/stickyNoteAdd',jwtMiddleware,dashBoardController.stickyNotesAdd)
    // sticky Notes Fetching
        router.post('/dashboard/stickyNoteFetch',dashBoardController.stickyNotesFetch)
    // sticky Notes Removing
        router.post('/dashboard/removeStickyNote',jwtMiddleware,dashBoardController.stickyNotesRemove)

// -----PHARMACY RELATED-----------------------------------------------------------------

    // stock register
        router.post('/pharmacy/register',jwtMiddleware,stockController.stockRegister)
    // stock list
        router.get('/pharmacy/stockList',stockController.stockList)
    // editStock - path parameter is id
        router.put('/pharmacy/edit/:id',jwtMiddleware,stockController.editStock)
    // delete Stock
        router.delete('/pharmacy/remove/:id',jwtMiddleware,stockController.deleteStock)
    // medicine Pending Request
        router.get('/pharmacy/pendingRequest',stockController.pendingMedicineRequestFetching)
    // delete Medicine Pending Request
        router.delete('/pharmacy/removePendingRequest/:id',jwtMiddleware,stockController.deletePendingMedicineRequest)
        



// exporting router
module.exports = router