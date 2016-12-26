// The TCP Server requires the net package
var net = require('net');
var NanoTimer = require('nanotimer');

// Setup Server
var server = net.createServer( function(socket) {

    // This is called when a client connects
    console.log('connected client');
    client = socket;
    startTimer();

    // Make the session timeout after 10s automatically
    const sessionTimeout = 3;
    setTimeout(function(){
      timer.clearInterval();
      endSession();
    }, sessionTimeout*1000);

    client.on('end', function(){
        console.log('client disconnected');
        clearInterval(timer);
        client = null;
    });
});

// Define variables
var client;                 // The iPhone app
var timer = new NanoTimer();// Used to time sending new samples
var numberChannels = 8 ;    // The number of channels to simulate
var startTime = Date.now(); // Used to get time t for sine waves
var frequency = 100;        // The frequency to send samples at

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
    client.write(stringy);
    client.write('\u0000');
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

  client.destroy();
}

// Don't forget to start the server now that we're all setup.
// The address and port will either be localhost on 8080 or
// defined by the environment variable in the case of Heroku.
server.listen(8080, '127.0.0.1');
console.log('Began listening for clients');
