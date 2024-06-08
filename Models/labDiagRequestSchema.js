const mongoose = require("mongoose");

const labDiagRequestSchema = new mongoose.Schema({
  modalfor: {
    type: String,
  },
  patientId: {
    type: String,
  },
  patId: {
    type: String,
  },
  patName: {
    type: String,
  },
  reqDate: {
    type: String,
  },
  refDoc: {
    type: String,
  },
  reqTest: {
    type: Array,
  },
  status: {
    type: Number,
  },
  lbDgReport:{
    type: String
  },
  relseRprtDate:{
    type: String
  }
});

const labDiagReqs = mongoose.model("labDiagReqs", labDiagRequestSchema);

module.exports = labDiagReqs;
