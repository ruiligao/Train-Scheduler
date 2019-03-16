console.log("connected");
// Initialize Firebase
var config = {
  apiKey: "AIzaSyAWqH7czzoAe-HW6OXjfb_Lns9FIzUN31E",
  authDomain: "train-scheduler-29972.firebaseapp.com",
  databaseURL: "https://train-scheduler-29972.firebaseio.com",
  projectId: "train-scheduler-29972",
  storageBucket: "",
  messagingSenderId: "758540452159"
};
firebase.initializeApp(config);

var db = firebase.database();
// variable 


//click event
// push inputs to database
$("#submitButton").click(function (event) {
  console.log("clicked");
  event.preventDefault();

  var trainObject = getTrainInput();
  db.ref().push(trainObject);
});

function getTrainInput() {
  var name = $("#trainName").val();
  var destination = $("#destination").val();
  var trainTime = $("#firstTrainTime").val();
  var frequency = $("#frequency").val();
  var trainObject = { name, destination, trainTime, frequency };
  console.log(trainObject);
  return trainObject;
}

db.ref().on("value", function (snapshot) {
  console.log(snapshot.val());
  var trainInfo = snapshot.val();
  for (var i in trainInfo) {
    console.log(trainInfo[i]);

    var tRow = getRowObjFromTrainInfo(trainInfo[i]);
    $("tbody").append(tRow);
  };
});

function getRowObjFromTrainInfo(trainInfo) {
  var { name, destination, trainTime, frequency } = trainInfo;

  var currentTime = moment();
  console.log(currentTime);

  var ConvertedTrainTime = moment(trainTime, "HH:mm");
  console.log(ConvertedTrainTime);

  var minPassedSinceFirstTrain = currentTime.diff(ConvertedTrainTime, "minutes");
  var minTillNextTrain = frequency - minPassedSinceFirstTrain % frequency;
  var nextArrival = currentTime.add(minTillNextTrain, "minutes").format("HH:mm");

  var tRow = $("<tr>")
  var tdName = $("<td>").text(name);
  var tdDestination = $("<td>").text(destination);
  var tdFrequency = $("<td>").text(frequency);
  var tdNextArrival = $("<td>").text(nextArrival);
  var tdAway = $("<td>").text(minTillNextTrain);
  tRow.append(tdName, tdDestination, tdFrequency, tdNextArrival, tdAway);
  return tRow;
}

