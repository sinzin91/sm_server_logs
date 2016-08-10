var util = require('util')
var exec = require('child_process').exec;
var searchResultRaw = '';


var userArgs = process.argv.slice(2);

var searchTerm = userArgs[0];
var prodServer = userArgs[1];

if (prodServer == "prod1") {
  var searchQuery = "ssh prod1 'sudo ls -lt /mint/logs/topologies | grep " + searchTerm + "'";
} else if (prodServer == "prod2") {
  var searchQuery = "ssh prod2 'sudo ls -lt /mint/logs/topologies | grep " + searchTerm + "'";
}

console.log(searchQuery);
var searchResult = exec(searchQuery, (error, stdout, stderr) => { 
  if (stdout == 0){
    console.log("No results");
  }
  searchResultRaw = stdout;
  console.log('Raw search result: ' + searchResultRaw);
  var re = new RegExp(searchTerm + ".*","i");
  var searchResultProcessed = re.exec(searchResultRaw)[0];
  console.log('Processed search result: ' + searchResultProcessed);
});