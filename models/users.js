const jwt = require("jsonwebtoken");

const {
  mongoose
} = require("./../mongoose/mongoose");

var userSchema = new mongoose.Schema({
  email: String,
  password: String,
  token: String
});

let mysecret = "nishsecret";

userSchema.methods.generateToken = function() {
  var currentUser = this;
  return jwt.sign({
    type: "access",
    payload: currentUser._id
  }, mysecret, (err, newtoken) => {
    if (err) {
      console.log(err);
      return err;
    }
    currentUser.token = newtoken;
    return newtoken;
  });
}

var myUsers = mongoose.model("myUsers", userSchema);

module.exports = {
  myUsers
};
