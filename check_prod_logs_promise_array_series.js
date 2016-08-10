var util = require('util')
var child_process = require('child_process');
var bluebird = require('bluebird');
var fs = require('fs');
var json2csv = require('json2csv');
var parse = require('csv-parse');
var userArgs = process.argv.slice(2);
var sleep = require('sleep');
var async = require('async');

var userArgs = process.argv.slice(2);
console.log(userArgs);
var searchTerms = ['inyopools.com_unltd', 'hinta.fi_verkkokauppa', 'petco.com_petsmart']
var fields = ["searchTerm", "prodServer", "pricesPulled", "unableToConnectToRedis", "ioException", "cantDoRequestWithoutProxy", "errorCommunicatingWithRemoteBrowser", "httpStatus400", "httpStatus407", "unableToGetPhantomJS", "totalOutputMessages", "pageContainsCaptcha", "failEmit", "interactionFailedDuringExecution", "cssSelectorWasNotFound"];
var searchResultProcessed = '';


var _findWhichServer = (searchTerm, cb) => {
  var searchQueryProd1 = "ssh prod1 'sudo ls -lt /mint/logs/topologies | grep \"\\s" + searchTerm + "\"'";
  var searchQueryProd2 = "ssh prod2 'sudo ls -lt /mint/logs/topologies | grep \"\\s" + searchTerm + "\"'";
  var searchQueryProd3 = "ssh prod3 'sudo ls -lt /mint/logs/topologies | grep \"\\s" + searchTerm + "\"'";
   child_process.exec(searchQueryProd1, (error, stdout, stderr) => {
    var stdout = stdout.trim();
    if (stdout == 0){
      console.log("No results in prod1, checking prod3");
      child_process.exec(searchQueryProd3, (error, stdout, stderr) => {
        var stdout = stdout.trim();
        if (stdout == 0){
          console.log("No results in prod3, checking prod2"); // check prod3 before prod2 because it has more recent logs than prod2
          child_process.exec(searchQueryProd2, (error, stdout, stderr) => {
            var stdout = stdout.trim();
            if (stdout == 0) {
              console.log("That scraper isn\'t in either server...");
            } else {
              console.log('The log file is in prod2.');
              _scanLogFile("prod2", stdout, searchTerm, cb);
            }
          })
        } else {
          console.log("The log file is in prod3.");
          _scanLogFile("prod3", stdout, searchTerm);
        }
      });
    } else {
      console.log("The log file is in prod1.");
      _scanLogFile("prod1", stdout, searchTerm);
    }
  });
}
var jsonOutputAggregate = [];
var _scanLogFile = (prodServer, stdout, searchTerm) => {
  searchResultRaw = stdout;
  // get the latest log file
  var re = new RegExp(searchTerm + ".*", "i");
  searchResultProcessed = re.exec(searchResultRaw)[0];

  // get the last scrape date
  var timeRe = new RegExp("\\w{3}\\s{2,10}\\d.*" + searchTerm, "i");
  lastScrapedTime = timeRe.exec(searchResultRaw)[0].replace(searchTerm,'UTC');
  //Server time: Thu Jul  7 21:32:24 UTC 2016
  //Scrape time: Jul  7 21:30

  console.log('Latest matching log file: ' + searchResultProcessed);
  console.log('The last scrape time was: ' + lastScrapedTime);
  var q = new QUERIES(prodServer, searchResultProcessed);
  var jsonOutput = {searchTerm, prodServer};
  sleep.sleep(10);
  pricesPulledPromise(q, jsonOutput)
  .then(() => unableToConnectToRedisPromise(q, jsonOutput))
  .then(() => ioExceptionPromise(q, jsonOutput))
  .then(() => cantDoRequestWithoutProxyPromise(q, jsonOutput))
  .then(() => errorCommunicatingWithRemoteBrowserPromise(q, jsonOutput))
  .then(() => httpStatus400Promise(q, jsonOutput))
  .then(() => httpStatus407Promise(q, jsonOutput))
  .then(() => unableToGetPhantomJSPromise(q, jsonOutput))
  .then(() => totalOutputMessagesPromise(q, jsonOutput))
  .then(() => pageContainsCaptchaPromise(q, jsonOutput))
  .then(() => failEmitPromise(q, jsonOutput))
  .then(() => interactionFailedDuringExecutionPromise(q, jsonOutput))
  .then(() => cssSelectorWasNotFoundPromise(q, jsonOutput))
  .then(() => {
    console.log(jsonOutput);
    jsonOutputAggregate.push(jsonOutput);
    // fs.writeFile("scraperLogs.json", jsonOutputAggregate, function(err) {
    //   if(err) { return console.log(err);}
    // });
    json2csv({ data: jsonOutputAggregate, fields: fields }, function(err, csv) {
      if (err) console.log(err);
      fs.writeFile('file.csv', csv, function(err) {
        if (err) throw err;
        console.log('file saved');
        console.log(csv);
      });
    });
    cb(null);
  })
  .catch(function(error) {
    console.log("failed:", error);
  });
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

function pricesPulledPromise(q, jsonOutput) {
  return new Promise(function(resolve, reject) {
      child_process.exec(q.pricesPulled, ["-m"], (err, stdout, stderr) => {
        var stdout = stdout.trim();
        if (stdout === '0') {
          console.log('Prices pulled: 0');
          jsonOutput.pricesPulled = 0;
          return resolve(0);
        } else if (err) {
          console.error(err, stderr);
          return reject(Error(err));
        }
        process.stdout.write('Prices pulled: ' + stdout);
        jsonOutput.pricesPulled = stdout;
        return resolve(stdout);
      });
  });
}

function unableToConnectToRedisPromise(q, jsonOutput) {
  return new Promise(function(resolve, reject) {
      child_process.exec(q.unableToConnectToRedisQuery, ["-m"], (err, stdout, stderr) => {
        var stdout = stdout.trim();
        if (stdout === '0') {
          console.log('Unable to connect to Redis: 0');
          jsonOutput.unableToConnectToRedis = 0;
          return resolve(0);
        } else if (err) {
          console.error(err, stderr);
          return reject(Error(err));
        }
        process.stdout.write('Unable to connect to Redis: ' + stdout);
        jsonOutput.unableToConnectToRedis = stdout;
        return resolve(stdout);
      });
  });
}

function ioExceptionPromise(q, jsonOutput) {
  return new Promise(function(resolve, reject) {
    child_process.exec(q.ioException, ["-m"], (err, stdout, stderr) => {
      var stdout = stdout.trim();
      if (stdout === '0') {
        console.log('I/O exception: 0');
        jsonOutput.ioException = 0;
        return resolve(0);
      } else if (err) {
        console.error(err, stderr);
        return reject(Error(err));
      }
      process.stdout.write('I/O exception: ' + stdout);
      jsonOutput.ioException = stdout;
      return resolve(stdout);
    });
  });
}


function cantDoRequestWithoutProxyPromise(q, jsonOutput) {
  return new Promise(function(resolve, reject) {
    child_process.exec(q.cantDoRequestWithoutProxy, ["-m"], (err, stdout, stderr) => {
      var stdout = stdout.trim();
      if (stdout === '0') {
        console.log('Can not do request without proxy: 0');
        jsonOutput.cantDoRequestWithoutProxy = 0;
        return resolve(0);
      } else if (err) {
        console.error(err, stderr);
        return reject(Error(err));
      }
      process.stdout.write('Can not do request without proxy: ' + stdout);
      jsonOutput.cantDoRequestWithoutProxy = stdout;
      return resolve(stdout);
    });
  });
}

function errorCommunicatingWithRemoteBrowserPromise(q, jsonOutput) {
  return new Promise(function(resolve, reject) {
    child_process.exec(q.errorCommunicatingWithRemoteBrowser, ["-m"], (err, stdout, stderr) => {
      var stdout = stdout.trim();
      if (stdout === '0') {
        console.log('Error communicating with the remote browser: 0');
        jsonOutput.errorCommunicatingWithRemoteBrowser = 0;
        return resolve(0);
      } else if (err) {
        console.error(err, stderr);
        return reject(Error(err));
      }
      process.stdout.write('Error communicating with the remote browser: ' + stdout);
      jsonOutput.errorCommunicatingWithRemoteBrowser = stdout;
      return resolve(stdout);
    });
  });
}

function httpStatus400Promise(q, jsonOutput) {
  return new Promise(function(resolve, reject) {
    child_process.exec(q.httpStatus400, ["-m"], (err, stdout, stderr) => {
      var stdout = stdout.trim();
      if (stdout.replace('\n','') === '0') {
        console.log('HTTP Status 400: 0');
        jsonOutput.httpStatus400 = 0;
        return resolve(0);
      } else if (err) {
        console.error(err, stderr);
        return reject(Error(err));
      }
      process.stdout.write('HTTP Status 400: ' + stdout);
      jsonOutput.httpStatus400 = stdout;
      return resolve(stdout);
    });
  });
}

function httpStatus407Promise(q, jsonOutput) {
  return new Promise(function(resolve, reject) {
    child_process.exec(q.httpStatus407, ["-m"], (err, stdout, stderr) => {
      var stdout = stdout.trim();
      if (stdout.replace('\n','') === '0') {
        console.log('HTTP Status 407: 0');
        jsonOutput.httpStatus407 = 0;
        return resolve(0);
      } else if (err) {
        console.error(err, stderr);
        return reject(Error(err));
      }
      process.stdout.write('HTTP Status 407: ' + stdout);
      jsonOutput.httpStatus407 = stdout;
      return resolve(stdout);
    });
  });
}

function unableToGetPhantomJSPromise(q, jsonOutput) {
  return new Promise(function(resolve, reject) {
    child_process.exec(q.unableToGetPhantomJS, ["-m"], (err, stdout, stderr) => {
      var stdout = stdout.trim();
      if (stdout.replace('\n','') === '0') {
        console.log('Unable to get PhantomJS: 0');
        jsonOutput.unableToGetPhantomJS = 0;
        return resolve(0);
      } else if (err) {
        console.error(err, stderr);
        return reject(Error(err));
      }
      process.stdout.write('Unable to get PhantomJS: ' + stdout);
      jsonOutput.unableToGetPhantomJS = stdout;
      return resolve(stdout);
    });
  });
}

function totalOutputMessagesPromise(q, jsonOutput) {
  return new Promise(function(resolve, reject) {
    child_process.exec(q.totalOutputMessages, ["-m"], (err, stdout, stderr) => {
      var stdout = stdout.trim();
      if (stdout.replace('\n','') === '0') {
        console.log('Total output messages: 0');
        jsonOutput.totalOutputMessages = 0;
        return resolve(0);
      } else if (err) {
        console.error(err, stderr);
        return reject(Error(err));
      }
      process.stdout.write('Total output messages: ' + stdout);
      jsonOutput.totalOutputMessages = stdout;
      return resolve(stdout);
    });
  });
}

function pageContainsCaptchaPromise(q, jsonOutput) {
  return new Promise(function(resolve, reject) {
    child_process.exec(q.pageContainsCaptcha, ["-m"], (err, stdout, stderr) => {
      var stdout = stdout.trim();
      if (stdout.replace('\n','') === '0') {
        console.log('Page content contains CAPTCHA: 0');
        jsonOutput.pageContainsCaptcha = 0;
        return resolve(0);
      } else if (err) {
        console.error(err, stderr);
        return reject(Error(err));
      }
      process.stdout.write('Page content contains CAPTCHA: ' + stdout);
      jsonOutput.pageContainsCaptcha = stdout;
      return resolve(stdout);
    });
  });
}

function failEmitPromise(q, jsonOutput) {
  return new Promise(function(resolve, reject) {
    child_process.exec(q.failEmit, ["-m"], (err, stdout, stderr) => {
      var stdout = stdout.trim();
      if (stdout.replace('\n','') === '0') {
        console.log('Fail emit...: 0');
        jsonOutput.failEmit = 0;
        return resolve(0);
      } else if (err) {
        console.error(err, stderr);
        return reject(Error(err));
      }
      process.stdout.write('Fail emit...: ' + stdout);
      jsonOutput.failEmit = stdout;
      return resolve(stdout);
    });
  });
}

function interactionFailedDuringExecutionPromise(q, jsonOutput) {
  return new Promise(function(resolve, reject) {
    child_process.exec(q.interactionFailedDuringExecution, ["-m"], (err, stdout, stderr) => {
      var stdout = stdout.trim();
      if (stdout.replace('\n','') === '0') {
        console.log('Interaction failed during execution: 0');
        jsonOutput.interactionFailedDuringExecution = 0;
        return resolve(0);
      } else if (err) {
        console.error(err, stderr);
        return reject(Error(err));
      }
      process.stdout.write('Interaction failed during execution: ' + stdout);
      jsonOutput.interactionFailedDuringExecution = stdout;
      return resolve(stdout);
    });
  });
}

function cssSelectorWasNotFoundPromise(q, jsonOutput) {
  return new Promise(function(resolve, reject) {
    child_process.exec(q.cssSelectorWasNotFound, ["-m"], (err, stdout, stderr) => {
      var stdout = stdout.trim();
      if (stdout.replace('\n','') === '0') {
        console.log('CSS selector was not found: 0');
        jsonOutput.cssSelectorWasNotFound = 0;
        return resolve(0);
      } else if (err) {
        console.error(err, stderr);
        return reject(Error(err));
      }
      process.stdout.write('CSS selector was not found: ' + stdout);
      jsonOutput.cssSelectorWasNotFound = stdout;
      return resolve(stdout);
    });
  });
}

var inputFile=userArgs[0];
var searchTerms = [];
var parser = parse({delimiter: ','}, function (err, data) {
  for (i = 0; i < data.length; i++) {
    searchTerms.push(data[i][0]);
  }
  console.log(searchTerms);
  // searchTerms.map((searchTerm) => {
  //   _findWhichServer(searchTerm);
  // });
  async.series(
    searchTerms.map(
      (val, idx) => (clb) => _findWhichServer(val, (error) => {console.log(error); clb(null, `cb_${idx}`); })
    ),
    (err, results) => { console.log(results)}
  );

  // async.series(searchTerms, function(searchTerm) {
  //   _findWhichServer(searchTerm);
  //   //cb();
  //   debugger
  // });
})
fs.createReadStream(inputFile).pipe(parser);

//searchTerms.map((searchTerm) => {_findWhichServer(searchTerm)});
