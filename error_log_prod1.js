var util = require('util')
var child_process = require('child_process');

var userArgs = process.argv.slice(2);

var searchTerm = userArgs[0];

/**
 * Create bash commands
 * @type {String}
 */
var unableToConnectToRedisQuery = "ssh prod1 'sudo cat /mint/logs/topologies/" + searchTerm + " | grep -c \"Unable to connect to Redis\"'";
var pricesPulled = "ssh prod1 'sudo cat /mint/logs/topologies/" + searchTerm + " | grep -c \"message.*price\"'"; 
var tooManyOpenFiles = "ssh prod1 'sudo cat /mint/logs/topologies/" + searchTerm + " | grep -c \"O exception\"'"; 
var cantDoRequestWithoutProxy = "ssh prod1 'sudo cat /mint/logs/topologies/" + searchTerm + " | grep -c \"Can not do request without proxy\"'"; 
var errorCommunicatingWithRemoteBrowser = "ssh prod1 'sudo cat /mint/logs/topologies/" + searchTerm + " | grep -c \"Error communicating with the remote browser\"'"; 


child_process.exec(pricesPulled, ["-m"], (err, stdout, stderr) => {
  if (stdout == 0) {
    console.log('Prices pulled: no results');
    return;
  } else if (err) {
    console.error(err, stderr);
    return;
  }
  console.log('Prices pulled: ' + stdout);
});

child_process.exec(unableToConnectToRedisQuery, ["-m"], (err, stdout, stderr) => {
  if (stdout == 0) {
    console.log('Unable to connect to Redis: no results');
    return;
  } else if (err) {
    console.error(err, stderr);
    return;
  }
  console.log('Unable to connect to Redis: ' + stdout);
});

child_process.exec(tooManyOpenFiles, ["-m"], (err, stdout, stderr) => {
  if (stdout == 0) {
    console.log('I/O exception: no results');
    return;
  } else if (err) {
    console.error(err, stderr);
    return;
  }
  console.log('I/O exception: ' + stdout);
});

child_process.exec(cantDoRequestWithoutProxy, ["-m"], (err, stdout, stderr) => {
  if (stdout == 0) {
    console.log('Can not do request without proxy: no results');
    return;
  } else if (err) {
    console.error(err, stderr);
    return;
  }
  console.log('Can not do request without proxy: ' + stdout);
});

child_process.exec(errorCommunicatingWithRemoteBrowser, ["-m"], (err, stdout, stderr) => {
  if (stdout == 0) {
    console.log('Error communicating with the remote browser: no results');
    return;
  } else if (err) {
    console.error(err, stderr);
    return;
  }
  console.log('Error communicating with the remote browser: ' + stdout);
});

