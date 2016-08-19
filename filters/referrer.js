var express = require('express');
var app = express.Router();

app.use((req,res,next) => {
  res.setHeader('Server', 'Apache/2.4.9 (OS/2)');
  next();
});

module.exports = app;
