---
layout: default
title: Magnific Popup Documentation
description: The complete guide on how to use Magnific Popup.
---

# &nbsp;

<div id="documentation-intro">
  <h1><a href="http://dimsemenov.com/plugins/magnific-popup/">Magnific Popup</a> Documentation</h1>
  <p><a href="">Project on Github</a> &middot; <a href="#mfp-build-tool" class="mfp-build-tool-link">Build tool</a> &middot; <a href="http://twitter.com/dimsemenov">Twitter of developer</a> &middot; <a href="http://dimsemenov.com/subscribe.html">Newsletter of developer</a></p>
</div>
<style>
#documentation-intro {
  background: #2b2b2b;
  text-align: center;
  padding: 3em;
  width: 100%;
  margin-left: -3em;
  margin-bottom: 3em;
}
#documentation-intro h1 {
  color: #FFF;
  width: 100%;
  text-align: center;
  font-size: 44px;
  line-height: 1.1em;
}
#id1 {
  display: none;
}
#main-wrapper {
  background: #FFF;
}
#documentation-intro h1 a {
  text-decoration: none;
  color: #FFF;
}
#documentation-intro p a {
  font-size: 15px;
  color: #7CB5FF;
}
#documentation-intro a:hover {
  opacity: 0.75;
  text-decoration: underline;
}
</style>

<h3 style="color:#C00; text-align:center;">Warning! Plugin is in early beta and this documentation is not finished yet. Please send your suggestions about it via Twitter to <a href="http://twitter.com/dimsemenov">@dimsemenov</a>.</h3>

Here you can find guide about how to use Magnific Popup. If you've found any mistake in this site or you know how to improve something, simply submit <a href="">commit on GitHub</a>.

* This will become a table of contents (this text will be scraped).
{:toc}

## Including files

{% highlight html %}
<!-- Magnific Popup core CSS file -->
<link rel="stylesheet" href="magnific-popup/magnific-popup.css"> 

<!-- jQuery 1.7.2+ or Zepto.js 1.0+ -->
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script> 

<!-- Magnific Popup core JS file -->
<script src="magnific-popup/jquery.magnific-popup.js"></script> 
{% endhighlight %}
    
It's not required, but recommended to put CSS files in `<head>`. JavaScript files and initialization code - in footer of your site (before closing `</body>` tag).<br/> If you already have `jquery.js` on your site - don't include it second time, or use `jQuery.noConflict();` mode.



## Initializing popup

Popup initialization code should be executed after document ready, for example:
{% highlight javascript %}
$(document).ready(function() {
  // initialization code
  $('.image-link').magnificPopup();
});
{% endhighlight %}

Basically all this function does is binds click event to the element.

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
Same as first one, but use this method if you are creating popup from list of elements in one container. Note that this method does not enable gallery, it just reduces number of event handlers, and each item will be opened as a single popup. If you wish to enable gallery add `gallery:{enabled:true}` option.

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



## Image Type

To

## Video Type

## Inline Type

Example of popup:

<div class="your-popup mfp-hide">
  Popup content
</div>

$('.your-popup').magnificPopup({type:'inline'});

.your-popup {
  background: #FFF;
  padding: 20px;
  width:100%;
  max-width: 500px;
}

Class `mfp-hide` must be present on inline element to make it hidden, it's toggled when popup is displayed.
Class `mfp-hide` is toggled on target inline element.




## Ajax Type      


## Gallery

Basically all galery module does is allows you to switch content of popup and adds navigation arrows. It can switch and mix any types of content, not just images. 

### Lazy-loading

Lazy-loading option preloads nearby items. It accepts array with two integers as a parameter, first one - is a number of items to preload before the current, second one - the number of images to preload after current. For example `preload: [1,3]` will load 3 next items and 1 that is before current. These values are automatically switched based on direction of movement. 

Option can be changed dynamically.

By default all what it does is just searches for an image tag and preloads it with JavaScript. But you can extend it and do your custom preloading logic with help of `lazyLoad` event, like so:

{% highlight javascript %}
callbacks: {
  lazyLoad: function(item) {
    console.log(item); // Magnific Popup data object that should be loaded
  }
}
{% endhighlight %}



## Options


### disableOn *0* 
If window width is less then number in this option - lightbox will not be opened and default behavior of element will be triggered. Set to `0` to disable behavior. Option works only when you initialize Magnific Popup from DOM element.

Can also accept Function as a parameter, which should return `true` if lightbox can be opened and `false` otherwise. For example: 

{% highlight javascript %}
disableOn: function() {
  if( $(window).width() < 600 ) {
    return false;
  } 
  return true;
}
{% endhighlight %}


### key *null*

Key defines unique identifier of the group of popups. The parameter is optional and is used to cache templates, if you won't define it - it'll be generated automaticaly when `$.magnificPopup.open` or `$.fn.magnificPopup` is called. **If you have many popups with similar structure, this option is a must.** 

{% highlight javascript %}
// These three magnificPopups will share same instance, because they have same key.
// If you don't provide key for each one, 3 instances will be created.

$('.button1').magnificPopup(function() {
  key: 'my-app-popup'
});

$('.button2').magnificPopup(function() {
  key: 'my-app-popup'
});

$.magnificPopup.open({
  key: 'my-app-popup'
});
{% endhighlight %}




### midClick *false*
If set to `true` opens lightbox if user clicked middle mouse button. Option works only when you initialize Magnific Popup from DOM element.


### mainClass *''*
String that contains classes that will be added to the root element of popup wrapper and to dark overlay. For example `"myClass"`, can also contain multiple classes - `'myClassOne myClasTwo'`.

### preloader *true*

Preloader in Magnific Popup is used as an indicator of current status. If option enabled, it's always present in DOM only text inside of it changes. Below you can see explanation of CSS names that are applied to container that holds preloader and content area depending on the state of current item:

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


### focus *''*
String with CSS selector of element inside popup to focus. For example `'input'` or `'#login-input'`. Leave empty to focus popup itself.


### closeOnContentClick *false*
Close popup when user clicks on content of it. It's recommended to enable this option when you have only one image in popup.

### closeBtnInside *false*
If enabled, Magnific Popup will put close button inside content of popup, and wrapper will get class `mfp-close-btn-in` (which in default CSS file makes color of it change).

### removalDelay *0*
Delay before popup is removed from DOM. Read more in [animation](#animation) section.

### closeMarkup 
Default value: `<button title="%title%" class="mfp-close"><i class="mfp-close-icn">&times;</i></button>`.
Markup of close button. %title% will be replaced with option `tClose`.





## Animation

Animation can be added to any example. For Ajax based popup content animation is fired only after content is loaded.

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







## Extending

## FAQ


## Translating

Internationalization of Magnific Popup is very simple, all you need is to extend default settings object with new values, or just pass options to your initialization code. If you're making something public, it's strongly recommended to use oly second method to avoid conflicts.

Some properties contain %keys% that should not be translated. 

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
