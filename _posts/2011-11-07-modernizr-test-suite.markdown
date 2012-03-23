---
layout: post
title:  How Does Modernizr’s Test Suite Work?
author: Modernizr
---

Sometimes, members of the team get asked how we ascertain and verify that the features we detect are accurately detected. It’s not always a simple process, but over time we’ve put together a test suite that helps us out a lot.

Paul has recorded a screencast discussing how this test suite for Modernizr was built. The brief summary: initially built with QUnit, the test suite has coverage over the full API surface area of Modernizr, even using kangax’s <a href="https://github.com/kangax/detect-global">detect-global</a> script to assure no globals are introduced beyond `Modernizr` and `yepnope`. After that it gets interesting—as verifying the results from Modernizr’s detection of the current browser’s features isn’t straightforward. We end up using APIs from both Caniuse.com and Github, using projects like Lloyd Hilaiel’s <a href="http://jsonselect.org/">JSONSelect</a>, Lindsey Simon's <a href="https://github.com/tobie/ua-parser">ua-parser</a> (ported to Node by <a href="http://twitter.com/tobie">@tobie</a>), some ES5 polyfills, and some real sexy jQuery Deferred action to elegantly handle a bunch of `$.getScript` calls.

20 minutes of javascript and feature detection action below.

<div class="fitvid"><object width="640" height="480"><param name="movie" value="http://www.youtube.com/v/Mbt6h1BFW8g?version=3&amp;hl=en_US&amp;rel=0&amp;hd=1"></param><param name="allowFullScreen" value="true"></param><param name="allowscriptaccess" value="always"></param><embed src="http://www.youtube.com/v/Mbt6h1BFW8g?version=3&amp;hl=en_US&amp;rel=0&amp;hd=1" type="application/x-shockwave-flash" width="640" height="480" allowscriptaccess="always" allowfullscreen="true"></embed></object></div>
