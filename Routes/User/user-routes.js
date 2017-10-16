const express = require("express");
const _ = require("lodash");
const moment = require("moment");
const {
  myPatients
} = require("./../../models/patients");
const {
  myMedicines
} = require("./../../models/medicines");
const {
  myTests
} = require("./../../models/tests");
const {
  authMiddleware
} = require("./../Authentication/login-signup");

var userRouter = express.Router();

userRouter.post("/checkExisting", authMiddleware, (req, res) => {
  myPatients.findOne({
    name: req.body.name,
    phone: req.body.phone
  }).then((patient) => {
    if (!patient) {
      return res.send({
        found: false
      });
    }
    return res.send({
      found: true
    });
  }).catch((e) => {
    console.log("Something went wrong while trying to check existing user", e);
    res.send({
      found: "duno"
    });
  });
});

userRouter.post("/add", authMiddleware, (req, res) => {

  var medicalHistoryEntry = "";
  if (!req.body.diagData && req.body.medData.length === 0 && req.body.testData.length === 0) {
    medicalHistoryEntry = [];
  } else {
    medicalHistoryEntry = [{
      diagnosis: req.body.diagData,
      medicine: req.body.medData,
      tests: req.body.testData,
      opdFee: !req.body.form.opd ? 0 : req.body.form.opd,
      issuedBy: req.payload.email,
      issuedAt: Date.now()
    }];
  }

  var newPatient = new myPatients({
    name: req.body.form.name,
    email: req.body.form.email,
    phone: req.body.form.phone,
    address: req.body.form.address,
    photoId: req.body.form.photoId,
    dob: req.body.form.dob,
    gender: req.body.form.gender,
    patientType: req.body.form.patientType,
    opd: req.body.form.opd,
    medicalHistory: medicalHistoryEntry,
    createdBy: req.payload.email,
    createdAt: Date.now()
  });
  newPatient.save().then((patient) => {
    //now lets deduct the medicines from the main stock

    req.body.medData.forEach((e) => {
      myMedicines.updateMany({
        name: e.name
      }, {
        $inc: {
          currentStock: -e.qty
        },
        $push: {
          history: {
            qty: parseInt(e.qty),
            operationType: "issued",
            operationDate: moment().format("Do MMM YYYY"),
            doneBy: req.payload.email
          }
        }
      }).then(() => {
        console.log("updated many medicines!!!");
      }).catch((err) => {
        console.log(err);
        return res.send({
          saved: false
        });
      });
    });

    //WRITE THE SAME THING FOR TESTS AS WELL

    req.body.testData.forEach((e) => {
      myTests.updateMany({
        name: e.name
      }, {
        $push: {
          history: {
            qty: e.qty,
            issueDate: moment().format("Do MMM YYYY"),
            issuedBy: req.payload.email
          }
        }
      }).then(() => {
        console.log("updated many tests!!!");
      }).catch((err) => {
        res.send({
          saved: false
        });
      });
    });
    // Finally send a good response back if all is well
    res.send({
      saved: true,
      patientNumber: patient.patientNumber
    });
  }).catch((e) => {
    console.log("Error in saving new patient", e);
    res.send({
      saved: false
    });
  });
});



userRouter.get("/search/:term", authMiddleware, (req, res) => {
  myPatients.find({
    name: new RegExp(`${req.params.term}`, "i")
  }).then((patients) => {
    if (patients.length === 0) {
      return res.send({
        found: false
      });
    }
    return res.send({
      found: true,
      arr: patients
    });
  }).catch((e) => {
    return res.send({
      found: false,
    });
  });
});


userRouter.post("/updatePersonal", authMiddleware, (req, res) => {
  myPatients.findOneAndUpdate({
    _id: req.body._id
  }, {
    $set: {
      name: req.body.name,
      phone: req.body.phone,
      address: req.body.address,
      email: req.body.email,
      dob: req.body.dob,
      photoId: req.body.photoId,
      gender: req.body.gender,
      opd: req.body.opd,
      patientType: req.body.patientType
    }
  }, {
    new: true
  }).then((patient) => {
    if (!patient) {
      return res.send({
        update: "fail",
      });
    }
    return res.send({
      update: "success",
      updatedPatient: patient
    });
  }).catch((e) => {
    console.log(e);
    res.send({
      update: "fail",
    });
  });
});



userRouter.post("/addPrescription", authMiddleware, (req, res) => {
  let medicalHistoryEntry = {
    diagnosis: req.body.diagnosis,
    medicine: req.body.medicine,
    tests: req.body.tests,
    opdFee: req.body.opdFee,
    issuedBy: req.payload.email,
    issuedAt: Date.now()
  };
  myPatients.findOneAndUpdate({
    _id: req.body._id
  }, {
    $push: {
      medicalHistory: {
        $each: [medicalHistoryEntry],
        $position: 0
      }
    },
  }, {
    new: true
  }).then((patient) => {
    if (!patient) {
      return res.send({
        update: "fail",
      });
    }
    // THIS IS WHERE ALL THE MAGIC HAPPENS ABOUT DEDUCTING MEDICINES

    req.body.medicine.forEach((e) => {
      myMedicines.updateMany({
        name: e.name
      }, {
        $inc: {
          currentStock: -e.qty
        },
        $push: {
          history: {
            qty: parseInt(e.qty), //chnaged the shit here
            operationType: "issued",
            operationDate: moment().format("Do MMM YYYY"),
            doneBy: req.payload.email
          }
        }
      }).then(() => {
        console.log("updated medicines successfully");
      }).catch((err) => {
        console.log(err);
        return res.send({
          update: "false",
          // updatedPatient: patient
        });
      });
    });

    //add tests here
    req.body.tests.forEach((e) => {
      myTests.updateMany({
        name: e.name
      }, {
        $push: {
          history: {
            qty: parseInt(e.qty),
            issueDate: moment().format("Do MMM YYYY"),
            issuedBy: req.payload.email
          }
        }
      }).then(() => {
        console.log("updated many tests!!!");
      }).catch((err) => {
        return res.send({
          saved: false
        });
      });
    });

    return res.send({
      update: "success",
      updatedPatient: patient
    });
  }).catch((err) => {
    console.log(err);
    res.send({
      update: "false",
      updatedPatient: patient
    });
  });
});



userRouter.post("/deletePatient", authMiddleware, (req, res) => {
  myPatients.findOneAndRemove({
    _id: req.body._id
  }).then((re) => {
    if (!re) {
      return res.send({
        update: "fail"
      });
    }
    return res.send({
      update: "success"
    });
  }).catch((e) => {
    res.send({
      update: "fail"
    });
  });
});

module.exports = {
  userRouter
};
