const express = require('express')
const cors = require('cors')
const model = require('./model');

const app = express()
const port = 8080

app.use(express.urlencoded({ extended: false }));
app.use(cors())

// list all pizzas
app.get('/intakes', (req, res) => {
  // return a list of pizzas
  model.Intake.find().then((intakes) => {
    console.log("intakes queried from DB:", intakes);
    res.json(intakes);
  });
});

app.delete('/intakes/:intakeId', (req, res) => {

  model.Intake.findByIdAndDelete({ _id: req.params.intakeId }).then((intake) => {
      if (intake) {
          res.json(intake)
      } else {
          res.sendStatus(404);
      }
  })

});

// create new pizza
app.post('/intakes', (req, res) => {
  // create a new pizza record, append to pizzas collection

  var intake = new model.Intake({
    category: req.body.category,
    food: req.body.food,
    serving: req.body.serving,
    calories: req.body.calories,
  });

  intake.save().then((intake) => {
    console.log('Intake created!');
    res.status(201).json(intake);
  }).catch(function (err) {
    if (err.errors) {
      // mongoose validation faliure!
      var messages = {};
      for (var e in err.errors) {
        messages[e] = err.errors[e].message;
      }
      res.status(422).json(messages);
    } else {
      // some other (probably worse) failure.
      res.sendStatus(500);
    }
  });
});

// retrieve existing pizza member
app.get('/intakes/:intakeId', (req, res) => {
  model.Intake.findOne({ _id: req.params.intakeId }).then((intake) => {
    if (intake) {
      res.json(intake);
    } else {
      res.sendStatus(404);
    }
  }).catch((err) => {
    res.sendStatus(400);
  })
})

// update existing pizza member
app.put('/intakes/:intakeId', (req, res) => {
  model.Intake.findOne({ _id: req.params.intakeId }).then((intake) => {
    if (intake) {
      intake.category = req.body.category;
      intake.food = req.body.food;
      intake.serving = req.body.serving;
      intake.calories = req.body.calories;

      intake.save().then(() => {
        console.log('Intake updated!');
        res.sendStatus(200);
      }).catch((err) => {
        // problem saving
        res.sendStatus(500);
      });
    } else {
      res.sendStatus(404);
    }
  }).catch((err) => {
    // problem querying
    res.sendStatus(400);
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
