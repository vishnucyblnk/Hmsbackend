const pendingPharmacyMedicineRequests = require('../Models/pendingPharmacyMedicineRequestsSchema');
const stocks = require('../Models/stockSchema')


// -----registering new medcines-----------------------------------------------------------
exports.stockRegister = async (req,res)=>{
    console.log('Inside register medicine function');
    const {medicineName,batchNo,expDate,price,stockQuantity} = req.body
    try{
        // check already existing medicine - findone()
        const existingMedicine = await stocks.findOne({medicineName})
        if(existingMedicine){
            res.status(406).json('Medicine already exist... Please add new medicine!!!')
        }else{
            // register Medicine
            const newStock = new stocks({
                medicineName,batchNo,expDate,price,stockQuantity
            })
            await newStock.save()
            res.status(200).json(newStock)
        }
    }catch(err){
        res.status(401).json(`Error!!! Transaction failed: ${err}`)
    }
}

// -----Displaying List of Stocks-----------------------------------------------------------
exports.stockList = async (req,res)=>{
    console.log('Inside Displaying List of Medicines');
    const {medicineName} = req.body
    const query = medicineName ? { medicineName: { $regex: medicineName, $options: "i" } } : {};
    try{
        const allStocks = await stocks.find(query)
        res.status(200).json(allStocks)
    }catch(err){
        res.status(401).json(`Error!!! Transaction failed : ${err}`)
    }
}

// ------Editing A Medicines Stock Details------------------------------------------------------------------------

exports.editStock = async(req,res)=>{
    console.log('Inside editing a Medicines Stock details')
    const {medicineName,batchNo,expDate,price,stockQuantity} = req.body
    const {id} = req.params 
    try{
        const updateStock = await stocks.findByIdAndUpdate({_id:id},{
            medicineName,batchNo,expDate,price,stockQuantity
        },{new:true})
        await updateStock.save()
        res.status(200).json(updateStock)

    }catch(err){
        res.status(401).json(`Error!!! Transaction failed: ${err}`)
    }
    
}




// ------Deleting Stock----------------------------------------------------------------------------


exports.deleteStock = async(req,res)=>{
    console.log('Inside deleting a Medicine function')
    const {id} = req.params

    try{
        const removeStock = await stocks.findByIdAndDelete({_id:id})
        res.status(200).json(removeStock)
        
    }catch(err){
        res.status(401).json(`Error!!! Transaction failed: ${err}`)
    }
}

// ------Pending Medicine Request Fetching -----------------------------------------------------------

exports.pendingMedicineRequestFetching = async(req,res)=>{
    console.log('Inside pending medicine Request Fetching Function');
    try{
        // fetching all request
        const allTestReq = await pendingPharmacyMedicineRequests.find()
        res.status(200).json(allTestReq)
    }catch(err){
        res.status(401).json(`Error!!! Transaction failed: ${err}`)
    }
}


// ------Delete Pending Medicine Request -----------------------------------------------------------
exports.deletePendingMedicineRequest = async(req,res)=>{
    console.log('Inside deleting a pending Medicine Request function')
    const {id} = req.params
    try{
        const removeStock = await pendingPharmacyMedicineRequests.findByIdAndDelete({_id:id})
        res.status(200).json(removeStock)
        
    }catch(err){
        res.status(401).json(`Error!!! Transaction failed: ${err}`)
    }
}
