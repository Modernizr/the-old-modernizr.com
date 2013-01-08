---
layout: post
title:  "Modernizr Policy on Browser Bugs and Feature Detects"
author: Modernizr
---

Modernizr detects features in browsers based on the APIs they expose to enable that feature. However, sometimes a browser vendor will implement a feature, but its implementation is buggy; for instance, its API exists but the output is not rendered, or the feature doesn’t work right—or even at all. This sometimes results in what we call “False Positives”: a feature that tests positively, but is not reliable or usable. (For example, Opera Mini provides a false positive for CSS Gradients.)  Other times we might calls these plain “browser bugs,” issues in the implementation that doesn’t affect the common use but is an edge case issue. (For example, `box-sizing` doesn't work with `min-height` in Firefox.)

False positives are a developer’s nightmare: they can be hard to discover, even harder to fix, and are almost always frustrating. So what can we do?

Modernizr aims for accuracy in tests based on their associated ECMAScript, HTML and CSS specifications. Yet sometimes something slips past and it reports a false positive. We are in the process of documenting these cases and putting them in one single page for easy consumption.

#### Found a false positive?

When you encounter a false positive, [add it to the Modernizr Issues tracker](https://github.com/Modernizr/Modernizr/issues/new). We will give it [the “False result” label](https://github.com/Modernizr/Modernizr/issues?labels=false+result&page=1&state=open). Also please clearly describe which browser(s) it is a false positive in, and whether the implementation is buggy, broken or incomplete.

Wherever possible, we will attempt to work around the issue (for example: forcing a reflow, adding the element to the DOM, etc), though as a last result we will add a UA sniff. We'd appreciate your help with a pull request, as well!

Above all: [report false positives to their respective vendors’ bug trackers](http://coding.smashingmagazine.com/2011/09/07/help-the-community-report-browser-bugs/). (Many times it's a mobile port of WebKit that has the problem; while it may not exist in other WebKit ports, you can file these at the WebKit tracker regardless.) That is the best way to get these issues resolved, and helps Modernizr to be a great feature detection library.

#### Browser bug?

We agree that browser bugs should be detected instead of assumed for given UA strings. This is how `jQuery.support` works. However, Modernizr detects features and will not be collecting bugs. We do recommend you [file the issue with the appropriate vendor](http://coding.smashingmagazine.com/2011/09/07/help-the-community-report-browser-bugs/) and blog about it or post on Stack Overflow to get the word out there with your proposed fix.

#### Thanks

Modernizr will strive to report accurately, even if the browser is returning a false positive for the correct detect.
