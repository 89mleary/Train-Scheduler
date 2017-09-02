// Initialize Firebase
var config = {
	apiKey: "AIzaSyDlDZ5LISOuUN-yF2cCyeHqiS3AnFz6c58",
	authDomain: "train-scheduler-7f3ae.firebaseapp.com",
	databaseURL: "https://train-scheduler-7f3ae.firebaseio.com",
	projectId: "train-scheduler-7f3ae",
	storageBucket: "",
	messagingSenderId: "488237538163"
};

firebase.initializeApp(config);
var database = firebase.database();

$( document ).ready(function() {

	function calcNextArrival(firstTrain, freq) {

		var currentTime = moment().format("HH:mm");

		var timesArray = [];
		var currentIter = firstTrain;

		while (currentIter < currentTime && currentIter < "23:59") {

			var addedTime = moment(currentIter, "HH:mm").add(freq, 'm').format("HH:mm");
			timesArray.push(addedTime);
			currentIter = addedTime;

		};
		
		var nextTrain = timesArray[timesArray.length - 1];
		return nextTrain;

	};

	function calcMinsAway(nextTrain) {

		var currentTime = moment().format("HH:mm");
		var next = nextTrain;
		var subTime = (moment(next, "HH:mm").diff(moment(currentTime, "HH:mm")) / 60000);
		return subTime;

	};

	database.ref().on("child_added", function(snapshot) {
      // storing the snapshot.val() in a variable for convenience
      var sv = snapshot.val();

      var fbTrainName = sv.train;
      var fbDest = sv.destination;
      var fbFirstTrain = sv.firstTrain;
      var fbFreq = sv.frequency;
      // var monthsDiff = Math.abs(moment(fbDate).diff(moment(), "months"));
      var nextTrain = calcNextArrival(fbFirstTrain, fbFreq);
      var minsAway = calcMinsAway(nextTrain);

      var newTR = $("<tr><td>" + fbTrainName + "</td><td>" + fbDest + "</td><td>" + fbFreq + "</td><td>" + nextTrain + "</td><td>" + minsAway + "</td></td></tr>");


      $("#myTable").append(newTR);


    }, function(errorObject) {
      console.log("Errors handled: " + errorObject.code);
    });

    
	$("#submitButton").on("click", function() { 

		event.preventDefault();

	    var train = $("#trainName").val().trim();
     	var dest = $("#destination").val().trim();
      	var first = $("#firstTrain").val().trim();
      	var freq = $("#frequency").val().trim();

		database.ref().push({
	        train: train,
	        destination: dest,
	        firstTrain: first,
	    	frequency: freq,
	    	dateAdded: firebase.database.ServerValue.TIMESTAMP
	    });

		$("#trainName").val("");
     	$("#destination").val("");
      	$("#firstTrain").val("");
      	$("#frequency").val("");   

	});  // submit button end

});  // doc ready end