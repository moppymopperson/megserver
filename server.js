// The TCP Server requires the net package
var net = require('net');

// Define variables
var client;                 // The iPhone app
var timer;                  // Used to time sending new samples
var numberChannels = 3 ;    // The number of channels to simulate
var startTime = Date.now(); // Used to get time t for sine waves
var frequency = 50;         // The frequency to send samples at

// Setup Server
var server = net.createServer( function(socket) {

    // This is called when a client connects
    console.log('connected client');
    client = socket;
    startTimer();

    // When the client disconnects
    client.on('end', function(){
        console.log('client disconnected');
        clearInterval(timer);
        client = null;
    });
});

// Generate Random Data at regular intervals
function startTimer() {

  // Mark the time when the signals begin
  startTime = Date.now();

  // Keep a reference to the timer to turn it off later
  timer = setInterval(function(){

    // Time t for calculating this set of samples
    const t = (Date.now() - startTime)/1000;

    // An array of measurements
    // Sine waves for now
    var measurements = Array(numberChannels);
    for(var i = 0; i < numberChannels; i++) {
      measurements[i] = Math.sin(2*Math.PI*t - i*(Math.PI/numberChannels));
    }

    // Create a JavaScript object of data
    var data = {
      "data":measurements
    };

    // Convert to a UTF8 JSON string
    var stringy = JSON.stringify(data);

    // Send the measurenemts to the client
    // Each message is marked with an end character \0
    client.write(stringy);
    client.write('\0');

  // How often the timer fires is set to the sampling interval in ms
  }, 1000/frequency);
}

// Don't forget to start the server now that we're all setup.
// The address and port will either be localhost on 8080 or
// defined by the environment variable in the case of Heroku.
server.listen(8080, '127.0.0.1');
