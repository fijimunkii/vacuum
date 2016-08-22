var env = require('./env');

var app = require('express')();

var rollbar = require('./lib/rollbar');
if (rollbar.useRollbar) app.use(rollbar.rollbar.errorHandler());
app.use(require('body-parser').json());
app.use(require('hpp')());

if (env.get('jwt-secret'))
  app.use(require('express-jwt')({
    secret: env.get('jwt-secret'),
    getToken: function fromHeaderOrQuerystring(req) {
      if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer')
        return req.headers.authorization.split(' ')[1];
      else if (req.query && req.query.jwt)
        return req.query.jwt;
      return null;
    }
  }));

app.use('/:dest', require('./filters'));

app.use('/:dest', require('./lib/proxy'));

var port = env.get('PORT')||5555;
app.listen(port, () => console.log('http://localhost:'+port));
