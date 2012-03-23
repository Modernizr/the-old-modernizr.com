---
layout: post
title:  Modernizr and Content Delivery Networks (CDNs)
author: Team Modernizr
---

One of the most common requests around Modernizr is for it to be made available on a Content Delivery Network. Back in the 1.x days this made a fair bit of sense: there was only one version of the library, and so the compressed version would be useful to have on a CDN for performance reasons.

With the advent of Modernizr 2, however we&rsquo;ve (re)introduced modular builds of the library, which make the value of CDNs less self-evident. We now make you create a customized build of Modernizr&mdash;using only the tests you actually need&mdash;when you want a production-ready, minified &amp; compressed version of the library. But with over 40 embedded tests, supporting all possible combinations of tests is impossible, aside of being downright undesirable.

This has caused some confusion, so we&rsquo;d like to explain the right way to use Modernizr under the various different scenarios that occur.

<h4 id="development">Development, local: General development and/or learning</h4>

When you start building a new project, or if you simply want to learn, you should download <a href="http://www.modernizr.com/downloads/modernizr-latest.js">the latest development version of Modernizr</a>. This is typically a stage where you don&rsquo;t know yet which feature detection tests you&rsquo;ll eventually need by the time you go to production, and don&rsquo;t need to worry about minification. If you&rsquo;re building your site or app locally, this is the version to use.

<h4 id="special">Development + CDN: Test cases, one-offs, partial control-situations</h4>

If you&rsquo;re creating a quick test case using something like <a href="http://jsfiddle.net/">jsfiddle</a>, or are writing an entry for a contest like <a href="http://10k.aneventapart.com/">10K Apart</a>, using a CDN can be not just useful, but downright necessary. If your situation relies on externally-hosted code, use one of the CDN releases.

But be warned: _these versions contain all 40+ tests!_ That means they are full-fledged libraries with almost certainly a lot of things you don&rsquo;t need in a final product.

That&rsquo;s why the <a href="http://www.asp.net/ajaxlibrary/cdn.ashx#Modernizr_Releases_on_the_CDN_5">Microsoft CDN</a> and <a href="http://www.cdnjs.com/#/search/modernizr">CDNJS</a> releases of Modernizr are essentially just Development versions, but hosted somewhere for you to use.

<h4 id="production">Custom build: All production uses</h4>

Are you priming your website or app for production? Then it&rsquo;s time to head over to <a href="http://www.modernizr.com/download/">the custom download builder</a>, tick all the tests your project makes use of, and hit that Generate button to make your own special build.

**All production uses of Modernizr should be using a latest custom build from the site.** This ensures that you won&rsquo;t run into any (old) bugs, and will have the absolute minimum amount of code and execution time needed for the best possible performance.

As an added bonus, these custom builds now include a directly-usable Build link that allow you to make small tweaks&mdash;change a setting here or there&mdash;without having to figure out your requirements all over again. It&rsquo;s also helpful whenever a new stable build is released: just revisit that Build link from your custom build&rsquo;s source, hit Generate again and you have a new, updated stable build. Always be sure to test!

We hope this simple guide helps you figure out when to use what version of Modernizr.
