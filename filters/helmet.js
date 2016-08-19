var express = require('express');
var app = express.Router();

var helmet = require('helmet');
app.use(helmet.frameguard());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.xssFilter());
app.use(helmet.contentSecurityPolicy({
  defaultSrc: ["'self'"],
  scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
  styleSrc: ["'self'", "'unsafe-inline'"],
  imgSrc: ["'self'", 'data:'],
  connectSrc: ["'self'"],
  fontSrc: ["'self'"],
  objectSrc: ["'self'"],
  mediaSrc: ["'self'"],
  frameSrc: ["'none'"],
  reportUri: '/api/csp-violation',
  reportOnly: false,
  setAllHeaders: false,
  disableAndroid: false, // disable if buggy
  browserSniff: true // false is faster but less comptible
}));

module.exports = app;
