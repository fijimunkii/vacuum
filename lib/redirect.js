// https://www.facebook.com/notes/facebook-engineering/protecting-privacy-with-referrers/392382738919/
var useragent = require('useragent');
module.exports.privateRouter = (req, res) => {
  res.removeHeader('Content-Security-Policy');
  res.removeHeader('Cookie');
  var dest = decodeURIComponent(req.params.dest);
  if (!require('url').parse(dest).hostname)
    return res.status(400).send('invalid url');
  var is = useragent.is(req.headers['user-agent']);
  res.writeHead(200, {'Content-Type': 'text/html'});
  if (!is.ie) // the easy way
    res.write('<html><body><script>document.location.replace("'+dest+'");</script></body></html>');
  else // ie, the hard way
    res.write('<html><head><script>function onloadHandler() {if(document.refreshForm.visited.value==""){document.refreshForm.visited.value=1;document.getElementById("a").click();}else if(parseInt(document.refreshForm.visited.value)%2==1){document.refreshForm.visited.value=parseInt(document.refreshForm.visited.value)+1;window.history.go(-1);}else{document.refreshForm.visited.value=parseInt(document.refreshForm.visited.value)+1;window.history.go(1);}}</script></head><body onload="onloadHandler();"><form name="refreshForm"><input type="hidden" name="visited" value="" /></form><a id="a" href="'+dest+'"></a></body></html>');
  res.end();
};

module.exports.publicRouter = (req, res, next) => {
  if (!req.session.user) {
    var dest = encodeURIComponent(req.protocol+'://'+req.get('host')+req.originalUrl);
    return res.redirect('/login?dest='+dest);
  }
  next();
};
