//  Google Analytics
var _gaq = [['_setAccount', 'UA-3764464-7'], ['_trackPageview']];
(function(d, t) {
  var g = d.createElement(t),
      s = d.getElementsByTagName(t)[0];
  g.async = true;
  g.src = ('https:' == window.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
  s.parentNode.insertBefore(g, s);
})(document, 'script');

// GoSquared LiveStates
var GoSquared={acct:"GSN-761287-J"};
(function(w){
function gs(){
w._gstc_lt=+(new Date); var d=document;
var g = d.createElement("script"); g.type = "text/javascript"; g.async = true; g.src = "//d1l6p2sc9645hc.cloudfront.net/tracker.js";
var s = d.getElementsByTagName("script")[0]; s.parentNode.insertBefore(g, s);
}
w.addEventListener?w.addEventListener("load",gs,false):w.attachEvent("onload",gs);
})(window);
