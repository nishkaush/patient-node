const {
  mongoose
} = require("./../mongoose/mongoose");


var medicineSchema = new mongoose.Schema({
  name: "",
  type: "", //tablet,ointment and liquid
  currentStock: "",
  history: [{
    qty: "",
    operationType: "", //issued or added
    operationDate: "",
    doneBy: ""
  }]
});


var myMedicines = mongoose.model("myMedicines", medicineSchema);


module.exports = {
  myMedicines
};
