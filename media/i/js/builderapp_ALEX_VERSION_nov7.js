jQuery(function($){
  var _currentBuildVersion = '2.0.6';

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
        deps = Modulizr._dependencies[ $this.closest('li').attr('id') ];
        for( i in deps ) {
          $( '#' + deps[ i ] ).find('input:checkbox').attr('checked', 'checked');
        }
      }
      // uncheck ones that rely on this
      else {
        _( Modulizr._dependencies ).each(function( depArr, name ) {
          if ( _(depArr).contains( $this.closest('li').attr('id') ) ) {
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
      deps = Modulizr._dependencies[ $this.closest('li').attr('id') ];
      for( i in deps ) {
        $( '#' + deps[ i ] ).find('input:checkbox').attr('checked', 'checked');
      }
    }
    // uncheck ones that rely on this
    else {
      _( Modulizr._dependencies ).each(function( depArr, name ) {
        if ( _(depArr).contains( $this.closest('li').attr('id') ) ) {
          $( '#' + name ).find('input:checkbox').removeAttr('checked');
        }
      });
    }
    // Always hide the build
    $('#modulizrize').html('');
    $("#generatedSource").removeClass('sourceView').val( '' );
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
        tests.push( this.value );
      }
    });

    function fixUglifyBugs( modBuild ) {
      // !! needs to be there, unfortch.
      return modBuild.replace( "return a.history&&history.pushState", "return !!(a.history&&history.pushState)" );
    }

    function addExtras (modularBuild) {

      modularBuild = ';'+modularBuild+';';
      if ( selections ) {
        if ( mLoad ) {
          tests.push('load');   
        } 
        modularBuild = "\/* Modernizr " + _currentBuildVersion + " (Custom Build) | MIT & BSD\n * Build: http://www.modernizr.com/download/#-" + tests.join('-') + "\n */\n" + modularBuild;
      }
      return modularBuild;
    }

    function handleInjection(modularBuild) {
      window.location = '#-' + tests.join('-'); // I killed it cuz it's always on now. + ( selections ? '-selectioncomment' : '' );
      $("#generatedSource").addClass('sourceView').val( modularBuild );
    }

    function buildFile( modularBuild, appended ) {
      var uglifiedModularBuild = uglify( modularBuild + ( appended || '' ), ['--extra', '--unsafe'] );

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
        comChecked.each(function(){
          $.ajax({
            dataType: 'text',
            cache   : false,
            type    : 'GET',
            url     : '/i/js/feature-detects/'+(this.value).replace(/_/g,'-')+'.js',
            success : function ( d ) {
              customFinish( d );
            }
          });
        });
    }

    // Grab the modernizr source and run it through modulizr
    $.ajax({
      dataType: 'text',
      cache: false,
      type: 'GET',
      url: '/i/js/modernizr.'+_currentBuildVersion+'-prebuild.js', //'/i/js/currentmod.js',//$('script[src*=modernizr]').attr('src'),
      success:function(script) {
        // Call the modulr function to create a modular build
        var modularBuild = Modulizr.ize(script, [].slice.call(tests,0), function(){}),
            both, externals = {};

        function bothDone ( extName, extStr ) {
          externals[ extName ] = extStr;

          if ( both ) {
            satisfyCustomDetects( modularBuild, externals.respond + externals.load );
          }
          both = true;
        }

        if ( $('#load input:checked').length ) {
          $.ajax({
            dataType: 'text',
            cache   : false,
            type    : 'GET',
            url     : '/i/js/modernizr.load.1.0.2.js',
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

        if ( $('#respond input:checked').length ) {
          $.ajax({
            dataType: 'text',
            cache   : false,
            type    : 'GET',
            url     : '/i/js/respond.js',
            success : function ( respond ) {
              bothDone( 'respond', respond );
              //buildFile( modularBuild, respond );
            }
          });
        }
        else {
          bothDone( 'respond', '' );
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
        $('input[value="'+selections[i]+'"]').attr('checked', 'checked');
      }
      $('#generate').click();
    }
  }
  loadFromHash();
});




/*! <details> fallback by @mathias | http://mths.be/aaq | MIT/GPL license */
$(function() {

  var isDetailsSupported = ('open' in document.createElement('details'));

  // Execute the fallback only if there’s no native `details` support
  if (!isDetailsSupported) {

    document.documentElement.className += ' no-details';
    
    // Loop through all `details` elements
    $('details').each(function() {

      // Store a reference to the current `details` element in a variable
      var $details = $(this),
          // Store a reference to the `summary` element of the current `details` element (if any) in a variable
          $detailsSummary = $('summary', $details),
          // Do the same for the info within the `details` element
          $detailsNotSummary = $details.children(':not(summary)'),
          // This will be used later to look for direct child text nodes
          $detailsNotSummaryContents = $details.contents(':not(summary)'),
          // This will be used later on
          open = this.getAttribute('open');

      // If there is no `summary` in the current `details` element…
      if (!$detailsSummary.length) {
        // …create one with default text
        $detailsSummary = $(document.createElement('summary')).text('Details').prependTo($details);
      }

      // Look for direct child text nodes
      if ($detailsNotSummary.length !== $detailsNotSummaryContents.length) {
        // Wrap child text nodes in a `span` element
        $detailsNotSummaryContents.filter(function() {
          // Only keep the node in the collection if it’s a text node containing more than only whitespace
          return (this.nodeType === 3) && (/[^\t\n\r ]/.test(this.data));
        }).wrap('<span>');
        // There are now no direct child text nodes anymore — they’re wrapped in `span` elements
        $detailsNotSummary = $details.children(':not(summary)');
      }

      // Hide content unless there’s an `open` attribute
      // Chrome 10 already recognizes the `open` attribute as a boolean (even though it doesn’t support rendering `<details>` yet
      // Other browsers without `<details>` support treat it as a string
      if (typeof open == 'string' || (typeof open == 'boolean' && open)) {
        $details.addClass('open');
        $detailsNotSummary.show();
      } else {
        $detailsNotSummary.hide();
      }

      // Set the `tabIndex` of the `summary` element to 0 to make it keyboard accessible
      $detailsSummary.attr('tabIndex', 0).click(function() {
        // Focus on the `summary` element
        $detailsSummary.focus();
        // Toggle the `open` attribute of the `details` element
        typeof $details.attr('open') !== 'undefined' ? $details.removeAttr('open') : $details.attr('open', 'open');
        // Toggle the additional information in the `details` element
        $detailsNotSummary.toggle(0);
        $details.toggleClass('open');
      }).keyup(function(event) {
        if (13 === event.keyCode || 32 === event.keyCode) {
          // Enter or Space is pressed — trigger the `click` event on the `summary` element
          // Opera already seems to trigger the `click` event when Enter is pressed
          if (!($.browser.opera && 13 === event.keyCode)) {
            event.preventDefault();
            $detailsSummary.click();
          }
        }
      });

    });

  }

});