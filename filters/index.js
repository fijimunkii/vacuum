var glob = require('glob');
var app = require('express').Router();

var files = glob.sync(__dirname+'/!(index).js');
console.log('Enabed filters: '+files.map(d => require('path').basename(d)).join(', '));
files.forEach(file => app.use(require(file)));

module.exports = app;
