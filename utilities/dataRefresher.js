const exec = require('child_process').exec;

exec('rm -rf /data/settings');

console.log('Reset data.');