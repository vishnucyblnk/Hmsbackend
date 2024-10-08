const patients = require('../Models/patientSchema');
const employees = require('../Models/employeeSchema');
const githubController = require('../Controllers/githubController');
const validator = require('validator');

// register patient

    exports.register = async (req,res)=>{
        console.log("Inside Patient register function");
        const {username,role,email,gender,dob,bloodgroup,phone,address} = req.body
        const profImg = req.file.filename

        try{
            // check already existing - findone() || email is in correct format
            const existingEmployee = await employees.findOne({email})
            const existingPatient = await patients.findOne({email})
            if(existingEmployee){
                res.status(406).json('An Employee Already exist with that email Id')
            }
            else if (existingPatient){
                res.status(406).json('This Email Already Registered by Someone')
            }
            else if (!validator.isEmail(email)) {
                res.status(400).json('Invalid email format');
            }
            else{
                // registering patient
                const now = new Date();
                const year = now.getFullYear().toString().slice(-2);

                let newIdNumber = 1;
                const lastPatient = await patients.findOne().sort({ patId: -1 });

                if (lastPatient) {
                    const lastId = lastPatient.patId;
                    const lastIdNumber = parseInt(lastId.slice(8)); // Extract the numeric part of the last ID
                    newIdNumber = lastIdNumber + 1;
                }

                
                const patId = `CLV${year}${role}${(parseInt(newIdNumber)).toString().padStart(4, '0')}`;

                const age = calculateAge(dob);

                // register patient
                    const newPatient = new patients({
                        patId,username,role,email,gender,dob,age,bloodgroup,phone,address,profImg
                    })
                    await newPatient.save()
                    res.status(200).json(newPatient)
                    githubController.uploadImageAndPdf(req,res)
            }
        }catch(err){
            res.status(401).json(`Error!!! Transaction failed: ${err}`)
        }
    }
                    // Function to calculate age
                        function calculateAge(birthDate) {
                            const today = new Date();
                            const dob = new Date(birthDate);

                            let age = today.getFullYear() - dob.getFullYear();
                            
                            // Check if the birthday hasn't occurred yet this year
                            const monthDiff = today.getMonth() - dob.getMonth();
                            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
                                age--;
                            }
                            
                            return age;
                        }

// Displaying List of Patients

    exports.patientList = async(req,res)=>{
        console.log("Inside Displaying List of Patients");
        const {patId} = req.body
        const query = patId ? { patId: { $regex: patId, $options: "i" } } : {};
        try{
            const allPatients = await patients.find(query)
            res.status(200).json(allPatients)
        }catch(err){
            res.status(401).json(`Error!!! Transaction failed : ${err}`)
        }
    }

// Displaying A Patients
    exports.fetchPatient = async(req,res)=>{
        console.log("Inside Displaying detail of a Patient");
        const {role,patId} = req.body
        try{
            const aPatient = await patients.findOne({role,patId})
            res.status(200).json(aPatient)
        }catch(err){
            res.status(401).json(`Error!!! Transaction failed : ${err}`)
        }
    }


// edit Patient
    exports.editPatient = async(req,res)=>{
        console.log('Inside editing a Patient details')

        const userId = req.payload
        const {username,role,email,gender,dob,bloodgroup,phone,address,profImg} = req.body
        const {id} = req.params 
        const uploadedImage = req.file ? req.file.filename : profImg

        const age = calculateAge(dob);

        try{
            const existingPatient = await patients.findOne({ _id: id });
            if (!existingPatient) {
                return res.status(404).json('Patient not found');
            }
            const prevImg = existingPatient.profImg;

            // Validate email using validator library
            if (!validator.isEmail(email)) {
                return res.status(400).json('Invalid email format');
            }

            const employeeWithEmail = await employees.find({ email });
            const patientWithEmail = await patients.find({ email });

            if (patientWithEmail.length > 0 && patientWithEmail[0]._id.toString() !== id) {
                return res.status(400).json('This Email is Already Registered by Someone');
            }else if(employeeWithEmail.length > 0 && employeeWithEmail[0]._id.toString() !== id){
                return res.status(400).json('An Employee Already exist with that email Id');
            }

            const updatePatient = await patients.findByIdAndUpdate({_id:id},{
                username,role,email,gender,dob,age,bloodgroup,phone,address,profImg:uploadedImage
            },{new:true})

            if (!updatePatient) {
                return res.status(500).json('Error updating patient details');
            }

            await updatePatient.save()
            res.status(200).json(updatePatient)

            githubController.editInGitHub(prevImg,uploadedImage,'image');
        }catch(err){
            res.status(401).json(`Error!!! Transaction failed: ${err}`)
        }
        
    }


// delete Patient

    exports.deletePatient = async(req,res)=>{
        const {id} = req.params
        try{
            // Check if the patient exists
            const existingPatient = await patients.findOne({ _id: id });
            if (!existingPatient) {
                return res.status(404).json({ message: 'Patient not found' });
            }

            const removePatient = await patients.findByIdAndDelete({_id:id})
            res.status(200).json(removePatient)
            githubController.deleteFromGitHub(existingPatient?.profImg, 'image');
        }catch(err){
            res.status(401).json(`Error!!! Transaction failed: ${err}`)
        }
    }