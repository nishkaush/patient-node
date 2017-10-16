const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const {
  myUsers
} = require("./../../models/users");


var router = express.Router();
let mysecret = "nishsecret";


router.post("/signup", (req, res) => {
  var newUser = new myUsers({
    email: req.body.data.email,
    password: req.body.data.password
  });
  newUser.save().then((response) => {
    jwt.sign({
      type: "access",
      email: response.email
    }, mysecret, (err, newtoken) => {
      if (err) {
        console.log(err);
        return err;
      }
      newUser.token = newtoken;
      newUser.save().then(() => {
        res.send({
          token: newtoken
        });
      });
    });

  }).catch((e) => {
    console.log("shit aint saving in db", e);
  });

});



router.post("/login", (req, res) => {
  myUsers.findOne({
    email: req.body.data.email
  }).then((user) => {
    if (!user) {
      return res.send({
        token: ""
      });
    }
    if (user.password !== req.body.data.password) {
      return res.send({
        token: ""
      });
    }
    jwt.sign({
      email: user.email
    }, mysecret, (err, newtoken) => {
      if (err) {
        return res.send({
          token: ""
        });
      }
      res.send({
        token: newtoken
      });
    });

  });
});


// using the following middleware to authenticate the header

var authMiddleware = function(req, res, next) {
  let token = req.headers.authorization;
  jwt.verify(token, mysecret, (err, payload) => {
    if (err) {
      req.error = err;
      res.send("something broke down in authorization", err);
    }
    req.payload = payload;
    next();
  });
};



router.get("/token-verify", authMiddleware, (req, res) => {
  if (req.error) {
    res.send({
      valid: false
    });
    return;
  }
  res.send({
    valid: true
  });

});



router.post("/remove-token", (req, res) => {
  console.log("request received to remove token");
  res.send("lol");
  let token = req.headers.authorization;
  myUsers.findOneAndUpdate({
    token: token
  }, {
    $unset: {
      token: ""
    }
  }, {
    new: true
  }).then((updatedUser) => {
    console.log("updated User after token deletion", updatedUser);
    res.send({
      deletedToken: true
    });
  });
});


module.exports = {
  router,
  authMiddleware
};
