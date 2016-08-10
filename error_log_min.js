var util = require('util')
var child_process = require('child_process');

var userArgs = process.argv.slice(2);

var searchTerm = userArgs[0];
var prodServer = userArgs[1];

var searchResultProcessed = '';


/**
 * Create bash commands
 * @type {String}
 */




var QUERIES = {
  searchQuery : "ssh " + prodServer + " 'sudo ls -lt /mint/logs/topologies | grep " + searchTerm + "'",
  unableToConnectToRedisQuery : "ssh " + prodServer + " 'sudo cat /mint/logs/topologies/" + searchTerm + " | grep -c \"Unable to connect to Redis\"'",
  pricesPulled : "ssh " + prodServer + " 'sudo cat /mint/logs/topologies/" + searchTerm + " | grep -c \"message.*price\"'", 
  ioException : "ssh " + prodServer + " 'sudo cat /mint/logs/topologies/" + searchTerm + " | grep -c \"O exception\"'", 
  cantDoRequestWithoutProxy : "ssh " + prodServer + " 'sudo cat /mint/logs/topologies/" + searchTerm + " | grep -c \"Can not do request without proxy\"'", 
  unableToGetPhantomJS : "ssh " + prodServer + " 'sudo cat /mint/logs/topologies/" + searchTerm + " | grep -c \"Unable to get PhantomJS\"'", 
  errorCommunicatingWithRemoteBrowser : "ssh " + prodServer + " 'sudo cat /mint/logs/topologies/" + searchTerm + " | grep -c \"Error communicating with the remote browser\"'", 
  httpStatus400 : "ssh " + prodServer + " 'sudo cat /mint/logs/topologies/" + searchTerm + " | grep -c \"Http status returned: 400\"'" 
}



var _searchResult = (callback) => {
  child_process.exec(QUERIES.searchQuery, (error, stdout, stderr) => { 
    if (stdout == 0){
      console.log("No results");
    }
    
    searchResultRaw = stdout;
    console.log('Raw search result: ' + searchResultRaw);
    var re = new RegExp(searchTerm + ".*","i");
    searchResultProcessed = re.exec(searchResultRaw)[0];
    console.log('Processed search result: ' + searchResultProcessed);
    
    if (prodServer == "prod1") {
      _pricesPulled();
      _unableToConnectToRedis();
      _ioException();
      _httpStatus400();
      _cantDoRequestWithoutProxy();
      _errorCommunicatingWithRemoteBrowser();
    } else if (prodServer == "prod2") {
      _pricesPulled();
      _unableToConnectToRedis();
      _ioException();
      _httpStatus400();
      _cantDoRequestWithoutProxy();
      _errorCommunicatingWithRemoteBrowser();
      _unableToGetPhantomJS();
    }
  });
}

if (prodServer == "prod1") {
  _searchResult();
}

var _pricesPulled = () => {
  child_process.exec(QUERIES.pricesPulled, ["-m"], (err, stdout, stderr) => {
    if (stdout == 0) {
      console.log('Prices pulled: 0');
      return;
    } else if (err) {
      console.error(err, stderr);
      return;
    }
    
    process.stdout.write('Prices pulled: ' + stdout);
  });
}

var _unableToConnectToRedis = () => {
  child_process.exec(QUERIES.unableToConnectToRedisQuery, ["-m"], (err, stdout, stderr) => {
    if (stdout == 0) {
      console.log('Unable to connect to Redis: 0');
      return;
    } else if (err) {
      console.error(err, stderr);
      return;
    }
    process.stdout.write('Unable to connect to Redis: ' + stdout);
  });
}

var _ioException = () => {
  child_process.exec(QUERIES.ioException, ["-m"], (err, stdout, stderr) => {
    if (stdout == 0) {
      console.log('I/O exception: 0');
      return;
    } else if (err) {
      console.error(err, stderr);
      return;
    }
    process.stdout.write('I/O exception: ' + stdout);
  });
}

var _cantDoRequestWithoutProxy = () => {
  child_process.exec(QUERIES.cantDoRequestWithoutProxy, ["-m"], (err, stdout, stderr) => {
    if (stdout == 0) {
      console.log('Can not do request without proxy: 0');
      return;
    } else if (err) {
      console.error(err, stderr);
      return;
    }
    process.stdout.write('Can not do request without proxy: ' + stdout);
  });
}

var _errorCommunicatingWithRemoteBrowser = () => {
  child_process.exec(QUERIES.errorCommunicatingWithRemoteBrowser, ["-m"], (err, stdout, stderr) => {
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

var _httpStatus400 = () => {
  child_process.exec(QUERIES.httpStatus400, ["-m"], (err, stdout, stderr) => {
    if (stdout == 0) {
      console.log('HTTP Status 400: 0');
      return;
    } else if (err) {
      console.error(err, stderr);
      return;
    }
    process.stdout.write('HTTP Status 400: ' + stdout);
  });
}

var _unableToGetPhantomJS = () => {
  child_process.exec(QUERIES.unableToGetPhantomJS, ["-m"], (err, stdout, stderr) => {
    if (stdout == 0) {
      console.log('Unable to get PhantomJS: 0');
      return;
    } else if (err) {
      console.error(err, stderr);
      return;
    }
    process.stdout.write('Unable to get PhantomJS: ' + stdout);
  });
}


// if (prodServer == "prod1") {
//   _searchResult();
//   _pricesPulled();
//   _unableToConnectToRedis();
//   _ioException();
//   _httpStatus400();
//   _cantDoRequestWithoutProxy();
//   _errorCommunicatingWithRemoteBrowser();
// } else if (prodServer == "prod2") {
//   _pricesPulled();
//   _unableToConnectToRedis();
//   _ioException();
//   _httpStatus400();
//   _cantDoRequestWithoutProxy();
//   _errorCommunicatingWithRemoteBrowser();
//   _unableToGetPhantomJS();
// }


