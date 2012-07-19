jQuery(function($){

  var scriptEl = $('script[src*="builderapp"]');

  var _currentBuildVersion = scriptEl.data('modver');
  var _yepnopeVersion = scriptEl.data('yepnopever');
  var _shivVersion = scriptEl.data('shivver');

  // var run = false;
  // $(':checkbox').attr('checked', true);

  // Add dynamic toggle buttons; should inverse current selection per group, not just toggle all on OR off only
  $("a.toggle-group").live('click', function() {
    var group = $(this).closest(".features");
    var checkbox = $(group).find(':checkbox');
    checkbox.each(function(){
      var $this = $(this), deps, i;
      $this.attr('checked', !$this.is(':checked'));

      // check ones that this relies on
      if ( $this.is(':checked') ) {
        deps = Modulizr._dependencies[ $this.closest('li').attr('id').replace('_','-') ];
        for( i in deps ) {
          $( '#' + deps[ i ] ).find('input:checkbox').attr('checked', 'checked');
        }
      }
      // uncheck ones that rely on this
      else {
        _( Modulizr._dependencies ).each(function( depArr, name ) {
          if ( _(depArr).contains( $this.closest('li').attr('id').replace('_','-') ) ) {
            $( '#' + name ).find('input:checkbox').removeAttr('checked');
          }
        });
      }
    });
    //event.preventDefault();
    // Always hide the build
    $('#modulizrize').html('');
    $("#generatedSource").removeClass('sourceView').val( '' );
    return false;
  });
  $("fieldset").not("#group-plugins, #group-extensibility").find("legend.wt").append('<a href="#" class="toggle-group">toggle</a>');

  $('li input:checkbox').change(function(){
    var $this = $(this), deps, i;
    // check ones that this relies on
    if ( $this.is(':checked') ) {
      deps = Modulizr._dependencies[ $this.closest('li').attr('id').replace('_','-') ] ||  Modulizr._dependencies[ $this.closest('li').attr('id') ];
      for( i in deps ) {
        $( '#' + deps[ i ] ).find('input:checkbox').attr('checked', 'checked');
      }
    }
    // uncheck ones that rely on this
    else {
      _( Modulizr._dependencies ).each(function( depArr, name ) {
        if ( _(depArr).contains( $this.closest('li').attr('id').replace('_','-') ) || _(depArr).contains( $this.closest('li').attr('id') ) ) {
          $( '#' + name ).find('input:checkbox').removeAttr('checked');
        }
      });
    }
    // Always hide the build
    $('#modulizrize').html('');
    $("#generatedSource").removeClass('sourceView').val( '' );
  });

  // Special hide/show stuff for custom css classes
  $('#cssclasses input:checkbox').change(function(){
    var checked =  $(this).is(':checked');
    $('#cssprefixcontainer').toggle(checked);
  });

  // Don't let people add two shivs
  $('#printshiv input:checkbox').change(function(){
    if ( $(this).is(':checked') ) {
      $('#shiv input:checkbox').removeAttr('checked');
    }
  });
  $('#shiv input:checkbox').change(function(){
    if ( $(this).is(':checked') ) {
      $('#printshiv input:checkbox').removeAttr('checked');
    }
  });

  $('#dontmin').change(function(){
    $('#generate').click();
  });
  // Generate the custom download
  $('#generate')
    .find('span').remove().end()
    .click(function(){
    // Get all the tests and enhancements
    var tests = [],
        mLoad =  $('#load input:checked').length,
        selections = true; // ALWAYS ON !!!!! $('#selectioncomment input:checked').length;

    // Preload iframe for client side download polyfill
    if(!Modernizr.download) {
      var iframe = document.createElement("iframe");

      iframe.src = "http://saveasbro.com/";
      iframe.setAttribute("style","position: absolute; visibility: hidden; left: -999em;");
      iframe.id = "saveasbro";
      document.body.appendChild(iframe);
    }

    $('.features input:checked').each(function(){
      // Special case for Modernizr.load and selection comment
      if ( this.value !== 'load' && this.value !== 'selectioncomment' ) {
        tests.push( this.value.replace('_', '-') );
      }
    });

    function fixUglifyBugs( modBuild ) {
      // !! needs to be there, unfortch.
      return modBuild.replace( "return a.history&&history.pushState", "return !!(a.history&&history.pushState)" );
    }

    function addExtras (modularBuild) {

      modularBuild = ';'+modularBuild+';';
      var prefixClass;

      if ( $('#cssclasses input').is(':checked') && $.trim( $('#cssprefix').val() ) ) {
        prefixClass = $('#cssprefix').val().replace(/\s+/g, "");
        // Normal Case
        var matches = modularBuild.match(/["']\ js\ ["']\s*\+\s*([a-zA-Z]+).join\(["'] ["']\)/);
        if ( matches && matches.length > 1 ) {
          // replace the class injector
          modularBuild = modularBuild.replace(
            /["']\ js\ ["']\s*\+\s*([a-zA-Z]+).join\(["'] ["']\)/,
            '" '+prefixClass+'js '+prefixClass+'"+'+matches[1]+'.join(" '+prefixClass+'")'
          );
        }
        // AddTest Case
        var matchesAT = modularBuild.match(/className\s*\+=\s*["']\s['"]/);
        if ( matchesAT && matchesAT.length ) {
          // replace the class injector
          modularBuild = modularBuild.replace(
            /className\s*\+=\s*["']\s['"]/,
            'className+=" '+prefixClass+'"'
          );
        }
      }

      if ( selections ) {
        if ( mLoad ) {
          tests.push('load');
        }
        modularBuild = "\/* Modernizr " + _currentBuildVersion + " (Custom Build) | MIT & BSD\n * Build: http://modernizr.com/download/#-"+
          _(tests).map(function(x){ return x.replace('-','_'); }).join('-') +
          ( prefixClass ? '-cssclassprefix:' + prefixClass.replace(/\-/g, '!') : '' ) +
          "\n */\n" + modularBuild;
      }

      return modularBuild;
    }

    function handleInjection(modularBuild) {
      var extra = '';
      if ( $('#cssclasses input').is(':checked') && $.trim( $('#cssprefix').val() ) ) {
        extra = '-cssclassprefix:'+$('#cssprefix').val().replace(/\s+/g, "").replace(/\-/g,'!');
      }
      window.location = '#-' + _(tests).map(function(x){ return x.replace('-', '_'); }).join('-') + extra;
      $("#generatedSource").addClass('sourceView').val( modularBuild );
    }

    function buildFile( modularBuild, appended ) {
      var uglifiedModularBuild = modularBuild + ( appended || '' );
      if ( ! $('#dontmin').is(':checked') ) {
        uglifiedModularBuild = uglify( uglifiedModularBuild, ['--extra', '--unsafe'] );
      }

      // Track the different builds
      if ( window._gaq ) {
        _gaq.push(['_trackPageview', '/build/'+[].slice.call($('ul li input:checked').map(function(key, val){ return ($(this).closest('li')[0].id || undefined); }), 0).join("^")]);
      }
      if ( window.GoSquared && window.GoSquared.DefaultTracker && window.GoSquared.DefaultTracker.TrackView ) {
        GoSquared.DefaultTracker.TrackView('/build/'+_currentBuildVersion+'/', 'Download: '+_currentBuildVersion);
      }

      uglifiedModularBuild = fixUglifyBugs( addExtras( uglifiedModularBuild ) );
      handleInjection(uglifiedModularBuild);

      // Client side file saving without flash!
      window.URL = window.webkitURL || window.URL;
      window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder ||
                           window.MozBlobBuilder;

      var a = document.querySelector('.btn2'),
          typer = document.querySelector('#generatedSource'),
          fileName = "modernizr.custom."+((+new Date) + "").substr(8),
          iframe = document.querySelector('#saveasbro');

      a.style.display = "none";

      if(Modernizr.download && Modernizr.bloburls && Modernizr.blobbuilder) {
        var bb = new BlobBuilder();
        bb.append(typer.value);

        a.download = fileName+".js";
        a.href = window.URL.createObjectURL(bb.getBlob("application/octet-stream"));
        a.style.display = "inline-block";

        a.onclick = function(e) {
          // Need a small delay for the revokeObjectURL to work properly.
          setTimeout(function() {
            window.URL.revokeObjectURL(a.href);
          }, 1500);
        };
      } else {
        iframe.contentWindow.postMessage(JSON.stringify({name:fileName, data: typer.value, formdata: Modernizr.formdata}),"http://saveasbro.com");

        window.onmessage = function(e) {
          e = e || window.event;

          var origin = e.origin || e.domain || e.uri;
          if(origin !== "http://saveasbro.com") return;
          a.href = "http://saveasbro.com/download/" + e.data;
          a.style.display = "inline-block";
        };
      }

      $('#buildArea').fadeIn();
    }

    function satisfyCustomDetects(cur, appended) {
        var finishCount = 0,
            finishResp = appended;
        function customFinish(resp){
          finishResp += resp;
          if ( --finishCount ) {
            return;
          }
          else {
            buildFile(cur,finishResp);
          }
        }
        // New section for logic for pulling in feature-detects from the feature-detects folder
        var comChecked = $('#community-feature-detects input:checked');
        finishCount = comChecked.length;
        if ( !finishCount ) {
          buildFile(cur, appended);
        }
        else {
          comChecked.each(function(){
            $.ajax({
              dataType: 'text',
              cache   : false,
              type    : 'GET',
              url     : '/i/js/modernizr-git/feature-detects/'+(this.value).replace(/_/g,'-')+'.js',
              success : function ( d ) {
                customFinish( d );
              }
            });
          });
        }
    }

    // Grab the modernizr source and run it through modulizr
    $.ajax({
      dataType: 'text',
      cache: false,
      type: 'GET',
      url: '/downloads/modernizr-latest.js',
      success:function(script) {
        // Call the modulr function to create a modular build
        var modularBuild = Modulizr.ize(script, [].slice.call(tests,0), function(){}),
            both, externals = {};

        function bothDone ( extName, extStr ) {
          externals[ extName ] = extStr;

          if ( both ) {
            satisfyCustomDetects( modularBuild, externals.printshiv + externals.load );
          }
          both = true;
        }

        if ( $('#load input:checked').length ) {
          $.ajax({
            dataType: 'text',
            cache   : false,
            type    : 'GET',
            url     : '/i/js/modernizr.load.' + _yepnopeVersion + '.js',
            success : function ( loader ) {
              //buildFile( modularBuild, loader );
              bothDone( 'load', loader );
            }
          });
        }
        else {
          bothDone( 'load', '' );
          //buildFile( modularBuild );
        }

        if ( $('#printshiv input:checked').length ) {
          $.ajax({
            dataType: 'text',
            cache   : false,
            type    : 'GET',
            url     : '/i/js/html5shiv-printshiv-' + _shivVersion + '.js',
            success : function ( printshiv ) {
              bothDone( 'printshiv', printshiv );
              //buildFile( modularBuild, respond );
            }
          });
        }
        else {
          bothDone( 'printshiv', '' );
        }
      }
    });
    return false;
  });

  // Check for preselections
  function loadFromHash () {
    var hash = window.location.hash;
    if ( hash.length > 1 ) {
      hash = hash.substr(1);
      var selections = hash.split('-');
      // Unselect everything
      $('input[type="checkbox"]').removeAttr('checked');
      for(var i in selections) {
        if ( selections[i].match( /cssclassprefix/ ) ) {
          var cssclassprefix = selections[i].substr(15).replace(/\!/g,'-');
          $('#cssprefix').val(cssclassprefix);
        }
        else if (selections[i] == 'dontmin'){
          $('#dontmin').attr('checked', 'checked');
        }
        else {
          $('input[value="'+selections[i]+'"]').attr('checked', 'checked');
        }
      }
      var checked = $('#cssclasses input:checkbox').is(':checked');
      $('#cssprefixcontainer').toggle(checked);

      $('#generate').click();
    }
  }
  loadFromHash();
});



/*! http://mths.be/details v0.0.4 by @mathias | includes http://mths.be/noselect v1.0.3 */
;(function(document, $) {

  var proto = $.fn,
      details,
      // :'(
      isOpera = Object.prototype.toString.call(window.opera) == '[object Opera]',
      // Feature test for native `<details>` support
      isDetailsSupported = (function(doc) {
        var el = doc.createElement('details'),
            fake,
            root,
            diff;
        if (!('open' in el)) {
          return false;
        }
        root = doc.body || (function() {
          var de = doc.documentElement;
          fake = true;
          return de.insertBefore(doc.createElement('body'), de.firstElementChild || de.firstChild);
        }());
        el.innerHTML = '<summary>a</summary>b';
        el.style.display = 'block';
        root.appendChild(el);
        diff = el.offsetHeight;
        el.open = true;
        diff = diff != el.offsetHeight;
        root.removeChild(el);
        if (fake) {
          root.parentNode.removeChild(root);
        }
        return diff;
      }(document)),
      toggleOpen = function($details, $detailsSummary, $detailsNotSummary, toggle) {
        var isOpen = typeof $details.attr('open') == 'string',
            close = isOpen && toggle || !isOpen && !toggle;
        if (close) {
          $details.removeClass('open').prop('open', false).triggerHandler('close.details');
          $detailsSummary.attr('aria-expanded', false);
          $detailsNotSummary.hide();
        } else {
          $details.addClass('open').prop('open', true).triggerHandler('open.details');
          $detailsSummary.attr('aria-expanded', true);
          $detailsNotSummary.show();
        }
      };

  /* http://mths.be/noselect v1.0.3 */
  proto.noSelect = function() {

    // Since the string 'none' is used three times, storing it in a variable gives better results after minification
    var none = 'none';

    // onselectstart and ondragstart for WebKit & IE
    // onmousedown for WebKit & Opera
    return this.bind('selectstart dragstart mousedown', function() {
      return false;
    }).css({
      'MozUserSelect': none,
      'msUserSelect': none,
      'webkitUserSelect': none,
      'userSelect': none
    });

  };

  // Execute the fallback only if there’s no native `details` support
  if (isDetailsSupported) {

    details = proto.details = function() {

      return this.each(function() {
        var $details = $(this),
            $summary = $('summary', $details);
        $summary.attr({
          'role': 'button',
          'aria-expanded': $details.prop('open')
        }).on('click', function() {
          // the value of the `open` property is the old value
          var close = $details.prop('open');
          $summary.attr('aria-expanded', !close);
          $details.triggerHandler((close ? 'close' : 'open') + '.details');
        });
      });

    };

    details.support = isDetailsSupported;

  } else {

    details = proto.details = function() {

      // Loop through all `details` elements
      return this.each(function() {

        // Store a reference to the current `details` element in a variable
        var $details = $(this),
            // Store a reference to the `summary` element of the current `details` element (if any) in a variable
            $detailsSummary = $('summary', $details),
            // Do the same for the info within the `details` element
            $detailsNotSummary = $details.children(':not(summary)'),
            // This will be used later to look for direct child text nodes
            $detailsNotSummaryContents = $details.contents(':not(summary)');

        // If there is no `summary` in the current `details` element…
        if (!$detailsSummary.length) {
          // …create one with default text
          $detailsSummary = $('<summary>').text('Details').prependTo($details);
        }

        // Look for direct child text nodes
        if ($detailsNotSummary.length != $detailsNotSummaryContents.length) {
          // Wrap child text nodes in a `span` element
          $detailsNotSummaryContents.filter(function() {
            // Only keep the node in the collection if it’s a text node containing more than only whitespace
            // http://www.whatwg.org/specs/web-apps/current-work/multipage/common-microsyntaxes.html#space-character
            return this.nodeType == 3 && /[^ \t\n\f\r]/.test(this.data);
          }).wrap('<span>');
          // There are now no direct child text nodes anymore — they’re wrapped in `span` elements
          $detailsNotSummary = $details.children(':not(summary)');
        }

        // Hide content unless there’s an `open` attribute
        toggleOpen($details, $detailsSummary, $detailsNotSummary);

        // Add `role=button` and set the `tabindex` of the `summary` element to `0` to make it keyboard accessible
        $detailsSummary.attr('role', 'button').noSelect().prop('tabIndex', 0).on('click', function() {
          // Focus on the `summary` element
          $detailsSummary.focus();
          // Toggle the `open` and `aria-expanded` attributes and the `open` property of the `details` element and display the additional info
          toggleOpen($details, $detailsSummary, $detailsNotSummary, true);
        }).keyup(function(event) {
          if (32 == event.keyCode && !isOpera || 13 == event.keyCode) {
            // Space or Enter is pressed — trigger the `click` event on the `summary` element
            // Opera already seems to trigger the `click` event when Enter is pressed
            event.preventDefault();
            $detailsSummary.click();
          }
        });

      });

    };

    details.support = isDetailsSupported;

  }

}(document, jQuery));



$(function() {
  $('html').addClass($.fn.details.support ? 'details' : 'no-details');
  $('details').details();
});

