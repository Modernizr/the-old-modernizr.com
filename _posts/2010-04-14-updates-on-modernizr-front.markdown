---
layout: post
title:  Updates on the Modernizr front
author: <a href="http://farukat.es/">Faruk Ateş</a>
---

As you've undoubtedly noticed, it's been relatively quiet on the Modernizr front from our side, with no news or new releases since the start of the year. Nonetheless, everyone else has started getting more and more busy _using_ Modernizr to enhance their sites without sacrificing control over older browsers. Progressive Enhancement is becoming increasingly commonplace and we couldn't be more excited about that.

So where do things stand? Well, we've been working, <a href="http://github.com/Modernizr/Modernizr">over on Github</a>, at getting the next release of Modernizr ready, version 1.2. We're not quite there yet, but we are setting a planned release date of **Thursday, April 22**. Every time we're almost there another new feature or issue pops up that we have a hard time excluding from the next release, but it's more important to iterate regularly than do big pushes for a tool like this.

Related to all this has been an increasing effort towards realigning Modernizr; the site isn't what it could and should be, the community around Modernizr isn't as cohesive yet which leads to fragmented and overlapping efforts in promoting the tool, and the explanation of what Modernizr is and how it works is still lacking. Clearly, lots of room for improvement&mdash;and we're not just aware of it, we're working to fix it.

One of the biggest issues of the current site is the static-ness of it. For instance, we really want to promote sites that use Modernizr, but there's no easy way to submit your site to us. This and many other things will be addressed in the redesign.

The absolute biggest announcement is saved for last, and that is: **Modernizr 2**.

Early on, before Modernizr was released yet, my friend <a href="http://www.mkrieger.org/">Mike Krieger</a> and I were brainstorming on how to offer Modernizr. Initially, my plan had been to offer some configuration tool wherewith you could specify which features you wanted to test for, and download a customized build of Modernizr that suited your needs. Mikey and I got all excited by the possibilities of tracking this data, observing which features web designers &amp; developers were most interested in, and so forth.

Then we realized that this brought about a _ton_ of complexity, far too much for the introduction of the library. So, we dropped that idea and instead focused on making a simple, easy to use toolkit without any complexity in how to get it: just download it, include it and you're set.

Well, turns out that the idea itself wasn't a _bad_ one, it was just too ahead of its time. As the Modernizr library grew its feature-set, it also grew its footprint and execution time. Thanks to the talents of <a href="http://paulirish.com/">Paul</a> and the many contributors committing code over on Github, it has stayed incredibly lean and fast&mdash;but also at the cost of things we'd really like to add, like SVG.

SVG is an oft-requested feature for Modernizr to test against, and we really want to add it. But, to do it right would involve doing not just a basic one-line test against something like "window.SVG"&mdash;no, you have to do a very large number of tests so you can accurately report what parts of SVG the browser supports. To add that to Modernizr right now would bloat the library and slow it down, even though most users won't make use of it.

With _Modernizr 2_ we'll be breaking things up a little and allow you to customize your download _if you so choose to_. There will still be one simple, default download containing the core features of the library, but for advanced users there will be a configuration tool so you can pick and choose and add (or subtract) all the features you want.

So those are some of the updates on Modernizr. Next week Thursday we hope to release version 1.2 so if all goes well, you'll hear from us again soon.
