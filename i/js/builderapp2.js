  requirejs.config({
    paths : {
      'src' : '../i/js/modernizr-git/src'
    }
  });
// avoid some config
  define('underscore', function () { return _; });

  var buildButton = document.getElementById('generate');
  // Handle a build
  buildButton.onclick = function () {
    var config = JSON.stringify({
      "options": [
        "setClasses",
        "addTest",
        "html5printshiv",
        "load",
        "testProp",
        "fnBind"
      ],
      "feature-detects": [
        "test/a/download",
        "test/audio/audiodata"
      ]
    });
    try {
      config = JSON.parse(config);
    }
    catch(e) {
      alert('Bad config, yo');
      return;
    }

    require(['src/generate'], function( generate ) {
      window.modInit = generate(config);

      requirejs.optimize({
        "baseUrl" : "../i/js/modernizr-git/src/",
        "optimize"    : "none",
        "optimizeCss" : "none",
        "paths" : {
          "test" : "../../../../feature-detects",
        },
        "include" : ["modernizr-init"],
        wrap: {
          start: ";(function(window, document, undefined){",
          end: "})(this, document);"
        },
        onBuildWrite: function (id, path, contents) {
          if ((/define\(.*?\{/).test(contents)) {
            //Remove AMD ceremony for use without require.js or almond.js
            contents = contents.replace(/define\(.*?\{/, '');

            contents = contents.replace(/\}\);\s*?$/,'');

            if ( !contents.match(/Modernizr\.addTest\(/) && !contents.match(/Modernizr\.addAsyncTest\(/) ) {
              //remove last return statement and trailing })
              contents = contents.replace(/return.*[^return]*$/,'');
            }
          }
          else if ((/require\([^\{]*?\{/).test(contents)) {
            contents = contents.replace(/require[^\{]+\{/, '');
            contents = contents.replace(/\}\);\s*$/,'');
          }
          return contents;
        },
        out : function (output) {
          output = output.replace('define("modernizr-init", function(){});', '');
          //var outBox = document.getElementById('buildoutput');
          var outBoxMin = document.getElementById('generatedSource');
          //outBox.innerHTML = output;
          require({context: 'build'}, ['uglifyjs2'], function (u2){
            var UglifyJS = u2.UglifyJS;
            outBoxMin.innerHTML = '/*! Modernizr 3.0.0pre (Custom Build) | MIT */\n' + minify(UglifyJS, output, {});
          });

          // add in old hack for now, just so i don't forget
          //outBoxMin.innerHTML = uglify( output, ['--extra', '--unsafe'] ).replace( "return a.history&&history.pushState", "return !!(a.history&&history.pushState)" );
        }
      }, function (buildText) {
        console.log({ buildOutput: buildText });
      });
    });

  };

  function minify( UglifyJS, code, options) {
    options = UglifyJS.defaults(options, {
      outSourceMap : null,
      sourceRoot   : null,
      inSourceMap  : null,
      fromString   : false,
      warnings     : false
    });
    if (typeof files == "string") {
      files = [ files ];
    }

    // 1. parse
    var toplevel = UglifyJS.parse(code, {
      filename: 'modernizr-custombuild.min.js',
      toplevel: toplevel
    });

    // 2. compress
    toplevel.figure_out_scope();
    var sq = UglifyJS.Compressor({
      warnings: options.warnings,
      hoist_vars: true
    });
    toplevel = toplevel.transform(sq);

    // 3. mangle
    toplevel.figure_out_scope();
    toplevel.compute_char_frequency();
    toplevel.mangle_names({except: ['Modernizr']});

    // 4. output
    var stream = UglifyJS.OutputStream({});
    toplevel.print(stream);
    return stream.toString();
  }

