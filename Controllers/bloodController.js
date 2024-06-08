const employees = require('../Models/employeeSchema');
const patients = require('../Models/patientSchema');


exports.bloodBankDetails = async (req, res) => {
    console.log("Inside Blood Bank Details Function");
    const {bloodgroup} = req.body;
    try {
        const res1 = await employees.find(bloodgroup ? { bloodgroup } : {});
        const res2 = await patients.find(bloodgroup ? { bloodgroup } : {});
        const allres = res1.concat(res2);
        res.status(200).json(allres);
    } catch (err) {
        res.status(401).json({ error: `Error!!! Transaction failed : ${err}` });
    }
}

