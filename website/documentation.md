---
layout: default
title: Magnific Popup Documentation
description: The complete guide on how to use Magnific Popup.
---

# Magnific Popup Documentation

<div style="padding: 25px; background: #FFE7E7; margin-bottom: 20px;">
  <strong>Warning!</strong> This documentation page is currently under development, please wait until I finish it.
</div>

Here you can find guide about how to use Magnific Popup. I've tried to make it useful both for experienced developers and for newbies. If you've found any mistake or type in documentation (or this site) or you know how to improve something, simply submit <a href="">commit to documentation.md on GitHub</a>.

<ul>
  <li>Edit documentation.md on GitHub (this page).</li>
</ul>

* This will become a table of contents (this text will be scraped).
{:toc}

## Including files

{% highlight html %}
<!-- Magnific Popup core CSS file -->
<link rel="stylesheet" href="magnific-popup/magnific-popup.css"> 

<!-- jQuery 1.7.2+ -->
<script src="magnific-popup/jquery-1.9.0.min.js"></script> 

<!-- Magnific Popup core JS file -->
<script src="magnific-popup/jquery.magnific-popup.js"></script> 
{% endhighlight %}
    
It's recommended to put CSS files in `<head>`. JavaScript files and initialization code - in footer of your site (before closing `</body>` tag).<br/> If you already have jQuery.js on your site - don't include it second time, or use jQuery.noConflict(); mode.



## Initializing popup

Popup initialization code should be executed inside document ready, for example:
{% highlight javascript %}
jQuery(document).ready(function($) {
  // initialization code
  $('.image-link').magnificPopup();
});
{% endhighlight %}

There are three ways to initialize popup:

### 1. From HTML element

This code will bind click event to target element (in our case `.your-popup-link`). Extra options are added if you use this method, like conditional lightbox and opening content on middle mouse click. 

{% highlight html %}
<a class="your-popup-link" href="path-to-image.jpg">Open popup</a>
{% endhighlight %}

{% highlight javascript %}
$('.your-popup-link').magnificPopup({ 
	// options
});
{% endhighlight %}

    

### 2. From a group of elements with one parent
Same as first one, but use this method if you are creating popup from list of elements in one container. Note that this method does not enable gallery, it just reduces number of event handlers, and each item will be opened as a single popup. If you wish to enable gallery add `gallery:true` option.

{% highlight html %}
<div class="parent-container">
  <a href="path-to-image-1.jpg">Open popup 1</a>
  <a href="path-to-image-2.jpg">Open popup 2</a>
  <a href="path-to-image-3.jpg">Open popup 3</a>
</div>
{% endhighlight %}

{% highlight javascript %}
$('.parent-container').magnificPopup({
  delegate: 'a' // child items selector, by clicking on it popup will open
  // other options
});
{% endhighlight %}



### Using just JavaScript 
Calling `$.magnificPopup.open` will open lightbox right away. Learn more about this in <a href="#api">API</a> section.
{% highlight javascript %}
$('#some-button').click(function() {
  $.magnificPopup.open({
    type: 'image',
    href: 'path-to-image.jpg'
  });
});
{% endhighlight %}



      



## Options

Name | Default | Description
--- | --- | ---
disableOn | 0 | If window width is less then number in this option - lightbox will not be opened and default behavior of element will be triggered. Option can also accept Function as a parameter, which should return `true` if lightbox can be opened and `false` otherwise. Set to `0` to disable behavior.
midClick | false | Open lightbox if user clicks on middle mouse button.
mainClass | null | String that contains classes that will be added to root element of popup wrapper and to dark overlay. For example `myClass`, or `myClassOne myClasTwo`.
minHeight | 400 | Scrollbar will appear if height of window is less than number in this option.
preloader | true | Enables preloader (Loading... text in the middle of the screen). Otion is always `false` for inline type of popup.
focusInput | false | Puts tab focus to the first input in popup (after it's displayed and/or loaded). If set to false - it'll just set focus to popup root element.
closeOnContentClick | false | Close popup if user clicks on content of it. It's recommended to enable this option when you have only one image in popup.
closeBtnInside | false | If enabled, Magnific Popup will put close button inside content of popup, wrapper will get class `mfp-close-btn-in` which will make button inside dark (by default).
overlay | true | Dark overlay behind the popup
removalDelay | 0 | Used for animation. Removal of popup will be delayed by value in the field.
alignTop | false | Aligns popup to top, otherwise to center. If you expect larger popup to appear it's recommended to enable this option.
tClose | 'Close (Esc)' | Title of close button
tLoading | 'Loading...' | Preloader text
closeMarkup | `<button title="%title%" class="mfp-close"><i class="mfp-close-icn">&times;</i></button>` | Markup of close button. %title% will be replaced with option `tClose`.


## CSS animations

After popup is opened popup wrapper and background overlay get class `mfp-ready`. Before popup is removed they get class `mfp-removing`.

For example:

{% highlight javascript %}
// Initialize popup as usual
$('.popup-link').magnificPopup({ 
	// Delay in milliseconds before popup is removed
	removalDelay: 300,

	// Class that is added to body when popup is open. 
	// make it unique to apply your CSS animations just to this exact popup
  mainClass: 'mfp-fade'
});
{% endhighlight %}


Then just play with CSS3 transitions:

{% highlight css %}
/* overlay at start */
.mfp-fade.mfp-bg {
  opacity: 0;

  -webkit-transition: all 0.15s ease-out;
  -moz-transition: all 0.15s ease-out;
  transition: all 0.15s ease-out;
}
/* overlay animate in */
.mfp-fade.mfp-bg.mfp-ready {
  opacity: 0.8;
}
/* overlay animate out */
.mfp-fade.mfp-bg.mfp-removing {
  opacity: 0;
}

/* content at start */
.mfp-fade.mfp-wrap .mfp-content {
  opacity: 0;

  -webkit-transition: all 0.15s ease-out;
  -moz-transition: all 0.15s ease-out;
  transition: all 0.15s ease-out;
}
/* content animate it */
.mfp-fade.mfp-wrap.mfp-ready .mfp-content {
  opacity: 1;
}
/* content animate out */
.mfp-fade.mfp-wrap.mfp-removing .mfp-content {
  opacity: 0;
}
{% endhighlight %}

Please use animation wisely and when it's really required. Do not enable it when your popup may contain large image or a lot of HTML text.


## Types of scroll

- Keep default scroll and no fixed positiin
  Recommended for modals and dialogs. + For all other types on mobile devices that can't handle fixed position.

- Remove default scroll and add own based on popup content
  Recommended for images, galleries and large HTML blocks.





## Styling


## API


### Events

Callbacks that are defined inside `callbacks` option will automatically be called if they exist. All Magnific Popup events are also dispatched using `triggerHandler` on target element (or to document if it doesn't exist).

{% highlight javascript %}
$('.image-link').magnificPopup({
  // you may add other options here, e.g.:
  preloader: true,

  callbacks: {
    open: function() {
      // Will fire when this exact popup is opened
      // this - is Magnific Popup object
    },
    close: function() {
      // Will fire when popup is closed
    }
    // e.t.c.
  }
});


// Will fire when any popup is opened. 
// Name of event should start from  `mfp` and first letter should be uppercase. 
// e.g. 'open' -> 'mfpOpen', 'beforeOpen' -> 'mfpBeforeOpen.
$(window).on('mfpOpen', function() {
  console.log('Popup is open);
});
{% endhighlight %}

{% highlight javascript %}
callbacks: {
  beforeOpen: function() {
    console.log('Start of popup initialization');
  },
  contentParse: function(item, preload) {
    console.log('Parsing content. Item object that is being parsed:', item, ' Triggered by preloader:', preload);
    // feel free to modify here item object
  },
  change: function() {
    console.log('Content changed');
    console.log('Triggers');
  },
  resize: function() {
    console.log('Popup resized');
    // resize event triggers only when height is changed or layout forced
  },
  open: function() {
    console.log('Popup is opened');
  },
  close: function() {
    console.log('Popup is closed');
  },

  // Ajax-only module events
  parseAjax: function(jqXHR) {
    console.log('Loading of ajax content finished. Object:', jqXHR);
    // You can modify value of jqXHR.responseText here. It's used as content for popup.
  }
}
{% endhighlight %}





### Public methods

Magnific Popup object is not attached to DOM element.


## Preloader & status

Preloader in Magnific Popup is used as an indicator of current status. It's always present in DOM only text inside of it changes. Below you can see explanation of CSS names that are applied to container that holds preloader and content area depending on the state of current item:

{% highlight css %}

/* Content loading is in progress */
.mfp-s-loading { }

/* Content successfully loaded */
.mfp-s-ready { }

/* Error during loading  */
.mfp-s-error { }
{% endhighlight %}

For example, if you want your error message to be in red add such CSS:

{% highlight css %}
.mfp-s-error .mfp-preloader {
  color: red;
}
{% endhighlight %}

You can trigger change of status manually by calling `instance.updateStatus('error', 'error message')`. 

## Extending

## FAQ


## Translating

All you need is to extend default settings object with new values, or just pass option to popup initialization options.

{% highlight javascript %}
// Add it after jquery.magnific-popup.js and before first initialization code
$.extend(true, $.magnificPopup.defaults, {
  tClose: 'Close (Esc)',
  tLoading: 'Loading...',
  gallery: {
    tPrev: 'Previous (Left arrow key)',
    tNext: 'Next (Right arrow key)',
    tCounter: '%curr% of %total%'
  },
  image: {
    tError: '<a href="%url%">The image</a> could not be loaded.'
  },
  ajax: {
    tError: '<a href="%url%">The request</a> failed.'
  }
});
{% endhighlight %}
