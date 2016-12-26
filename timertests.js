var count = 0;
var start = Date.now();
var freq  = 500;

// var timer = setInterval(()=>{
//
//   count++;
//   console.log(count);
//
// },1000/freq);
//
// setTimeout(()=>{
//   clearInterval(timer);
//   const time = (Date.now() - start)/1000;
//   console.log('time: ' + time);
//   console.log('samples: ' + count);
//   console.log('frequency: ' + count/time);
// },1000)

var NanoTimer = require('nanotimer');
var nanoTimer = new NanoTimer();

function countUp() {
  count++;
  console.log(count);

  if (count >= 10000) {
    nanoTimer.clearInterval();

    const time = (Date.now() - start)/1000;
    console.log('time: ' + time);
    console.log('samples: ' + count);
    console.log('frequency: ' + count/time);
  }
}

nanoTimer.setInterval(countUp,'','0.1m', function(){
  console.log('callback');
});
