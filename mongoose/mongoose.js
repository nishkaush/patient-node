const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
mongoose.Promise = global.Promise;


let connection = mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/friends');
// let connection = mongoose.connect('mongodb://localhost:27017/friends' || process.env.MONGODB_URI);

// process.env.MONGODB_URI ||
autoIncrement.initialize(connection);

module.exports = {
  mongoose,
  autoIncrement
};
