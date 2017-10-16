const express = require("express");
const _ = require("lodash");
const {
  myMedicines
} = require("./../../models/medicines");

const {
  myTests
} = require("./../../models/tests");

const {
  authMiddleware
} = require("./../Authentication/login-signup");

const moment = require("moment");


var reportRouter = express.Router();

reportRouter.get("/lowStock/:qty", authMiddleware, (req, res) => {
  myMedicines.find({
    currentStock: {
      $lte: parseInt(req.params.qty)
    }
  }).then((reportArr) => {
    if (reportArr.length === 0) {
      return res.send({
        status: "fail"
      });
    }
    return res.send({
      status: "success",
      reportArr: reportArr
    });
  }).catch((err) => {
    return res.send({
      status: "fail"
    });
  })
});


module.exports = {
  reportRouter
};
