var mapboxId = require('../env').get('MAPBOX_ID');
if (!mapboxId)
  console.log('Missing env: MAPBOX_ID');

module.exports = (req,res,next) => {
  var dest = decodeURIComponent(req.params.dest);
  if (!/maptiles/.test(dest))
    return next();

  var url = require('url');
  var params = require('querystring').parse(url.parse(dest).query);

  dest = 'https://'+params.s+'.tiles.mapbox.com/v3/'+mapboxId+'/'+
    params.z+'/'+params.x+'/'+params.y+'.png';

  req.params.dest = encodeURIComponent(dest);

  next();
};
