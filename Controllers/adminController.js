const employees = require('../Models/employeeSchema');
const departments = require('../Models/departmentSchema');

// -----Displaying List of Members in corresponding role-----------------------------------------------
    exports.memberList = async (req,res)=>{
        console.log('Inside Displaying List of Members in corresponding role Function');
        const {role,department} = req.body
        const query = role ? { role: { $regex: role, $options: "i" } } : department ? { department: { $regex: department, $options: "i" } } : {};
        try{
            const allMembers = await employees.find(query)  
            res.status(200).json(allMembers)
        }catch(err){
            res.status(401).json(`Error!!! Transaction failed : ${err}`)
        }
    }

// -----Displaying A Member in corresponding role-----------------------------------------------
exports.fetchMember = async (req,res)=>{
    console.log('Inside Displaying A Members in corresponding role Function');
    const {role,empId} = req.body
    try{
        const aMember = await employees.findOne({role,empId}) 
        res.status(200).json(aMember)
    }catch(err){
        res.status(401).json(`Error!!! Transaction failed : ${err}`)
    }
}

// -----registering new departments-----------------------------------------------------------
    exports.departmentRegister = async (req,res)=>{
        console.log('Inside register Department function');
        const {name,description} = req.body
        try{
            // check already existing department - findone()
            const existingDepartment = await departments.findOne({name})
            if(existingDepartment){
                res.status(406).json('Department already exist... Please add new department!!!')
            }else{
                // register Department
                const newDepartment = new departments({
                    name,description
                })
                await newDepartment.save()
                res.status(200).json(newDepartment)
            }
        }catch(err){
            res.status(401).json(`Error!!! Transaction failed: ${err}`)
        }
    }

// -----Displaying List of deparmtents-----------------------------------------------------------
    exports.departmentList = async (req,res)=>{
        console.log('Inside Displaying List of Departments');
        const {name} = req.body
        const query = name ? { name: { $regex: name, $options: "i" } } : {};
        try{
            const allDepartments = await departments.find(query)
            res.status(200).json(allDepartments)
        }catch(err){
            res.status(401).json(`Error!!! Transaction failed : ${err}`)
        }
    }

// ------Editing department------------------------------------------------------------------------

// edit department
    exports.editDepartment = async(req,res)=>{
        console.log('Inside editing a Department details')
        const userId = req.payload
        const {name,description} = req.body
        const {id} = req.params 
        try{
            const updateDepartment = await departments.findByIdAndUpdate({_id:id},{
                name,description
            },{new:true})
            await updateDepartment.save()
            res.status(200).json(updateDepartment)

        }catch(err){
            res.status(401).json(`Error!!! Transaction failed: ${err}`)
        }
        
    }




// ------Deleting Department----------------------------------------------------------------------------


    exports.deleteDepartment = async(req,res)=>{
        console.log('Inside deleting a Department function')
        const {id} = req.params

        try{
            const removeProject = await departments.findByIdAndDelete({_id:id})
            res.status(200).json(removeProject)
            
        }catch(err){
            res.status(401).json(`Error!!! Transaction failed: ${err}`)
        }
    }

