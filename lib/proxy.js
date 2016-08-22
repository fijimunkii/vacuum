var url = require('url');
var env = require('../env');
module.exports = (req, res) => {
  var input = require('querystring').parse(url.parse(req.originalUrl).query);
  var maxLen = 10485760; // 10MB
  var domainTypes = env.get('domain-map') || {}; // whitelisted domains with fallback content-type
  var dest = decodeURIComponent(req.params.dest);
  dest = dest.replace(/^mapbox/,'');
  var domain = Object.keys(domainTypes).filter(d => (new RegExp(d)).test(dest))[0];
  if (!domain)
    return res.status(400).send('UNAUTHORIZED_URL');
  if (!url.parse(dest).hostname)
    return res.status(400).send('INVALID_URL');

  var filename = require('path').basename(url.parse(dest).pathname);
  var fileExtension = filename.split('.').length > 1 && filename.split('.').pop();
  // TODO: validate contentType (otherwise this throws)
  res.contentType(fileExtension ? require('mime-types').contentType(filename) : domainTypes[domain]);

  var len = 0;
  var r = require('request')(dest, err => console.log)
    .pipe(require('etl').map(d => {
      len += d.length;
      if (len > maxLen) {
        r.abort();
        reject('MAX_LENGTH');
      }
      return d;
    }))
    .on('log', console.log)
    .on('error', console.log)
    .pipe(res)
    .on('finish', res.end);
};
