var env = require('./env');

var app = require('express')();

var rollbar = require('./lib/rollbar');
if (rollbar.useRollbar) app.use(rollbar.rollbar.errorHandler());
app.use(require('body-parser').json());
app.use(require('hpp')());

//app.use(require('express-jwt')({ secret: env.get('jwt-secret') }));

app.use(require('./filters'));

app.use('/:dest', require('./lib/proxy'));

var port = env.get('PORT')||5555;
app.listen(port, () => console.log('http://localhost:'+port));
