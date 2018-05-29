const exec = require('child_process').exec;

exec('rm -rf data');

console.log('Reset data.');