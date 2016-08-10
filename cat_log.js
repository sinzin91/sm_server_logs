var util = require('util')
var exec = require('child_process').exec;

// moar concise
function puts(error, stdout, stderr) { console.log(stdout) }

var userArgs = process.argv.slice(2);

var searchTerm = userArgs[0];
var searchQuery = "ssh prod1 'sudo cat /mint/logs/topologies/" + searchTerm + "'";
console.log(searchQuery);
var searchResult = exec(searchQuery, puts);