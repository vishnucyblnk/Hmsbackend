const employees = require('../Models/employeeSchema');
const patients = require('../Models/patientSchema');
const jwt = require('jsonwebtoken');
const githubController = require('../Controllers/githubController');
const validator = require('validator');

// register 

    exports.register = async (req,res)=>{
        console.log('Inside employee register function');
        const {username,role,email,password,department,bloodgroup,gender,dob,phone,address} = req.body
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
                const now = new Date();
                const year = now.getFullYear().toString().slice(-2);

                let newIdNumber = 1;
                const lastEmployee = await employees.findOne().sort({ empId: -1 });

                if (lastEmployee) {
                    const lastId = lastEmployee.empId;
                    const lastIdNumber = parseInt(lastId.slice(8)); // Extract the numeric part of the last ID
                    newIdNumber = lastIdNumber + 1;
                }

                
                const empId = `CLV${year}${role}${(parseInt(newIdNumber)).toString().padStart(4, '0')}`;

                const age = calculateAge(dob);

                // register employee
                    const newEmployee = new employees({
                        empId,username,role,email,password,department,bloodgroup,gender,dob,age,phone,address,profImg
                    })
                    await newEmployee.save();
                    res.status(200).json(newEmployee);
                    githubController.uploadImageAndPdf(req,res);
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


// login

    exports.login = async(req,res)=>{
        console.log('Inside login function');
        const {role,email,password} = req.body
        // console.log(role,email,password)
        try{
            const existingEmployee = await employees.findOne({role,email,password})
            if(existingEmployee){
                // generate token
                    const token = jwt.sign({userId:existingEmployee._id},"SecretKeyVishnu123");
                res.status(200).json({
                    existingEmployee,token
                })
            }else{
                res.status(404).json('Incorrect email / role / password')
            }
        }catch(err){
            res.status(401).json(`Error!!! Transaction failed: ${err}`)
        }
    }



// edit Employee
    exports.editEmployee = async(req,res)=>{
        console.log('Inside editing Employee Details');
        const userId = req.payload
        const {username,role,email,password,department,bloodgroup,gender,dob,phone,address,profImg} = req.body
        const {id} = req.params 
        const uploadedImage = req.file ? req.file.filename : profImg

        const age = calculateAge(dob);

        try{
            const existingEmployee = await employees.findOne({ _id: id });
            if (!existingEmployee) {
                return res.status(404).json('Employee not found');
            }
            const prevImg = existingEmployee.profImg;

            // Validate email using validator library
                if (!validator.isEmail(email)) {
                    return res.status(400).json('Invalid email format');
                }

            // email existence check
                const employeeWithEmail = await employees.find({ email });
                const patientWithEmail = await patients.find({ email });
                if (employeeWithEmail.length > 0 && employeeWithEmail[0]._id.toString() !== id){
                    return res.status(400).json('An Employee Already exist with that email Id');
                }else if (patientWithEmail.length > 0 && patientWithEmail[0]._id.toString() !== id){
                    return res.status(400).json('This Email Already Registered by Someone');
                }

            const updateEmployee = await employees.findByIdAndUpdate({_id:id},{
                username,role,email,password,department,bloodgroup,gender,dob,age,phone,address,profImg:uploadedImage
            },{new:true})

            if (!updateEmployee) {
                return res.status(500).json('Error updating employee details');
            }

            await updateEmployee.save()
            res.status(200).json(updateEmployee)

            githubController.editInGitHub(prevImg,uploadedImage,'image');
        }catch(err){
            res.status(401).json(`Error!!! Transaction failed: ${err}`)
        }
        
    }


// delete Employee

    exports.deleteEmployee = async(req,res)=>{
        console.log('Inside Deleting Employee Details')
        const {id} = req.params
        try{
            // Check if the employee exists
            const existingEmployee = await employees.findOne({ _id: id });
            if (!existingEmployee) {
                return res.status(404).json({ message: 'Employee not found' });
            }
            
            const removeEmployee = await employees.findByIdAndDelete({_id:id})
            res.status(200).json(removeEmployee)
            githubController.deleteFromGitHub(existingEmployee?.profImg, 'image');
        }catch(err){
            res.status(401).json(`Error!!! Transaction failed: ${err}`)
        }
    }
