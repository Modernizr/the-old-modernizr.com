---
layout: post
title:  Modernizr goes 1.0!
author: <a href="http://farukat.es/">Faruk Ateş</a>
---
I'm very pleased to announce <a href="/releases/#release-1.0">**Modernizr 1.0**</a>, the first major milestone release of the JavaScript library that detects native implementations of HTML5 and CSS3 features in browsers.

Before I tell you about all the useful new features that Modernizr 1.0 detects for, I want to express my immense gratitude to, first and foremost, <a href="http://paulirish.com" rel="external">Paul Irish</a> and <a href="http://benalman.com/" rel="external">Ben Alman</a>. The two of them restructured most of Modernizr's 0.9 codebase, leaving it functionally intact but reducing the file size by a stunning 35% and improving performance here and there. I also want to thank <a href="http://ejohn.org/" rel="external">John Resig</a>, <a href="http://diveintomark.org/" rel="external">Mark Pilgrim</a>, Leonid Khachaturov, John Tantalo and Peter Speck. All of whom have made contributions in direction and/or code.

**So what's new in Modernizr 1.0?** To start off, Modernizr 1.0 can now be included in the `head` section of your website. We've changed its behavior so that it adds the classes—which represent each browser's native implementations—to the `html` element instead of the `body` element. See the notes below for details on this.

Let's get to the features! We now detect for native browser support for the HTML5 `audio` and `video` elements, as well as the <a href="http://www.w3.org/TR/geolocation-API/" rel="external">Geolocation API</a>. We've also added a _second_ test for Canvas, specifically for Canvas Text. This because various browsers support Canvas drawing but not yet Canvas _Text_, and the ability to draw text in a Canvas is rather significant and thus warranted its own test.

Moving on, we've added a series of tests for HTML5 input data types, such as `input type="search"` and `input type="range"`. All of these are combined into an array that's accessible from the JavaScript `Modernizr` object, under `Modernizr.inputtypes`. Full details are available in the new <a href="/docs/">Documentation</a> area.

Last and _most certainly not least_ is the new `@font-face` detection, courtesy of some more work by Paul Irish. That's right, with Modernizr you can now detect whether a browser will _actually render_ embedded @font-face fonts or not. This, like everything else in Modernizr, is an actual feature detection test.

**Note:** we're cheating a little in the `@font-face` test because we let <abbr title="Internet Explorer">IE</abbr>5 and above pass the test directly; <abbr>IE</abbr> supports the standardized `@font-face` syntax but it only supports <a href="http://en.wikipedia.org/wiki/Embedded_OpenType" rel="external"><abbr title="Embedded OpenType ">EOT</abbr> fonts</a>. Browsers that support `@font-face` font embedding with OpenType and/or TrueType fonts are tested using a custom one-glyph font that Paul created, and which is now _part of Modernizr_ in Base64.

With all these new tests and additions and even a font glyph inclusion right there in the JavaScript, you may be wondering what the new file size is. The answer: **16kb normal**, slightly over **7kb minified**.

### Important questions answered

**Is Modernizr 1.0 fully backwards-compatible with 0.9?**<br />
Yes and no. As far as the JavaScript side is, yes, you should be able to just replace the old 0.9 with the new 1.0 file and adjust your script include path accordingly, and everything should Just Work.

However, as mentioned above, the CSS side has one crucial change: Modernizr 1.0 adds the various class names to the `html` element instead of, previously, the `body` element. Thus, if your CSS rules say `body.csstransforms`, you'll have to change them to read either just `.csstransforms` or `html.csstransforms`.

**Is this valid?**<br />
Yes, under HTML5—which is what Modernizr is meant to be used under—it is perfectly valid to put a `class` attribute on the `html` element. It works just fine on HTML4 and XHTML documents, but it won't validate. (but remember: **validation is a tool, not a goal**)

**Additional note:**<br />
Modernizr 1.0 also checks for (and if found, removes) the class `no-js` from the `html` element. In its place, it adds the class `js`, which means that if you start your templates with the code `<html class="no-js">` and then include the Modernizr library, you can use the classes `.no-js` and `.js` to respectively determine whether JavaScript is disabled or enabled in the browser.

**Will Modernizr go on GitHub / Bitbucket / similar now that it is 1.0?**<br />
Yes, very soon it will get hosted on a public repository so that people can contribute a little more directly. We haven't decided yet which one, but no new releases will be made until it's hosted publicly.

**What do you have planned for the next release?**<br />
Wait and see! Fortunately, we've now added a News section and RSS feed to Modernizr.com, so you can simply <a href="/feeds/news">subscribe to the feed</a> and we'll keep you posted of all things Modernizr.

Now go and <a href="/">download Modernizr 1.0</a>!