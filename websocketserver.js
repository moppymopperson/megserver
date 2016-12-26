var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 8080;
var NanoTimer = require('nanotimer');

// When a user visits the website
app.get('/', function(req, res){
  res.send('moppy megserver');
});

// This is called when a client connects
io.on('connection', function(socket){
  console.log('connected client');
  client = socket;
  startTimer();

  // Make the session timeout after 10s automatically
  const sessionTimeout = 3;
  setTimeout(function(){
    timer.clearInterval();
    endSession();
  }, sessionTimeout*1000);
});

// Log the session statistics when the user disconnects
io.on('disconnect', function(socket){
  console.log('user disconnected!')
  endSession();
});

http.listen(port, function(){
  console.log('begin listening for connections');
});

// Define variables
var client;                   // The iPhone app
var timer = new NanoTimer();  // Used to time sending new samples
var numberChannels = 10;      // The number of channels to simulate
var startTime = Date.now();   // Used to get time t for sine waves
var frequency = 30;           // The frequency to send samples at
var samplesSent = 0;          // The number of samples sent so far

// Generate Random Data at regular intervals
function startTimer() {

  // Mark the time when the signals begin
  startTime   = Date.now();
  samplesSent = 0;

  timer.setInterval(function(){

    // Time t for calculating this set of samples
    const t = (Date.now() - startTime)/1000;

    // An array of measurements
    // Sine waves for now
    var measurements = Array(numberChannels);
    for(var i = 0; i < numberChannels; i++) {
      measurements[i] = Math.sin(2*Math.PI*5*t - i*(Math.PI/numberChannels)) + 0.25*Math.sin(2*Math.PI*3*t)
      + Math.random()*0.1;
    }

    // Create a JavaScript object of data
    var data = {
      "data":measurements
    };

    // Convert to a UTF8 JSON string
    var stringy = JSON.stringify(data);

    // Send the measurenemts out to all of the clients
    io.emit('data', stringy);
    samplesSent += 1;

  // How often the timer fires is set to the sampling interval in ms
  }, '', 1000/frequency + 'm');
}


// Log the session statistics and disconnect the client
function endSession() {
  console.log('Session Statistics')

  const t = (Date.now() - startTime)/1000;
  console.log('time: ' + t + 's');
  console.log('samples: ' + samplesSent);
  console.log('freq: ' + samplesSent/t + '\n');

  client.disconnect();
}
