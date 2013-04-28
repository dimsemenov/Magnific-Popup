# Magnific Popup GitHub Repository

Fast, light and responsive lightbox plugin. Demos are on [official site](http://dimsemenov.com/plugins/magnific-popup/), [http://dimsemenov.com/plugins/magnific-popup/documentation.html](documentation and getting started guide) too.

Project is under development, please wait until I finish it.

## About this repository:

- Generated popup JS and CSS files are in folder `dist/`.
- Source files are in folder `src/` (edit them if you wish to submit commit).
- Website (examples & documentation) is in folder `website/`.
- Documentation page itself is in `website/documentation.md` (contributions to it are very welcome).

## Build 

To compile Magnific Popup by yourself:

1) Copy repository

	git clone https://github.com/dimsemenov/Magnific-Popup.git

2) Install grunt globally (if you haven't yet)

	npm install -g grunt-cli

3) Go inside Magnific Popup folder and install Node dependencies

	cd Magnific-Popup && npm install

4) Make sure you that you have grunt installed by testing:

	grunt -version

5) Now simply run `grunt` to generate JS and CSS in folder `dist` and site in folder `_site/`.

	grunt

(Optionally run `grunt watch` to automatically regenerate '_site' when you change files in `src/` or in `website/`).

## License

Script is MIT licensed and free and will always be kept this way. But has a small restriction from me - please do not create public WordPress plugin based on it(or at least contact me before creating it), because I will make it and it'll be open source too ([want to get notified?](http://dimsemenov.com/subscribe.html)).

Created by [@dimsemenov](http://twitter.com/dimsemenov).