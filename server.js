const express = require("express");
const bodyParser = require("body-parser");

const {
  router
} = require("./Routes/Authentication/login-signup");

const {
  userRouter
} = require("./Routes/User/user-routes");

const {
  stockRouter
} = require("./Routes/Stock/stock-routes");

const {
  reportRouter
} = require("./Routes/Reports/report-routes");


// --------------------------------------------------------------------
var app = express();
var port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// --------------------------------------------------------------------
// Enabling CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

// --------------------------------------------------------------------
// Enabling Mini-Routers
// app.use("/user", userRouter); this means - in userRouter, if we define routes like so: /lol, /lmao or /anything, the router will render them as /user/lol, /user/lmao and /user/anything. We don't need to say /user/something all the time when using the router
app.use("/", router);
app.use("/user", userRouter);
app.use("/stock", stockRouter);
app.use("/report", reportRouter);


// --------------------------------------------------------------------
// Listening to events on port
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
