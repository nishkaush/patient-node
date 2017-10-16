const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
mongoose.Promise = global.Promise;


let connection = mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/friends', {
  useMongoClient: true,
  promiseLibrary: global.Promise
});

autoIncrement.initialize(connection);

module.exports = {
  mongoose,
  autoIncrement
};
