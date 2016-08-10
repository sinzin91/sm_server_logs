'use strict';
var util = require('util')
var child = require('child-process-promise');
var freeOut = [],
    freeOutLabel = [];

// moar concise
function puts(error, stdout, stderr) { 
  if (error) {
    console.error(error, stderr);
    return;
  }
  debugger
  freeOut.push(stdout);
  //console.log(freeOut);
  //extraArgs(error, stdout, stderr, freeOut, message);
  process.stdout.write(stdout);
};

function extraArgs(error, stdout, stderr, freeOut, message) {
  console.log(message + freeOut);
}

var userArgs = process.argv.slice(2);

var searchTerm = userArgs[0];
// var searchQuery = "ssh prod1 'sudo cat /mint/logs/topologies/" + searchTerm + " > log.txt 2>&1'";
// var downloadLogFile = "scp tenzin@designer01.wiser.com:/home/tenzin/log.txt .";

var unableToConnectToRedisQuery = "ssh prod1 'sudo cat /mint/logs/topologies/" + searchTerm + " | grep -c \"Unable to connect to Redis\"'";
var pricesPulled = "ssh prod1 'sudo cat /mint/logs/topologies/" + searchTerm + " | grep -c 'competitors.*price:''"; 
//var searchResult = exec(searchQuery, puts);
// var unableToConnectToRedis = exec(unableToConnectToRedisQuery, puts).on('end', function() {
//   var redisErrors = 
// });
//console.log(unableToConnectToRedisQuery);
// console.log(pricesPulled);
// setTimeout(function() {
//   console.log('Unable to connect to Redis: ' + freeOut[0]);
//   console.log('Prices pulled: ' + freeOut[1])
// }, 8000);


var cmds = [unableToConnectToRedisQuery, pricesPulled];

var exec = (cmd, cb) => {
    let child_process = require('child_process'),
        p = child_process.spawn(cmd)
    
    p.on('exit', (exitCode) => {
        let err = null;
        
        if (err) {
            // error occured
            console.log(err);
        }
        
        if (cb)cb(err);
    
    });
};
 var series = function(cmds, cb){
    let execNext = () => {
        exec(cmds.shift(), function(err){
            if (err) {
                cb(err);
            } else {
                if (cmds.length) execNext();
                else cb(null);
            }
        });
    };
    execNext();
};

series(cmds);



