const employees = require('../Models/employeeSchema');
const jwt = require('jsonwebtoken');
const githubController = require('../Controllers/githubController');
const validator = require('validator');

// register 

    exports.register = async (req,res)=>{
        console.log('Inside employee register function');
        const {username,role,email,password,department,bloodgroup,gender,dob,phone,address} = req.body
        const profImg = req.file.filename
        
        // Validate email using validator library
        if (!validator.isEmail(email)) {
            return res.status(400).json('Invalid email format');
        }

        // console.log(`Username: ${username},role: ${role}, Email : ${email}, password : ${password}, department : ${department}, bloodgroup : ${bloodgroup}, gender : ${gender}, dob : ${dob}, phone : ${phone}, address : ${address}, profImg : ${profImg}`);
        try{
            // check already existing employee - findone()
            const existingEmployee = await employees.findOne({email})
            if(existingEmployee){
                res.status(406).json('Employee already exist with that email Id... Please Login...')
            }else{

                const now = new Date();
                const year = now.getFullYear().toString().slice(-2);
                const count = await employees.countDocuments();
                const empId = `CLV${year}${role}${(parseInt(count) + 1).toString().padStart(4, '0')}`;

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
        console.log('Inside editing Employee Details')

        // Validate email using validator library
        if (!validator.isEmail(email)) {
            return res.status(400).json('Invalid email format');
        }
        
        const userId = req.payload
        const {username,role,email,password,department,bloodgroup,gender,dob,phone,address,profImg} = req.body
        const {id} = req.params 
        const uploadedImage = req.file ? req.file.filename : profImg
        const age = calculateAge(dob);

        const data = await employees.findOne({ _id: id });
        const prevImg = data.profImg;
        try{
            const updateEmployee = await employees.findByIdAndUpdate({_id:id},{
                 username,role,email,password,department,bloodgroup,gender,dob,age,phone,address,profImg:uploadedImage
             },{new:true})
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
