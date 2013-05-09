# Magnific Popup GitHub Repository

Fast, light and responsive lightbox plugin, for jQuery and Zepto.js.

- [Documentation and getting started guide](http://dimsemenov.com/plugins/magnific-popup/documentation.html)
- [Examples and plugin home page](http://dimsemenov.com/plugins/magnific-popup/)
- More examples on [CodePen](http://codepen.io/collection/nLcqo). Feel free to email me more CodePen's, I'd gladly add them to this collection.

## About this repository:

- Generated popup JS and CSS files are in folder `dist/`.
- Source files are in folder `src/` (edit them if you wish to submit commit).
- Website (examples & documentation) is in folder `website/`.
- Documentation page itself is in `website/documentation.md` (contributions to it are very welcome).

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

### 0.8.3 (May 9, 2013)

- Added: `goTo` public method.
- Custom events that are added to popup are now not lost when navigating through gallery.
- If `delegate` option is used, events are now dispatched on main element instead of children.


### 0.8.2 (May 5, 2013)

- Added !important to mfp-hide class
- Fix gallery rendering issue in Opera
- Fix padding to body with overflow:scroll




## License

Script is MIT licensed and free and will always be kept this way. But has a small restriction from me - please do not create public WordPress plugin based on it(or at least contact me before creating it), because I will make it and it'll be open source too ([want to get notified?](http://dimsemenov.com/subscribe.html)).

Created by [@dimsemenov](http://twitter.com/dimsemenov).