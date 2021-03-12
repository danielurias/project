intakeId = null;

function createIntakeOnServer(intake) {
  var intakeData = "category=" + encodeURIComponent(intake.category);
  intakeData += "&food=" + encodeURIComponent(intake.food);
  intakeData += "&serving=" + encodeURIComponent(intake.serving);
  intakeData += "&calories=" + encodeURIComponent(intake.calories);

  return fetch("http://localhost:8080/intakes", {
    method: "POST",
    body: intakeData,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
}

function updateIntakeOnServer(intake) {
  var intakeData = "category=" + encodeURIComponent(intake.category);
  intakeData += "&food=" + encodeURIComponent(intake.food);
  intakeData += "&serving=" + encodeURIComponent(intake.serving);
  intakeData += "&calories=" + encodeURIComponent(intake.calories);

  return fetch("http://localhost:8080/intakes/" + intakeId, {
    method: "PUT",
    body: intakeData,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
}

function deleteIntakeFromServer(intakeId) {
  fetch("http://localhost:8080/intakes/" + intakeId, {
		method: "DELETE"
	});
}

// retrieve list of pizzas from server
// GET /pizzas
function getIntakeListFromServer() {
  return fetch("http://localhost:8080/intakes");
}

var app = new Vue({
  el: '#app',
  data: {
    intakeCategory: '',
    intakeFood: '',
    intakeServing: '',
    intakeCalories: '',
    intakes: [],
    activeColor: {
      color: 'red',
    },
    

    // UI state
    errorMessages: []
  },
  computed: {

  },
  methods: {
    validateIntake: function () {
      // this will validate the pizza inputs
      this.errorMessages = [];

      if (this.intakeCategory.length == 0) {
        this.errorMessages.push("Please specify a category.");
      }
      if (this.intakeFood.length == 0) {
        this.errorMessages.push("Please specify a food.");
      }
      if (this.intakeServing.length == 0) {
        this.errorMessages.push("Please specify a serving.");
      }
      if (this.intakeCalories.length == 0) {
        this.errorMessages.push("Please specify calories.");
      }

      return this.errorMessages == 0;
    },

    submitNewIntake: function () {
      if (!this.validateIntake()) {
        return;
      }

      createIntakeOnServer({
        category: this.intakeCategory,
        food: this.intakeFood,
        serving: this.intakeServing,
        calories: this.intakeCalories
      }).then((response) => {
        if (response.status == 201) {
          this.loadIntakes();
        } else {
          alert("Load intakes failed!");
        }
      });
      this.intakeCategory = "";
      this.intakeFood = "";
      this.intakeServing = "";
      this.intakeCalories = "";
    },
    loadIntakes: function () {
      getIntakeListFromServer().then((response) => {
        response.json().then((data) => {
          console.log("intakes loaded from server:", data);
          this.intakes = data;
        });
      });
    },
    updateIntake: function () {
      updateIntakeOnServer({
        category: this.intakeCategory,
        food: this.intakeFood,
        serving: this.intakeServing,
        calories: this.intakeCalories
      }).then((response) => {
        if (response.status == 200) {
          this.loadIntakes();
        } else {
          alert("Load intakes failed!");
        }
      });
      this.intakeCategory = "";
      this.intakeFood = "";
      this.intakeServing = "";
      this.intakeCalories = "";
    },
    editIntake: function (intake) {
      this.intakeCategory = intake.category;
      this.intakeFood = intake.food;
      this.intakeServing = intake.serving;
      this.intakeCalories = intake.calories;
      console.log("we want to edit this intake:", intake);
    },
    removeIntake: function (intake) {
      deleteIntakeFromServer().then(response =>
        response.json().then(json => {
          return json;
        })
      );
      console.log("we want to remove this intake:", intake);
    }
  },
  created: function () {
    this.loadIntakes();
  }
});


