# Magnific Popup Repository

Fast, light and responsive lightbox plugin, for jQuery and Zepto.js.

- [Documentation and getting started guide](http://dimsemenov.com/plugins/magnific-popup/documentation.html)
- [Examples and plugin home page](http://dimsemenov.com/plugins/magnific-popup/)
- More examples in official [CodePen collection](http://codepen.io/collection/nLcqo). Feel free to [email me](http://dimsemenov.com) more pen's with unusual usage of the script.

Optionally, install via Bower: `bower install magnific-popup`.

## Location of stuff

- Generated popup JS and CSS files are in folder [dist/](https://github.com/dimsemenov/Magnific-Popup/tree/master/dist). (Online build tool is on [documentation page](http://dimsemenov.com/plugins/magnific-popup/documentation.html)).
- Source files are in folder [src/](https://github.com/dimsemenov/Magnific-Popup/tree/master/src). They include [Sass CSS file](https://github.com/dimsemenov/Magnific-Popup/blob/master/src/css/main.scss) and js parts (edit them if you wish to submit commit). 
- Website (examples & documentation) is in folder [website/](https://github.com/dimsemenov/Magnific-Popup/tree/master/website).
- Documentation page itself is in [website/documentation.md](https://github.com/dimsemenov/Magnific-Popup/blob/master/website/documentation.md) (contributions to it are very welcome).

## Build 

To compile Magnific Popup by yourself, first of make sure that you have [Node.js](http://nodejs.org/), [Grunt.js](https://github.com/cowboy/grunt), [Ruby](http://www.ruby-lang.org/) and [Jekyll](https://github.com/mojombo/jekyll/) installed, then:

1) Copy repository

	git clone https://github.com/dimsemenov/Magnific-Popup.git

2) Go inside Magnific Popup folder that you fetched and install Node dependencies

	cd Magnific-Popup && npm install

3) Now simply run `grunt` to generate JS and CSS in folder `dist` and site in folder `_site/`.

	grunt

Optionally:

- Run `grunt watch` to automatically rebuild script when you change files in `src/` or in `website/`.
- If you don't have and don't want to install Jekyll, run `grunt nosite` to just build JS and CSS files related to popup in `dist/`.


## Changelog

### 0.9.5 (Aug 21, 2013)

- Fixed bug: built-in tab focus in popup works incorrectly (caused by 0.9.3 update).

### 0.9.4 (Aug 7, 2013)

- Fixed bug: error in IE7 when minified version of script is used with some versions of jQuery, #156.
- Fixed bug: DOM exception in Chrome when using gallery mode with some versions of jQuery, #177.

### 0.9.3 (Jul 16, 2013)

- Fixed blurry arrows in FF (#142)
- Added `lazyLoadError` callback.
- Popup now prevents closing if the clicked element is remvoved from DOM.
- `overflow:hidden` is now applied to `html` instead of `body`.
- Increased default z-index to from 500 to 1040.

### 0.9.2 (Jul 5, 2013)

- Fixed bug in new zoom module, that could cause incorrect calculation of image height, when jQuery is used instead of Zepto.

### 0.9.1 (Jul 4, 2013)

- Added zoom module effect for images, go to Magnific Popup [website](http://dimsemenov.com/plugins/magnific-popup/) to view demos. More info in [docs](http://dimsemenov.com/plugins/magnific-popup/documentation.html#zoom_effect).
- `removalDelay` now applies only when browser supports CSS transitions.
- Fix: removed tiny blink when switching between gallery images, or opening images that are already cached.
- Changed the default appearance of gallery arrows (now its white triangle with black border, was vice-versa).
- Added solid background to the image when its loading.




### 0.9.0 (Jul 3, 2013)

- Added `modal` option which disables all default ways to close the popup, learn more in [docs](http://dimsemenov.com/plugins/magnific-popup/documentation.html#modal). Thanks to [Julen Ruiz Aizpuru](https://github.com/julen).
- Added `beforeClose` event.
- Added `imageLoadComplete` event.
- Removed jQuery event alias calls. Thanks to [Albert Casademont](https://github.com/acasademont).
- Cleaned some duplicate styles in CSS. Thanks to [Yann Abgrall](https://github.com/yannabgrall).

### 0.8.9 (Jun 4, 2013)

- Fix: inline element that is created dynamically causes exception in jQuery 1.8.x.
- Fix: incorrect detection of `_hasScrollBar` if body has defined height style.
- Fix: body styles are kept after popup is closed.
- Fix: close icon is aligned incorrectly with iframe type.
- **responseText is deprected**. Argument of callback `parseAjax` - `obj.responseText` is now deprected, but you can still access it via `obj.xhr.responseText`. Instead of it, please use `obj.data` to modify your output.
- Sass: changed variables to be default declarations to support front-loaded settings. i.e. You can override options by adding `_settings.scss` file near `main.scss` with your new options.
- Added: `afterClose` event.
- Added: `ajaxContentLoaded` event.
- Added: [Bower](https://github.com/bower/bower) support.

### 0.8.8 (May 24, 2013)

- Fix: you can now put link inside popup that will open another popup - http://codepen.io/dimsemenov/pen/hwIng
- Fix: incorrect index when opening popup that is already opened from multiple DOM elements.

### 0.8.7 (May 19, 2013)

- Fixed #62 - IE9 HTML5 YouTube player playing audio after pop up closed

### 0.8.6 (May 18, 2013)

- Controls are now removed when there is only one element in gallery.
- Fixed issue that could cause incorrect main event element.
- Public property `items` is now always an array (previously it could be jQuery object collection).
- Added `word-break: break-word` to caption.

### 0.8.5 (May 15, 2013)

- Fix #43 - In IE8 whole window becomes black when YouTube iframe is
closed.
- Fix #51 - In IE9 YouTube HTML5 video keeps playing after iframe is
removed from page.
- Bugfix - box-sizing on IMG in low IE behaves incorrectly.
- Fix #57 - padding on body is not added with overflowY:'scroll'.
- removalDelay option is now ignored in IE.
- Added an option closeOnBgClick.
- Added BeforeChange callback.
- Added AfterChange callback.

### 0.8.4 (May 13, 2013)

- You can now call any public method directly from jQuery DOM element, e.g.: `$('.some-el-with-popup').magnificPopup('methodName', /*, arguments */)`. 
- Optimized inline module. Now target element is replaced with placeholder only when it has a defined parent node.
- `inline` type is now set as a default, so you may skip it.
- Now content is just replaced when you call `open()` on popup that is already opened.


### 0.8.3 (May 9, 2013)

- Added: `goTo` public method.
- Custom events that are added to popup are now not lost when navigating through gallery.
- If `delegate` option is used, events are now dispatched on main element instead of children.


### 0.8.2 (May 5, 2013)

- Added !important to mfp-hide class.
- Fix gallery rendering issue in Opera.
- Fix padding to body with overflow:scroll.




## License

Script is MIT licensed and free and will always be kept this way. But has a small restriction from me - please do not create public WordPress plugin based on it(or at least contact me before creating it), because I will make it and it'll be open source too ([want to get notified?](http://dimsemenov.com/subscribe.html)).

Created by [@dimsemenov](http://twitter.com/dimsemenov) & [contributors](https://github.com/dimsemenov/Magnific-Popup/contributors).