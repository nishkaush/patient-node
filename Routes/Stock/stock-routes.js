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


var stockRouter = express.Router();


stockRouter.post("/add", authMiddleware, (req, res) => {
  var newMedicine = new myMedicines({
    name: req.body.title,
    type: req.body.type,
    currentStock: parseInt(req.body.qty),
    history: [{
      qty: parseInt(req.body.qty),
      operationType: "added",
      operationDate: moment().format("Do MMM YYYY"),
      doneBy: req.payload.email
    }]
  });
  newMedicine.save().then((medicine) => {
    res.send({
      status: "success",
      medicine: medicine
    });
  }).catch((err) => {
    console.log(err);
    res.send({
      status: "fail"
    });
  });
});



stockRouter.get("/search/:term", authMiddleware, (req, res) => {

  myMedicines.find({
    name: new RegExp(`${req.params.term}`, "i")
  }).then((med) => {
    return res.send({
      status: "success",
      medArr: med
    });
  }).catch((err) => {
    console.log(err);
    return res.send({
      status: "fail"
    });
  });
});



stockRouter.post("/deleteMedicine", authMiddleware, (req, res) => {

  myMedicines.findOneAndRemove({
    _id: req.body.id
  }).then((item) => {
    if (!item) {
      return res.send({
        status: "fail"
      });
    }
    return res.send({
      status: "success"
    });
  }).catch((e) => {
    res.send({
      status: "fail"
    });
  });

});




stockRouter.post("/updateMedStock", authMiddleware, (req, res) => {
  let medHistory = {
    qty: parseInt(req.body.qtyToAdd),
    operationType: "added", //issued or added
    operationDate: moment().format("Do MMM YYYY"),
    doneBy: req.payload.email
  }
  myMedicines.findOneAndUpdate({
    _id: req.body.id
  }, {
    $set: {
      name: req.body.name,
      type: req.body.type
    },
    $inc: {
      currentStock: req.body.qtyToAdd
    },
    $push: {
      history: medHistory
    }
  }, {
    new: true
  }).then((med) => {
    if (!med) {
      return res.send({
        status: "fail"
      });
    }
    return res.send({
      status: "success",
      med: med
    });
  }).catch((err) => {
    console.log(err);
    res.send({
      status: "fail"
    });
  });
});



stockRouter.get("/getAllMedicines", authMiddleware, (req, res) => {
  myMedicines.find({}).then((medArr) => {
    if (medArr.length === 0) {
      return res.send({
        status: "fail"
      });
    }
    return res.send({
      status: "success",
      allMedList: medArr
    });
  }).catch((err) => {
    console.log(err);
    return res.send({
      status: "fail"
    });
  })
});



// Routes for managing Tests Start here

stockRouter.post("/addNewTest/", authMiddleware, (req, res) => {
  var newTest = new myTests({
    name: req.body.name
  });
  newTest.save().then((test) => {
    if (!test) {
      return res.send({
        status: "fail"
      });
    }
    return res.send({
      status: "success"
    });
  }).catch((err) => {
    console.log(err);
    return res.send({
      status: "fail"
    });
  });
});




stockRouter.get("/searchTests/:term", authMiddleware, (req, res) => {
  myTests.find({
    name: new RegExp(`${req.params.term}`, "i")
  }).then((tests) => {
    if (tests.length === 0) {
      return res.send({
        status: "none"
      });
    }
    return res.send({
      status: "success",
      testsArr: tests
    });
  }).catch((err) => {
    console.log(err);
    res.send({
      status: "fail"
    });
  });
});


stockRouter.post("/deleteTest", authMiddleware, (req, res) => {
  myTests.findOneAndRemove({
    _id: req.body.id
  }).then((test) => {
    if (!test) {
      return res.send({
        status: "fail",
        test: test
      });
    }
    return res.send({
      status: "success",
      test: test
    });
  }).catch((err) => {
    res.send({
      status: "fail",
      test: test
    });
  });
});



stockRouter.post("/updateTest", authMiddleware, (req, res) => {
  myTests.findOneAndUpdate({
    _id: req.body.id
  }, {
    $set: {
      name: req.body.name
    }
  }, {
    new: true
  }).then((test) => {
    if (!test) {
      return res.send({
        status: "fail"
      });
    }
    return res.send({
      status: "success",
      test: test
    });
  });
});


stockRouter.get("/getAllTests", authMiddleware, (req, res) => {
  myTests.find({}).then((testArr) => {
    if (testArr.length === 0) {
      return res.send({
        status: "fail"
      });
    }
    return res.send({
      status: "success",
      allTestList: testArr
    });
  }).catch((err) => {
    console.log(err);
    return res.send({
      status: "fail"
    });
  })
});


module.exports = {
  stockRouter
};
