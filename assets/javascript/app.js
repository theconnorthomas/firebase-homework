var database = firebase.database();

// Initial Values
var name = "";
var dest = "";
var firstDepart = 0;
var freq = 0;
var nextArrival = 0;
var minAway = 0;

// Capture Button Click
$("#add-train").on("click", function (event) {
  // Don't refresh the page!
  event.preventDefault();

  //pass the user inputs to the global vars
  name = $("#trainName-input").val().trim();
  dest = $("#destination-input").val().trim();
  firstDepart = moment($("#firstTrain-input").val().trim(), "HH:mm").format("X");
  freq = $("#frequency-input").val().trim();

  //Converts time inputs. 
  var remainder = moment().diff(moment.unix(firstDepart), "minutes") % freq;
  minAway = freq - remainder;
  nextArrival = moment().add(minAway, "m").format("hh:mm A");

  //use firebase's .push() to add user inputs to a new child of the database.
  database.ref().push({

    name: name,
    dest: dest,
    firstDepart: firstDepart,
    freq: freq,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  });

});

//Clears text fields
$("#clear-input").on("click", function (event) {

  var form = $(this).closest("form");

  form.find("input[type=text], input[type=number],").val("");

  return false;
});

//function to take user inputs that were stored on firebase and add them to the DOM.
database.ref().on("child_added", function (childSnapshot) {

  //Made a var to replace childSnapshot.val() so code is more readable.
  var childSnap = childSnapshot.val();

  // Change the HTML to reflect
  $(".table").find("tbody").prepend([
    "<tr>",
    "<td></td>",
    "<td>" + childSnap.name + "</td>",
    "<td>" + childSnap.dest + "</td>",
    "<td>" + childSnap.freq + "</td>",
    "<td>" + nextArrival + "</td>",
    "<td>" + minAway + "</td>",
    "</tr>"
  ].join(""));

  // Handles any errors
}, function (errorObject) {
  console.log("Errors handled: " + errorObject.code);
});
