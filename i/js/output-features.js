var fs = require('fs');
var walk = function(dir, done) {
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function(file) {
      file = dir + '/' + file;
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          results.push(file);
          if (!--pending) done(null, results);
        }
      });
    });
  });
};

walk(__dirname + '/modernizr-git/src', function(err, resultsSrc) {
  if (err) throw err;
  walk(__dirname + '/modernizr-git/feature-detects', function(err, resultsFd) {
    if (err) throw err;
    var lenFd = (__dirname + '/modernizr-git/feature-detects/').length;
    var output = {};

    output['feature-detects'] = resultsFd.map(function (x){
      return x.substr(lenFd).replace(/\.js$/, '');
    });
    var lenSrc = (__dirname + '/modernizr-git/src/').length;
    output['options'] = resultsSrc.map(function (x){
      return x.substr(lenSrc).replace(/\.js$/, '');
    });

    console.log(JSON.stringify(output));
  });
});
