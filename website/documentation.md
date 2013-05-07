---

layout: default

title: Magnific Popup Documentation

description: The complete guide on how to use Magnific Popup - the open source responsive lightbox plugin.

addjs: true

canonical_url: http://dimsemenov.com/plugins/magnific-popup/documentation.html

buildtool: true

---


<div id="documentation-intro">
  <style type="text/css">#main-wrapper{background: #FFF;}</style>
  <h1><a href="http://dimsemenov.com/plugins/magnific-popup/">Magnific Popup</a> Documentation</h1>
  <p><a href="https://github.com/dimsemenov/Magnific-Popup/">Project on Github</a> &middot; <a href="#mfp-build-tool" class="mfp-build-tool-link">Build tool</a> &middot; <a href="http://twitter.com/dimsemenov">Twitter of developer</a> &middot; <a href="http://dimsemenov.com/subscribe.html">Newsletter of developer</a></p>
</div>


<!-- DOCUMENTATION START -->


Here you can find the guide on how to use Magnific Popup. Besides this docs page, you can <a href="http://codepen.io/collection/nLcqo">play with examples on CodePen</a>. If you've found any mistake in this site or you know how to improve some part of this documentation - please <a href="https://github.com/dimsemenov/Magnific-Popup/blob/master/website/documentation.md">commit on GitHub</a>.

# &nbsp;

* This will become a table of contents (this text will be scraped).
{:toc}

## Including files

You can get Magnific Popup JS and CSS file from <a href="#mfp-build-tool" class="mfp-build-tool-link">build tool</a>, or from folder `dist/` of <a href="https://github.com/dimsemenov/Magnific-Popup">GitHub repository</a> or by compiling it by yourself with Grunt.

{% highlight html %}
<!-- Magnific Popup core CSS file -->
<link rel="stylesheet" href="magnific-popup/magnific-popup.css"> 

<!-- jQuery 1.7.2+ or Zepto.js 1.0+ -->
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script> 

<!-- Magnific Popup core JS file -->
<script src="magnific-popup/jquery.magnific-popup.js"></script> 
{% endhighlight %}
    
It's not required, but recommended to put CSS files in `<head>`. JavaScript files and initialization code - in footer of your site (before closing `</body>` tag).<br/> If you already have `jquery.js` on your site - don't include it second time, or use `jQuery.noConflict();` mode. Optionally, you can include [Zepto.js](http://zeptojs.com/) instead of [jQuery](http://jquery.com), or [choose which one to include](http://stackoverflow.com/questions/8725905/zepto-fallback-to-jquery) based on browser support.


## Initializing popup

Popup initialization code should be executed after document ready, for example:
{% highlight javascript %}
$(document).ready(function() {
  $('.image-link').magnificPopup({type:'image'});
});
{% endhighlight %}

There are three ways to initialize popup:

### 1. From HTML element

{% highlight html %}
<a class="test-popup-link" href="path-to-image.jpg">Open popup</a>
{% endhighlight %}

{% highlight javascript %}
$('.test-popup-link').magnificPopup({ 
  type: 'image'
	// other options
});
{% endhighlight %}

    

### 2. From a group of elements with one parent
Same as first one, but use this method if you are creating popup from list of elements in one container. Note that this method does not enable gallery, it just reduces number of click event handlers, and each item will be opened as a single popup. If you wish to enable gallery add `gallery:{enabled:true}` option.

{% highlight html %}
<div class="parent-container">
  <a href="path-to-image-1.jpg">Open popup 1</a>
  <a href="path-to-image-2.jpg">Open popup 2</a>
  <a href="path-to-image-3.jpg">Open popup 3</a>
</div>
{% endhighlight %}

{% highlight javascript %}
$('.parent-container').magnificPopup({
  delegate: 'a', // child items selector, by clicking on it popup will open
  type: 'image'
  // other options
});
{% endhighlight %}



### 3. From 'items' option
`items` option defines data for the popup item(s) and it makes Magnific Popup ignore all attributes on the target DOM element. Value for `items` can be a single object or an array of objects.

{% highlight javascript %}
// Example with single object
$('#some-button').magnificPopup({
    items: {
      src: 'path-to-image-1.jpg'
    },
    type: 'image' // this is default type
});

// Example with multiple objects
$('#some-button').magnificPopup({
    items: [
      {
        src: 'path-to-image-1.jpg'
      },
      {
        src: 'http://vimeo.com/123123',
        type: 'iframe' // this overrides default type
      },
      {
        src: $('<div>Dynamically created element</div>'), // Dynamically created element
        type: 'inline'
      },
      {
        src: '<div>HTML string</div>',
        type: 'inline'
      },
      {
        src: '#my-popup', // CSS selector of an element on page that should be used as a popup
        type: 'inline'
      }
    ],
    gallery: {
      enabled: true
    },
    type: 'image' // this is default type
});
{% endhighlight %}

Play with [this example on CodePen](http://codepen.io/dimsemenov/pen/vKrqs).



## Content Types

By default Magnific Popup has 4 types of content `image`, `iframe`, `inline`, `ajax`. There is no any "auto-detection" of type based on URL, so you should define it manually.

Type of popup can be defined in a two ways:

1. Using `type` option. E.g.: `$('.image-link').magnificPopup({type:'image'})`.

2. Using `mfp-TYPE` CSS class (where `TYPE` is desired content type). E.g.: `<a class="mfp-image image-link">Open image</a>`, `$('.image-link').magnificPopup()`.

Second option always overrides first one, so you may initialize popups with multiple content types from one call.

<br/>

**The source of the the popup content** (e.g. path to image, path to HTML file, path to video page) can be defined in a few ways:

Method #1: From `href` attribute:

{% highlight html %}<a href="image-for-popup.jpg">Open image</a>{% endhighlight %}

Method #2: From `data-mfp-src` attribute (overrides first method):

{% highlight html %}<a href="some-image.jpg" data-mfp-src="image-for-popup.jpg">Open image</a>{% endhighlight %}

Method #3: From <code>items</code> option

{% highlight javascript %}
$.magnificPopup.open({
  items: {
    src: 'some-image.jpg'
  },
  type: 'image'
});
{% endhighlight %}


If you want to modify a way how the source is parsed, you may hook into `elementParse` callback. For example:

{% highlight javascript %}
$('.image-link').magnificPopup({
  type:'image',
  callbacks: {
    elementParse: function(item) {
      // Function will fire for each target element
      // "item.el" is a target DOM element (if present)
      // "item.src" is a source that you may modify

      console.log(item); // Do whatever you want with "item" object
    }
  }
});
{% endhighlight %}









## Image Type

The path to the image must be set as a main source if you selected this type. If your popup doesn't have an image source and doesn't have an image that shouldn't be preloaded (& retinized etc.) - use inline type.

{% highlight javascript %}
image: {
  markup: '<div class="mfp-figure">'+
            '<div class="mfp-close"></div>'+
            '<div class="mfp-img"></div>'+
            '<div class="mfp-bottom-bar">'+
              '<div class="mfp-title"></div>'+
              '<div class="mfp-counter"></div>'+
            '</div>'+
          '</div>', // Popup HTML markup. `.mfp-img` div will be replaced with img tag, `.mfp-close` by close button

  cursor: 'mfp-zoom-out-cur', // Class that adds zoom cursor, will be added to body. Set to null to disable zoom out cursor. 
  
  titleSrc: 'title', // Attribute of the target element that contains caption for the slide.
  // Or the function that should return the title. For example:
  // titleSrc: function(item) {
  //   return item.el.attr('title') + '<small>by Marsel Van Oosten</small>';
  // }

  verticalGap:88,

  verticalFit: true, // Fits image in area vertically

  tError: '<a href="%url%">The image</a> could not be loaded.' // Error message
}
{% endhighlight %}

Please note that Magnific Popup doesn't implement any JS-based clint-side caching for images. So make sure that your server [adds expires headers](https://developers.google.com/speed/docs/best-practices/caching#LeverageBrowserCaching), so image won't be downloaded each time. 


## Iframe Type

By default Magnific Popup supports only one type of URL for each service:

{% highlight javascript %}
// YouTube
"http://www.youtube.com/watch?v=7HKoqNJtMTQ"

// Vimeo
"http://vimeo.com/123123"

// Google Maps
"https://maps.google.com/maps?q=221B+Baker+Street,+London,+United+Kingdom&hl=en&t=v&hnear=221B+Baker+St,+London+NW1+6XE,+United+Kingdom"
{% endhighlight %}

But you can extend it and make it support absolutely any URL or any other service (view [example that adds Dailymotion support](http://codepen.io/dimsemenov/pen/jnohA)). Iframe options:

{% highlight javascript %}
iframe: {
  markup: '<div class="mfp-iframe-scaler">'+
            '<div class="mfp-close"></div>'+
            '<iframe class="mfp-iframe" frameborder="0" allowfullscreen></iframe>'+
          '</div>', // HTML markup of popup, `mfp-close` will be replaced by the close button

  patterns: {
    youtube: {
      index: 'youtube.com/', // String that detects type of video (in this case YouTube). Simply via url.indexOf(index).

      id: 'v=', // String that splits URL in a two parts, second part should be %id%
      // Or null - full URL will be returned
      // Or a function that should return %id%, for example:
      // id: function(url) { return 'parsed id'; } 

      src: '//www.youtube.com/embed/%id%?autoplay=1' // URL that will be set as a source for iframe. 
    },
    vimeo: {
      index: 'vimeo.com/',
      id: '/',
      src: '//player.vimeo.com/video/%id%?autoplay=1'
    },
    gmaps: {
      index: '//maps.google.',
      src: '%id%&output=embed'
    }

    // you may add here more sources

  },

  srcAction: 'iframe_src', // Templating object key. First part defines CSS selector, second attribute. "iframe_src" means: find "iframe" and set attribute "src".
}
{% endhighlight %}



## Inline Type

To create popup from inline element you need to:

1) Create a HTML element that you wish to display in popup and add it somewhere. Class `mfp-hide` is required to hide the popup from the page.

{% highlight html %}
<div id="test-popup" class="white-popup mfp-hide">
  Popup content
</div>
{% endhighlight %}

2) Style this element. Magnific Popup by default doesn't apply any styles to it, except vertical centering (if `alignTop:false`). Close button will be automatically appended inside (if `closeBtnInside:true`).

{% highlight css %}
.white-popup {
  position: relative;
  background: #FFF;
  padding: 20px;
  width: auto;
  max-width: 500px;
  margin: 20px auto;
}
{% endhighlight %}


3) Add button that will open the popup (source must match CSS id of an element (`#test-popup` in our case).

{% highlight html %}
<!-- Like so: -->
<a href="#test-popup" class="open-popup-link">Show inline popup</a>

<!-- Or like so: -->
<a href="mobile-friendly-page.html" data-mfp-src="#test-popup" class="open-popup-link">Show inline popup</a>
{% endhighlight %}

4) Initialize script.

{% highlight javascript %}
$('.open-popup-link').magnificPopup({
  type:'inline',
  midClick: true // Allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source in href.
});
{% endhighlight %}

You can also create popup from an element that is not attached to DOM:

{% highlight javascript %}
$('button').magnificPopup({
  items: {
      src: '<div class="white-popup">Dynamically created popup</div>', // can be a HTML string, jQuery object, or CSS selector
      type: 'inline'
  },
  closeBtnInside: true
});
{% endhighlight %}

I have created two examples on CodePen that will help you better understand how it works:

- [Simple inline popup](http://codepen.io/dimsemenov/pen/GEKgb)
- [Advanced popup with markup and gallery mode](http://codepen.io/dimsemenov/pen/sHoxp)

## Ajax Type      

To create such type of popup, first of define the path to the file that you wish to display and select `ajax` type of the popup. Popup itself should be styled in exactly the same way as an [inline popup type](#inline_type).

**Important note!** The contents of the file that you load is already a popup itself, so there must be **only one root element**. 

{% highlight html %}
<a href="path-to-file.html" class="ajax-popup-link">Show inline popup</a>
{% endhighlight %}

{% highlight javascript %}
$('.ajax-popup-link').magnificPopup({
  type: 'ajax'
});
{% endhighlight %}

Note that path to the file that will be loaded should have the same origin (e.g. be on the same domain), [learn more](http://stackoverflow.com/questions/3076414/ways-to-circumvent-the-same-origin-policy). 

Ajax options:

{% highlight javascript %}
ajax: {
  settings: null, // Ajax settings object that will extend default one - http://api.jquery.com/jQuery.ajax/#jQuery-ajax-settings
  // For example:
  // settings: {cache:false, async:false}

  cursor: 'mfp-ajax-cur', // CSS class that will be added to body during the loading (adds "progress" cursor)
  tError: '<a href="%url%">The content</a> could not be loaded.' //  Error message, can contain %curr% and %total% tags if gallery is enabled
}
{% endhighlight %}

To modify content after it's loaded, or to select and show just specific element from loaded file, there is a `parseAjax` callback:

{% highlight javascript %}
callbacks: {
  parseAjax: function(jqXHR) {
    console.log('Loading of ajax content finished. Object:', jqXHR);
    // You can modify value of jqXHR.responseText here. It's used as a content for popup.
    
    // For example, to show just #some-element:
    // jqXHR.responseText = $(jqXHR.responseText).find('#some-element');
  }
}
{% endhighlight %}










## Options

Options should be passed to the initialization code and separated by comma, e.g.:

{% highlight javascript %}
$('.some-link').magnificPopup({ 
  // main options
  disableOn: 400,
  key: 'some-key',
 
  gallery: {
    // options for gallery
    enabled: true
  },
  image: {
    // options for image content type
    titleSrc: 'title'
  }

});
{% endhighlight %}

Options for specific modules are explained in their sections of documentation (e.g. related to text are in <a href="#translating">translating section</a>, related to gallery are in <a href="#gallery">gallery section</a>. Here you can find the list of general options:

### disableOn

<code class="def">null</code>

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



### key

<code class="def">null</code>

"Key" option is a unique identifier of a single or a group of popups with the same structure. If you will not define it, DOM elements will be created and destroyed each time when you open and close popup.

You may (and should) set an equal key to different popups if their markup matches. By markup I mean options that change HTML structure of the popup (e.g. close icon placement and HTML code of it).

For example: you have many popups that show title, some text and button - you may use one key for all of them, so only one instance of this element is created. Same for popup that always contains image and caption.

You can delete cached templates like so:

    // delete template with key "your-key"
    delete $.magnificPopup.instance.popupsCache['your-key'];

    // delete all templates
    $.magnificPopup.instance.popupsCache = {};

  



### midClick

<code class="def">false</code>

If set to `true` lightbox is opened if the user clicked on the middle mouse button. Option works only when you initialize Magnific Popup from DOM element.


### mainClass

<code class="def">empty string</code>

String that contains classes that will be added to the root element of popup wrapper and to dark overlay. For example `"myClass"`, can also contain multiple classes - `'myClassOne myClasTwo'`.

### preloader

<code class="def">true</code>

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


### focus

<code class="def">empty string</code>

String with CSS selector of an element inside popup that should be focused. Ideally it should be the first element of popup that can be focused. For example `'input'` or `'#login-input'`. Leave empty to focus the popup itself.

### closeOnContentClick

<code class="def">false</code>

Close popup when user clicks on content of it. It's recommended to enable this option when you have only image in popup.

### closeBtnInside

<code class="def">false</code>

If enabled, Magnific Popup will put close button inside content of popup, and wrapper will get class `mfp-close-btn-in` (which in default CSS file makes color of it change). If markup of popup item is defined element with class `mfp-close` will be replaced with this button, otherwise close button will be appended directly.

### alignTop

<code class="def">false</code>

If set to `true` popup is aligned to top instead of to center. (basically all this option does is adds `mfp-align-top` CSS class to popup which removes styles that align popup to center).


### fixedContentPos

<code class="def">auto</code>

Options defines how popup content position property. Can be `"auto"`, `true` or `false`.  If set to `true` - fixed position will be used, to `false` - absolute position based on current scroll. If set to `"auto"` popup will automatically disable this option when browser doesn't support fixed position properly.

### fixedBgPos

<code class="def">auto</code>

Same as an option above, but it defines position property of the dark transluscent overlay. If set to `false` - huge tall overlay will be generated that equals height of window to emulate fixed position. It's recommended to set this option to `true` if you animate this dark overlay and content is most likely will not be zoomed, as size of it will be much smaller.

### overflowY

<code class="def">auto</code>

Defines scrollbar of the popup, works as overflow-y CSS property - any <a href="https://developer.mozilla.org/en-US/docs/CSS/overflow-y">CSS acceptable value</a> is allowed (e.g. `auto`, `scroll`, `hidden`). Option is applied only when fixed position is enabled. 

There is no option `overflowX`, but you may easily emulate it just via CSS.

### removalDelay

<code class="def">0</code>

Delay before popup is removed from DOM. Used for the [animation](#animation).

### closeMarkup 

<code class="def">&lt;button title=&quot;%title%&quot; class=&quot;mfp-close&quot;&gt;&lt;i class=&quot;mfp-close-icn&quot;&gt;&amp;times;&lt;/i&gt;&lt;/button&gt;</code>

Markup of close button. %title% will be replaced with option `tClose`.





## Gallery

Basically all galery module does is allows you to switch content of popup and adds navigation arrows. It can switch and mix any types of content, not just images. 

{% highlight javascript %}
gallery: {
  enabled: false, // set to true to enable gallery

  preload: [0,2], // read about this option in next Lazy-loading section

  navigateByImgClick: true,

  arrowMarkup: '<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>', // markup of an arrow button

  tPrev: 'Previous (Left arrow key)', // title for left button
  tNext: 'Next (Right arrow key)', // title for right button
  tCounter: '<span class="mfp-counter">%curr% of %total%</span>' // markup of counter
}
{% endhighlight %}


### Lazy-loading

Lazy-loading option preloads nearby items. It accepts array with two integers, first one - is a number of items to preload before the current, second one - the number of images to preload after the current. For example `preload: [1,3]` will load 3 next items and 1 that is before current. These values are automatically switched based on direction of movement. 


By default all what it does is just searches for an image tag and preloads it with JavaScript. But you can extend it and do your custom preloading logic with help of `lazyLoad` event, like so:

{% highlight javascript %}
callbacks: {
  lazyLoad: function(item) {
    console.log(item); // Magnific Popup data object that should be loaded
  }
}
{% endhighlight %}

"Preload" option can be changed dynamically. To disable it set `preload:0`.


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


## Retina

"Retina" module allows you to display high-resolution images on high-dpi screens with different `devicePixelRatio`. Module works only with "image" type and only when `window.devicePixelRatio > 1`.
 
First of prepare two sets of images. Default supported syntax requires `@2x` at the end of the image file name, e.g.: `image.jpg` > `image@2x.jpg`. Then initialize popup as usual and add `ratio` in retina set of options.

{% highlight html %}
<a href="image.jpg" class="image-link">Open popup</a>
{% endhighlight %}

{% highlight javascript %}
// Initialize popup as usual
$('.image-link').magnificPopup({ 
  type: 'image',

  retina: {
    ratio: 1, // Increase this number to enable retina image support.
    // Image in popup will be scaled down by this number.
    // Option can also be a function which should return a number (in case you support multiple ratios). For example:
    // ratio: function() { return window.devicePixelRatio === 1.5 ? 1.5 : 2  }
    

    replaceSrc: function(item, ratio) {
      return item.src.replace(/\.\w+$/, function(m) { return '@2x' + m; });
    } // function that changes image source
  }

});
{% endhighlight %}

View [example of retina popup on CodePen](http://codepen.io/dimsemenov/pen/Dohka).



## API


### Events

Callbacks that are defined inside `callbacks` option will automatically be called. Besides that, all Magnific Popup events are also dispatched using `triggerHandler` on target element (or to document if the element doesn't exist). 

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

// Alternative method: using events
// Name of event should start from  `mfp` and the first letter should be uppercase. 
// e.g. 'open' becomes 'mfpOpen', 'beforeOpen' becomes 'mfpBeforeOpen'.
$('.image-link').on('mfpOpen', function(e /*, params */) {
  console.log('Popup opened');
});
{% endhighlight %}

List of callbacks:

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
  updateStatus: function(data) {
    console.log('Status changed', data);
    // "data" is an object that has two properties:
    // "data.status" - current status type, can be "loading", "error", "ready"
    // "data.text" - text that will be displayed (e.g. "Loading...")
    // you may modify this properties to change current status or its text dynamically
  },
  elementParse: function(item) {
    console.log('Parsing element:', item);
    // triggers only once for each item
    // here you may modify URL, type, or any other data
  },  

  // Only for ajax
  parseAjax: function(jqXHR) {
    console.log('Loading of ajax content finished. Object:', jqXHR);
    // Allows you modify value of jqXHR.responseText here. It's used as content for popup.
    // jqXHR.responseText can be a String or a jQuery object
  }
}
{% endhighlight %}



### Public methods


{% highlight javascript %}
// Open popup immediately
$.magnificPopup.open({
  items: {
    src: 'someimage.jpg'
  },
  type: 'image'

  // You may add options here, they're exactly the same as for $.fn.magnificPopup call
  // Note that some settings that rely on click event (like disableOn or midClick) will not work here
});

// Close popup that is currently opened
$.magnificPopup.close();



/* 
  Methods below don't have shorthand like "open" and "close".
  They should be called through "instance" object.
  "instance" is available only when at least one popup was opened.
  For example: $.magnificPopup.instance.doSomething();
*/

var magnificPopup = $.magnificPopup.instance;

// Close the current popup
magnificPopup.close();

// Navigation when gallery is enabled
magnificPopup.next(); // go to next item
magnificPopup.prev(); // go to prev item


// Update status of popup
// First param: status type, can be: 'loading', 'error' or 'ready'.
// Second param: message that will be displayed.  
magnificPopup.updateStatus('loading', 'The loading text...'); 
{% endhighlight %}



### Public properties

Most properties are available only after the popup is opened. Here are listed only most used, there is much bigger list. If you think that something should be added here - please commit to docs on GitHub.

{% highlight javascript %}
var magnificPopup = $.magnificPopup.instance;


magnificPopup.items // array that holds data for popup items
magnificPopup.currItem // data for current item
magnificPopup.index // current item index (integer)


magnificPopup.bgOverlay // transluscent overlay
magnificPopup.wrap // container that holds all controls and contentContainer
magnificPopup.contentContainer // container that holds popup content, child of wrap

{% endhighlight %}

## Translating

Internationalization of Magnific Popup is very simple, all you need is to extend default settings object with new values, or just pass options to your initialization code. If you're making some public plugin or theme, it's strongly recommended to use only second method to avoid conflicts.

Some properties contain %keys% that should not be translated, but may be reordered or removed. 

{% highlight javascript %}
// Add it after jquery.magnific-popup.js and before first initialization code
$.extend(true, $.magnificPopup.defaults, {
  tClose: 'Close (Esc)', // Alt text on close button
  tLoading: 'Loading...', // Text that is displayed during loading. Can contain %curr% and %total% keys
  gallery: {
    tPrev: 'Previous (Left arrow key)', // Alt text on left arrow
    tNext: 'Next (Right arrow key)', // Alt text on right arrow
    tCounter: '%curr% of %total%' // Markup for "1 of 7" counter
  },
  image: {
    tError: '<a href="%url%">The image</a> could not be loaded.' // Error message when image could not be loaded
  },
  ajax: {
    tError: '<a href="%url%">The content</a> could not be loaded.' // Error message when ajax request failed
  }
});
{% endhighlight %}

Same thing, but applied only to specific slider:

{% highlight javascript %}
$('.some-button').magnificPopup({
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

  // surely, you may add other options here

});
{% endhighlight %}

## FAQ

Nothing in FAQ yet. If you think that something should be added, please submit <a href="https://github.com/dimsemenov/Magnific-Popup/blob/master/website/documentation.md">commit to documentation on GitHub</a>.
