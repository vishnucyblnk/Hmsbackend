const labDiagReqs = require('../Models/labDiagRequestSchema');
const githubController = require('../Controllers/githubController');

exports.labDiagRequest = async(req,res)=>{
    console.log('Inside Laboratory Diagnostic registering request from doctor');
    const { modalfor,patientId,patId,patName,reqDate,refDoc,reqTest} = req.body
    try{
        // registering Request
        const status = 0
        const lbDgReport = ""
        const newLabDiagReq = new labDiagReqs({
            modalfor,patientId,patId,patName,reqDate,refDoc,reqTest,status,lbDgReport
        })
        await newLabDiagReq.save()
        res.status(200).json(newLabDiagReq)

    }catch(err){
        res.status(401).json(`Error!!! Transaction failed: ${err}`)
    }
}



exports.labDiagFetchReq = async(req,res)=>{
    console.log('Inside Laboratory Diagnostic Request Fetching');
    const {patientId,modalfor} = req.body
    const status =1;
    query = patientId ? {patientId: { $regex: patientId, $options: "i" },modalfor: { $regex: modalfor, $options: "i" },status:status} : {modalfor: { $regex: modalfor, $options: "i" }}
    try{
    // fetching all request
        const allTestReq = await labDiagReqs.find(query)
        res.status(200).json(allTestReq)
    }catch(err){
        res.status(401).json(`Error!!! Transaction failed: ${err}`)
    }
}



exports.labDiagAddingReport = async(req,res)=>{
    console.log("Inside adding laboratory / Diagnosis Report Adding Function");
    const {lbDgReport} = req.body
    const uploadedReport = req.file.filename
    const releaseDate = new Date().toJSON().slice(0, 10)
    const {id} = req.params
    try{
        // updating with the report
        const updatelabDiagReport = await labDiagReqs.findByIdAndUpdate({_id:id},{lbDgReport: uploadedReport,status:1,relseRprtDate: releaseDate},{new:true})
        await updatelabDiagReport.save();
        res.status(200).json(updatelabDiagReport);
        githubController.uploadImageAndPdf(req,res);
    }catch(err){
        res.status(401).json(`Error!!! Transaction failed: ${err}`);
    }
}


