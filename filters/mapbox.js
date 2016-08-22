var mapboxId = require('../env').get('MAPBOX_ID');
if (!mapboxId)
  console.log('Missing env: MAPBOX_ID');

module.exports = (req,res,next) => {
  var dest = req.originalUrl;
  if (!/mapbox/.test(dest))
    return next();

  var params = require('querystring').parse(String(/\?.*/.exec(dest)[0]).replace('?',''));

  dest = 'https://'+params.s+'.tiles.mapbox.com/v3/'+mapboxId+'/'+
    params.z+'/'+params.x+'/'+params.y+'.png';

  req.url = '/'+encodeURIComponent(dest);

  next();
};
