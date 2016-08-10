var util = require('util')
var child_process = require('child_process');

var userArgs = process.argv.slice(2);

var searchTerm = userArgs[0];
var prodServer = userArgs[1];


var searchQuery = "ssh prod1 'sudo ls -lt /mint/logs/topologies | grep " + searchTerm + "'";

/**
 * Create bash commands
 * @type {String}
 */

if (prodServer == "prod1") {
  var unableToConnectToRedisQuery = "ssh prod1 'sudo cat /mint/logs/topologies/" + searchTerm + " | grep -c \"Unable to connect to Redis\"'";
  var pricesPulled = "ssh prod1 'sudo cat /mint/logs/topologies/" + searchTerm + " | grep -c \"message.*price\"'"; 
  var ioException = "ssh prod1 'sudo cat /mint/logs/topologies/" + searchTerm + " | grep -c \"O exception\"'"; 
  var cantDoRequestWithoutProxy = "ssh prod1 'sudo cat /mint/logs/topologies/" + searchTerm + " | grep -c \"Can not do request without proxy\"'"; 
  var unableToGetPhantomJS = "ssh prod1 'sudo cat /mint/logs/topologies/" + searchTerm + " | grep -c \"Unable to get PhantomJS\"'"; 
  var errorCommunicatingWithRemoteBrowser = "ssh prod1 'sudo cat /mint/logs/topologies/" + searchTerm + " | grep -c \"Error communicating with the remote browser\"'"; 
  var httpStatus400 = "ssh prod1 'sudo cat /mint/logs/topologies/" + searchTerm + " | grep -c \"Http status returned: 400\"'"; 
  child_process.exec(pricesPulled, ["-m"], (err, stdout, stderr) => {
    if (stdout == 0) {
      console.log('Prices pulled: 0');
      return;
    } else if (err) {
      console.error(err, stderr);
      return;
    }
    process.stdout.write('Prices pulled: ' + stdout);
  });

  child_process.exec(unableToConnectToRedisQuery, ["-m"], (err, stdout, stderr) => {
    if (stdout == 0) {
      console.log('Unable to connect to Redis: 0');
      return;
    } else if (err) {
      console.error(err, stderr);
      return;
    }
    process.stdout.write('Unable to connect to Redis: ' + stdout);
  });

  child_process.exec(ioException, ["-m"], (err, stdout, stderr) => {
    if (stdout == 0) {
      console.log('I/O exception: 0');
      return;
    } else if (err) {
      console.error(err, stderr);
      return;
    }
    process.stdout.write('I/O exception: ' + stdout);
  });

  child_process.exec(cantDoRequestWithoutProxy, ["-m"], (err, stdout, stderr) => {
    if (stdout == 0) {
      console.log('Can not do request without proxy: 0');
      return;
    } else if (err) {
      console.error(err, stderr);
      return;
    }
    process.stdout.write('Can not do request without proxy: ' + stdout);
  });

  child_process.exec(errorCommunicatingWithRemoteBrowser, ["-m"], (err, stdout, stderr) => {
    if (stdout == 0) {
      console.log('Error communicating with the remote browser: 0');
      return;
    } else if (err) {
      console.error(err, stderr);
      return;
    }
    process.stdout.write('Error communicating with the remote browser: ' + stdout);
  });

  child_process.exec(httpStatus400, ["-m"], (err, stdout, stderr) => {
    if (stdout == 0) {
      console.log('HTTP Status 400: 0');
      return;
    } else if (err) {
      console.error(err, stderr);
      return;
    }
    process.stdout.write('HTTP Status 400: ' + stdout);
  });
} else if (prodServer == "prod2") {
  var unableToConnectToRedisQuery = "ssh prod2 'sudo cat /mint/logs/topologies/" + searchTerm + " | grep -c \"Unable to connect to Redis\"'";
  var pricesPulled = "ssh prod2 'sudo cat /mint/logs/topologies/" + searchTerm + " | grep -c \"message.*price\"'"; 
  var ioException = "ssh prod2 'sudo cat /mint/logs/topologies/" + searchTerm + " | grep -c \"O exception\"'"; 
  var cantDoRequestWithoutProxy = "ssh prod2 'sudo cat /mint/logs/topologies/" + searchTerm + " | grep -c \"Can not do request without proxy\"'"; 
  var unableToGetPhantomJS = "ssh prod2 'sudo cat /mint/logs/topologies/" + searchTerm + " | grep -c \"Unable to get PhantomJS\"'"; 
  var errorCommunicatingWithRemoteBrowser = "ssh prod2 'sudo cat /mint/logs/topologies/" + searchTerm + " | grep -c \"Error communicating with the remote browser\"'"; 
  child_process.exec(pricesPulled, ["-m"], (err, stdout, stderr) => {
    if (stdout == 0) {
      console.log('Prices pulled: 0');
      return;
    } else if (err) {
      console.error(err, stderr);
      return;
    }
    process.stdout.write('Prices pulled: ' + stdout);
  });

  child_process.exec(unableToConnectToRedisQuery, ["-m"], (err, stdout, stderr) => {
    if (stdout == 0) {
      console.log('Unable to connect to Redis: 0');
      return;
    } else if (err) {
      console.error(err, stderr);
      return;
    }
    process.stdout.write('Unable to connect to Redis: ' + stdout);
  });

  child_process.exec(ioException, ["-m"], (err, stdout, stderr) => {
    if (stdout == 0) {
      console.log('I/O exception: 0');
      return;
    } else if (err) {
      console.error(err, stderr);
      return;
    }
    process.stdout.write('I/O exception: ' + stdout);
  });

  child_process.exec(cantDoRequestWithoutProxy, ["-m"], (err, stdout, stderr) => {
    if (stdout == 0) {
      console.log('Can not do request without proxy: 0');
      return;
    } else if (err) {
      console.error(err, stderr);
      return;
    }
    process.stdout.write('Can not do request without proxy: ' + stdout);
  });

  child_process.exec(unableToGetPhantomJS, ["-m"], (err, stdout, stderr) => {
    if (stdout == 0) {
      console.log('Unable to get PhantomJS: 0');
      return;
    } else if (err) {
      console.error(err, stderr);
      return;
    }
    process.stdout.write('Unable to get PhantomJS: ' + stdout);
  });

  child_process.exec(errorCommunicatingWithRemoteBrowser, ["-m"], (err, stdout, stderr) => {
    if (stdout == 0) {
      console.log('Error communicating with the remote browser: 0');
      return;
    } else if (err) {
      console.error(err, stderr);
      return;
    }
    process.stdout.write('Error communicating with the remote browser: ' + stdout);
  });
}


