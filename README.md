# Magnific Popup Repository

[![Build Status](https://travis-ci.org/dimsemenov/Magnific-Popup.png)](https://travis-ci.org/dimsemenov/Magnific-Popup)

Fast, light and responsive lightbox plugin, for jQuery and Zepto.js.

- [Documentation and getting started guide](http://dimsemenov.com/plugins/magnific-popup/documentation.html).
- [Examples and plugin home page](http://dimsemenov.com/plugins/magnific-popup/).
- More examples in [CodePen collection](http://codepen.io/collection/nLcqo).

Optionally, install via Bower: `bower install magnific-popup`.
[Ruby gem](https://rubygems.org/gems/magnific-popup-rails), `gem install magnific-popup-rails`.

## Extensions

- WordPress plugin - [under development](http://dimsemenov.com/plugins/magnific-popup/wordpress.html).
- [Drupal module](https://drupal.org/project/magnific_popup).
- [Concrete5 add-on](https://github.com/cdowdy/concrete5-Magnific-Popup).
- [Redaxo add-on](http://www.redaxo.org/de/download/addons/?addon_id=1131).

If you created an extension for some CMS, email me and I'll add it to this list.

## Location of stuff

- Generated popup JS and CSS files are in folder [dist/](https://github.com/dimsemenov/Magnific-Popup/tree/master/dist). (Online build tool is on [documentation page](http://dimsemenov.com/plugins/magnific-popup/documentation.html)).
- Source files are in folder [src/](https://github.com/dimsemenov/Magnific-Popup/tree/master/src). They include [Sass CSS file](https://github.com/dimsemenov/Magnific-Popup/blob/master/src/css/main.scss) and js parts (edit them if you wish to submit commit). 
- Website (examples & documentation) is in folder [website/](https://github.com/dimsemenov/Magnific-Popup/tree/master/website).
- Documentation page itself is in [website/documentation.md](https://github.com/dimsemenov/Magnific-Popup/blob/master/website/documentation.md) (contributions to it are very welcome).



## Using Magnific Popup?

If you used Magnific Popup in some interesting way, or on site of popular brand, I'd be very grateful if you <a href="mailto:diiiimaaaa@gmail.com?subject="Site that uses Magnific Popup"">shoot me</a> a link to it.


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



## [Changelog](https://github.com/dimsemenov/Magnific-Popup/releases)

## License

Script is MIT licensed and free and will always be kept this way. But has a small restriction from me - please do not create public WordPress plugin based on it(or at least contact me before creating it), because I will make it and it'll be open source too ([want to get notified?](http://dimsemenov.com/subscribe.html)).

Created by [@dimsemenov](http://twitter.com/dimsemenov) & [contributors](https://github.com/dimsemenov/Magnific-Popup/contributors).

[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/dimsemenov/magnific-popup/trend.png)](https://bitdeli.com/free "Bitdeli Badge")
