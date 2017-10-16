const {
  mongoose
} = require("./../mongoose/mongoose");


var testSchema = new mongoose.Schema({
  name: "",
  history: [{
    qty: "",
    issueDate: "",
    issuedBy: ""
  }]
});


var myTests = mongoose.model("myTests", testSchema);


module.exports = {
  myTests
};
