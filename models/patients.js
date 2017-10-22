const {
  mongoose
} = require("./../mongoose/mongoose");

const {
  autoIncrement
} = require("./../mongoose/mongoose");


var MedicalHistorySchema = new mongoose.Schema({
  diagnosis: "",
  medicine: [{
    name: "",
    qty: ""
  }],
  tests: [{
    name: "",
    qty: ""
  }],
  issuedAt: "",
  issuedBy: "",
  opdFee: "",
});


var patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: Number,
    required: true
  },
  address: {
    type: String,
  },
  email: {
    type: String,
  },
  photoId: {
    type: String,
  },
  dob: {
    type: String,
    required: true
  },
  patientType: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  opd: {
    type: Number
  },
  medicalHistory: [],
  createdAt: "",
  createdBy: ""
});

patientSchema.plugin(autoIncrement.plugin, {
  model: "myPatients",
  field: "patientNumber",
  startAt: 1
});


var opdNumberSchema = new mongoose.Schema({
  dateCreated: ""
});
opdNumberSchema.plugin(autoIncrement.plugin, {
  model: "myOpdNumber",
  field: "opdNumber",
  startAt: 1
});

var myPatients = mongoose.model("myPatients", patientSchema);
var myOpdNumber = mongoose.model("myOpdNumber", opdNumberSchema);

module.exports = {
  myPatients,
  myOpdNumber
};
