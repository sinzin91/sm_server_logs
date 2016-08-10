var util = require('util')
var child_process = require('child_process');

var userArgs = process.argv.slice(2);

var searchTerm = userArgs[0];

var searchTerms = ['inyopools.com_unltd', 'hinta.fi_verkkokauppa']

var searchResultProcessed = '';


/**
 * Create bash commands
 * @type {String}
 */
var _findWhichServer = (searchTerm) => {
  debugger
  var searchQueryProd1 = "ssh prod1 'sudo ls -lt /mint/logs/topologies | grep \"\\s" + searchTerm + "\"'";
  var searchQueryProd2 = "ssh prod2 'sudo ls -lt /mint/logs/topologies | grep \"\\s" + searchTerm + "\"'";
   child_process.exec(searchQueryProd1, (error, stdout, stderr) => {
    if (stdout == 0){
      console.log("No results in prod1, checking prod2");
      child_process.exec(searchQueryProd2, (error, stdout, stderr) => {
        if (stdout == 0){
          console.log("That scraper isn\'t in either server...");
        } else {
          console.log("The log file is in prod2.");
          _scanLogFileProd2("prod2", stdout);

        }
      });
    } else {
      console.log("The log file is in prod1.");
      _scanLogFileProd1("prod1", stdout, searchTerm);

    }
  });
}



var _scanLogFileProd1 = (prodServer, stdout, searchTerm) => {
    searchResultRaw = stdout;
    // get the latest log file
    var re = new RegExp(searchTerm + ".*", "i");
    debugger
    searchResultProcessed = re.exec(searchResultRaw)[0];

    // get the last scrape date
    var timeRe = new RegExp("\\w{3}\\s{2,10}\\d.*" + searchTerm, "i");
    debugger
    lastScrapedTime = timeRe.exec(searchResultRaw)[0].replace(searchTerm,'UTC');
    //Server time: Thu Jul  7 21:32:24 UTC 2016
    //Scrape time: Jul  7 21:30

    console.log('Latest matching log file: ' + searchResultProcessed);
    console.log('The last scrape time was: ' + lastScrapedTime);
    var q = new QUERIES(prodServer, searchResultProcessed);

    // var jsonOutput = {
    //   'pricesPulled': _pricesPulled(jsonOutput, q),
    //   'unableToConnectToRedisQuery':_unableToConnectToRedis(q),
      // _ioException(q);
      // _httpStatus400(q);
      // _httpStatus407(q);
      // _cantDoRequestWithoutProxy(q);
      // _errorCommunicatingWithRemoteBrowser(q);
      // _totalOutputMessages(q);
      // _pageContainsCaptcha(q);
      // _failEmit(q);
      // _cssSelectorWasNotFound(q);
    //}
    _pricesPulled(jsonOutput, q);
    _unableToConnectToRedis(jsonOutput, q);
    _ioException(jsonOutput, q);
    _httpStatus400(jsonOutput, q);
    _httpStatus407(jsonOutput, q);
    _cantDoRequestWithoutProxy(jsonOutput, q);
    _errorCommunicatingWithRemoteBrowser(jsonOutput, q);
    _totalOutputMessages(jsonOutput, q);
    _pageContainsCaptcha(jsonOutput, q);
    _failEmit(jsonOutput, q);
    _cssSelectorWasNotFound(jsonOutput, q);

    //console.log(jsonOutput);
}

var _scanLogFileProd2 = (prodServer, stdout) => {
    searchResultRaw = stdout;
    var re = new RegExp(searchTerm + ".*", "i");
    searchResultProcessed = re.exec(searchResultRaw)[0];

    // get the last scrape date
    var timeRe = new RegExp("\\w{3}\\s{2,10}\\d.*" + searchTerm, "i");
    lastScrapedTime = timeRe.exec(searchResultRaw)[0].replace(searchTerm,'UTC');

    console.log('Latest matching log file: ' + searchResultProcessed);
    console.log('The last scrape time was: ' + lastScrapedTime);
    console.log(searchResultProcessed);
    var q = new QUERIES(prodServer, searchResultProcessed);
    _pricesPulled(q);
    _unableToConnectToRedis(q);
    _ioException(q);
    _httpStatus400(q);
    _httpStatus407(q);
    _cantDoRequestWithoutProxy(q);
    _errorCommunicatingWithRemoteBrowser(q);
    _unableToGetPhantomJS(q);
    _totalOutputMessages(q);
    _pageContainsCaptcha(q);
    _failEmit(q);
    _interactionFailedDuringExecution(q);
    _cssSelectorWasNotFound(q);
}

function QUERIES(prodServer, searchResultProcessed) {
  this.unableToConnectToRedisQuery = "ssh " + prodServer + " 'sudo cat /mint/logs/topologies/" + searchResultProcessed + " | grep -c \"Unable to connect to Redis\"'",
  this.pricesPulled = "ssh " + prodServer + " 'sudo cat /mint/logs/topologies/" + searchResultProcessed + " | grep -c \"message.*price\"'",
  this.ioException = "ssh " + prodServer + " 'sudo cat /mint/logs/topologies/" + searchResultProcessed + " | grep -c \"O exception\"'",
  this.cantDoRequestWithoutProxy = "ssh " + prodServer + " 'sudo cat /mint/logs/topologies/" + searchResultProcessed + " | grep -c \"Can not do request without proxy\"'",
  this.unableToGetPhantomJS = "ssh " + prodServer + " 'sudo cat /mint/logs/topologies/" + searchResultProcessed + " | grep -c \"Unable to get PhantomJS\"'",
  this.errorCommunicatingWithRemoteBrowser = "ssh " + prodServer + " 'sudo cat /mint/logs/topologies/" + searchResultProcessed + " | grep -c \"Error communicating with the remote browser\"'",
  this.httpStatus400 = "ssh " + prodServer + " 'sudo cat /mint/logs/topologies/" + searchResultProcessed + " | grep -c \"Http status returned: 400\"'",
  this.httpStatus407 = "ssh " + prodServer + " 'sudo cat /mint/logs/topologies/" + searchResultProcessed + " | grep -c \"Http status returned: 407\"'",
  this.totalOutputMessages = "ssh " + prodServer + " 'sudo cat /mint/logs/topologies/" + searchResultProcessed + " | grep -c \"Sending output message\"'",
  this.pageContainsCaptcha = "ssh " + prodServer + " 'sudo cat /mint/logs/topologies/" + searchResultProcessed + " | grep -c \"Page content contains CAPTCHA\"'",
  this.failEmit = "ssh " + prodServer + " 'sudo cat /mint/logs/topologies/" + searchResultProcessed + " | grep -c \"Fail emit...\"'",
  this.interactionFailedDuringExecution = "ssh " + prodServer + " 'sudo cat /mint/logs/topologies/" + searchResultProcessed + " | grep -c \"Interaction failed during execution\"'",
  this.cssSelectorWasNotFound = "ssh " + prodServer + " 'sudo cat /mint/logs/topologies/" + searchResultProcessed + " | grep -c \"selector\"'"
}

var _pricesPulled = (jsonOutput, q) => {
  child_process.exec(q.pricesPulled, ["-m"], (err, stdout, stderr) => {
    if (stdout == 0) {
      console.log('Prices pulled: 0');
      return;
    } else if (err) {
      console.error(err, stderr);
      return;
    }
    process.stdout.write('Prices pulled: ' + stdout);
    jsonOutput.searchTerm.pricesPulled = stdout;
    //console.log(jsonOutput);
  });
}

var _unableToConnectToRedis = (jsonOutput, q) => {
  child_process.exec(q.unableToConnectToRedisQuery, ["-m"], (err, stdout, stderr) => {
    if (stdout == 0) {
      console.log('Unable to connect to Redis: 0');
      return;
    } else if (err) {
      console.error(err, stderr);
      return;
    }
    process.stdout.write('Unable to connect to Redis: ' + stdout);
    jsonOutput.searchTerm.unableToConnectToRedis = stdout.split(/\n/).shift();
    //console.log(jsonOutput);
  });
}

var _ioException = (jsonOutput, q) => {
  child_process.exec(q.ioException, ["-m"], (err, stdout, stderr) => {
    if (stdout == 0) {
      console.log('I/O exception: 0');
      return;
    } else if (err) {
      console.error(err, stderr);
      return;
    }
    process.stdout.write('I/O exception: ' + stdout);
    jsonOutput.searchTerm.ioException = stdout.split(/\n/).shift();
  });
}

var _cantDoRequestWithoutProxy = (jsonOutput, q) => {
  child_process.exec(q.cantDoRequestWithoutProxy, ["-m"], (err, stdout, stderr) => {
    if (stdout == 0) {
      console.log('Can not do request without proxy: 0');
      return;
    } else if (err) {
      console.error(err, stderr);
      return;
    }
    process.stdout.write('Can not do request without proxy: ' + stdout);
    jsonOutput.searchTerm.cantDoRequestWithoutProxy = stdout.split(/\n/).shift();
  });
}

var _errorCommunicatingWithRemoteBrowser = (jsonOutput, q) => {
  child_process.exec(q.errorCommunicatingWithRemoteBrowser, ["-m"], (err, stdout, stderr) => {
    if (stdout == 0) {
      console.log('Error communicating with the remote browser: 0');
      return;
    } else if (err) {
      console.error(err, stderr);
      return;
    }
    process.stdout.write('Error communicating with the remote browser: ' + stdout);
    jsonOutput.searchTerm.errorCommunicatingWithRemoteBrowser = stdout.split(/\n/).shift();
  });
}

var _httpStatus400 = (jsonOutput, q) => {
  child_process.exec(q.httpStatus400, ["-m"], (err, stdout, stderr) => {
    if (stdout == 0) {
      console.log('HTTP Status 400: 0');
      return;
    } else if (err) {
      console.error(err, stderr);
      return;
    }
    process.stdout.write('HTTP Status 400: ' + stdout);
    jsonOutput.searchTerm.httpStatus400 = stdout.split(/\n/).shift();
  });
}

var _httpStatus407 = (jsonOutput, q) => {
  child_process.exec(q.httpStatus407, ["-m"], (err, stdout, stderr) => {
    if (stdout == 0) {
      console.log('HTTP Status 407: 0');
      return;
    } else if (err) {
      console.error(err, stderr);
      return;
    }
    process.stdout.write('HTTP Status 407: ' + stdout);
    jsonOutput.searchTerm.httpStatus407 = stdout.split(/\n/).shift();
  });
}

var _unableToGetPhantomJS = (jsonOutput, q) => {
  child_process.exec(q.unableToGetPhantomJS, ["-m"], (err, stdout, stderr) => {
    if (stdout == 0) {
      console.log('Unable to get PhantomJS: 0');
      return;
    } else if (err) {
      console.error(err, stderr);
      return;
    }
    process.stdout.write('Unable to get PhantomJS: ' + stdout);
    jsonOutput.searchTerm.unableToGetPhantomJS = stdout.split(/\n/).shift();
  });
}

var _totalOutputMessages = (jsonOutput, q) => {
  child_process.exec(q.totalOutputMessages, ["-m"], (err, stdout, stderr) => {
    if (stdout == 0) {
      console.log('Total output messages: 0');
      return;
    } else if (err) {
      console.error(err, stderr);
      return;
    }
    process.stdout.write('Total output messages: ' + stdout);
    jsonOutput.searchTerm.totalOutputMessages = stdout.split(/\n/).shift();
  });
}

var _pageContainsCaptcha = (jsonOutput, q) => {
  child_process.exec(q.pageContainsCaptcha, ["-m"], (err, stdout, stderr) => {
    if (stdout == 0) {
      console.log('Page content contains CAPTCHA: 0');
      return;
    } else if (err) {
      console.error(err, stderr);
      return;
    }
    process.stdout.write('Page content contains CAPTCHA: ' + stdout);
    jsonOutput.searchTerm.pageContainsCaptcha = stdout.split(/\n/).shift();
  });
}

var _failEmit = (jsonOutput, q) => {
  child_process.exec(q.failEmit, ["-m"], (err, stdout, stderr) => {
    if (stdout == 0) {
      console.log('Fail emit...: 0');
      return;
    } else if (err) {
      console.error(err, stderr);
      return;
    }
    process.stdout.write('Fail emit...: ' + stdout);
    jsonOutput.searchTerm.failEmit = stdout.split(/\n/).shift();
  });
}

var _interactionFailedDuringExecution = (jsonOutput, q) => {
  child_process.exec(q.interactionFailedDuringExecution, ["-m"], (err, stdout, stderr) => {
    if (stdout == 0) {
      console.log('Interaction failed during execution: 0');
      return;
    } else if (err) {
      console.error(err, stderr);
      return;
    }
    process.stdout.write('Interaction failed during execution: ' + stdout);
    jsonOutput.searchTerm.interactionFailedDuringExecution = stdout.split(/\n/).shift();
  });
}

var _cssSelectorWasNotFound = (jsonOutput, q) => {
  child_process.exec(q.cssSelectorWasNotFound, ["-m"], (err, stdout, stderr) => {
    if (stdout == 0) {
      console.log('CSS selector was not found: 0');
      return;
    } else if (err) {
      console.error(err, stderr);
      return;
    }
    process.stdout.write('CSS selector was not found: ' + stdout);
    jsonOutput.searchTerm.cssSelectorWasNotFound = stdout.split(/\n/).shift();
  });
}
var jsonOutput = {searchTerm:{}};
for (i = 0; i < searchTerms.length; i++) {
  debugger
  //var searchTerm = searchTerms[i];
  _findWhichServer(searchTerms[i]);
  jsonOutput.searchTerm = searchTerms[i];
  setTimeout(() => console.log(jsonOutput), 9000);
}
