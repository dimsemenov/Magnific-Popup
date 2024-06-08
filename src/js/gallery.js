/**
 * Get looped index depending on number of slides
 */
var _getLoopedId = function(index) {
		var numSlides = mfp.items.length;
		if(index > numSlides - 1) {
			return index - numSlides;
		} else  if(index < 0) {
			return numSlides + index;
		}
		return index;
	},
	_replaceCurrTotal = function(text, curr, total) {
		return text.replace(/%curr%/gi, curr + 1).replace(/%total%/gi, total);
	};

$.magnificPopup.registerModule('gallery', {

	options: {
		enabled: false,
		arrowMarkup: '<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>',
		preload: [0,2],
		navigateByImgClick: true,
		arrows: true,

		tPrev: 'Previous (Left arrow key)',
		tNext: 'Next (Right arrow key)',
		tCounter: '%curr% of %total%',
		
		langDir: null,
		loop: true,
	},

	proto: {
		initGallery: function() {

			var gSt = mfp.st.gallery,
				ns = '.mfp-gallery';

			mfp.direction = true; // true - next, false - prev

			if(!gSt || !gSt.enabled ) return false;
			
			if (!gSt.langDir) {
				gSt.langDir = document.dir || 'ltr';
			}

			_wrapClasses += ' mfp-gallery';

			_mfpOn(OPEN_EVENT+ns, function() {

				if(gSt.navigateByImgClick) {
					mfp.wrap.on('click'+ns, '.mfp-img', function() {
						if(mfp.items.length > 1) {
							mfp.next();
							return false;
						}
					});
				}

				_document.on('keydown'+ns, function(e) {
					if (e.keyCode === 37) {
						if (gSt.langDir === 'rtl') mfp.next();
						else mfp.prev();
					} else if (e.keyCode === 39) {
						if (gSt.langDir === 'rtl') mfp.prev();
						else mfp.next();
					}
				});

				mfp.updateGalleryButtons();

			});

			_mfpOn('UpdateStatus'+ns, function(/*e, data*/) {
				mfp.updateGalleryButtons();
			});

			_mfpOn('UpdateStatus'+ns, function(e, data) {
				if(data.text) {
					data.text = _replaceCurrTotal(data.text, mfp.currItem.index, mfp.items.length);
				}
			});

			_mfpOn(MARKUP_PARSE_EVENT+ns, function(e, element, values, item) {
				var l = mfp.items.length;
				values.counter = l > 1 ? _replaceCurrTotal(gSt.tCounter, item.index, l) : '';
			});

			_mfpOn('BuildControls' + ns, function() {
				if(mfp.items.length > 1 && gSt.arrows && !mfp.arrowLeft) {

					var arrowLeftDesc, arrowRightDesc, arrowLeftAction, arrowRightAction;

					if (gSt.langDir === 'rtl') {
						arrowLeftDesc = gSt.tNext;
						arrowRightDesc = gSt.tPrev;
						arrowLeftAction = 'next';
						arrowRightAction = 'prev';
					} else {
						arrowLeftDesc = gSt.tPrev;
						arrowRightDesc = gSt.tNext;
						arrowLeftAction = 'prev';
						arrowRightAction = 'next';
					}

					var markup     = gSt.arrowMarkup,
					    arrowLeft  = mfp.arrowLeft = $( markup.replace(/%title%/gi, arrowLeftDesc).replace(/%action%/gi, arrowLeftAction).replace(/%dir%/gi, 'left') ).addClass(PREVENT_CLOSE_CLASS),
					    arrowRight = mfp.arrowRight = $( markup.replace(/%title%/gi, arrowRightDesc).replace(/%action%/gi, arrowRightAction).replace(/%dir%/gi, 'right') ).addClass(PREVENT_CLOSE_CLASS);

					if (gSt.langDir === 'rtl') {
						mfp.arrowNext = arrowLeft;
						mfp.arrowPrev = arrowRight;
					} else {
						mfp.arrowNext = arrowRight;
						mfp.arrowPrev = arrowLeft;
					}

					arrowLeft.on('click', function() {
						if (gSt.langDir === 'rtl') mfp.next();
						else mfp.prev();
					});
					arrowRight.on('click', function() {
						if (gSt.langDir === 'rtl') mfp.prev();
						else mfp.next();
					});

					mfp.container.append(arrowLeft.add(arrowRight));

				}
			});

			_mfpOn(CHANGE_EVENT+ns, function() {
				if(mfp._preloadTimeout) clearTimeout(mfp._preloadTimeout);

				mfp._preloadTimeout = setTimeout(function() {
					mfp.preloadNearbyImages();
					mfp._preloadTimeout = null;
				}, 16);
			});


			_mfpOn(CLOSE_EVENT+ns, function() {
				_document.off(ns);
				mfp.wrap.off('click'+ns);
				mfp.arrowRight = mfp.arrowLeft = null;
			});

		},
		next: function() {
			var newIndex = _getLoopedId(mfp.index + 1);
			if (!mfp.st.gallery.loop && newIndex === 0 ) return false;
			mfp.direction = true;
			mfp.index = newIndex;
			mfp.updateItemHTML();
		},
		prev: function() {
			var newIndex = mfp.index - 1;
			if (!mfp.st.gallery.loop && newIndex < 0) return false;
			mfp.direction = false;
			mfp.index = _getLoopedId(newIndex);
			mfp.updateItemHTML();
		},
		goTo: function(newIndex) {
			mfp.direction = (newIndex >= mfp.index);
			mfp.index = newIndex;
			mfp.updateItemHTML();
		},
		preloadNearbyImages: function() {
			var p = mfp.st.gallery.preload,
				preloadBefore = Math.min(p[0], mfp.items.length),
				preloadAfter = Math.min(p[1], mfp.items.length),
				i;

			for(i = 1; i <= (mfp.direction ? preloadAfter : preloadBefore); i++) {
				mfp._preloadItem(mfp.index+i);
			}
			for(i = 1; i <= (mfp.direction ? preloadBefore : preloadAfter); i++) {
				mfp._preloadItem(mfp.index-i);
			}
		},
		_preloadItem: function(index) {
			index = _getLoopedId(index);

			if(mfp.items[index].preloaded) {
				return;
			}

			var item = mfp.items[index];
			if(!item.parsed) {
				item = mfp.parseEl( index );
			}

			_mfpTrigger('LazyLoad', item);

			if(item.type === 'image') {
				item.img = $('<img class="mfp-img" />').on('load.mfploader', function() {
					item.hasSize = true;
				}).on('error.mfploader', function() {
					item.hasSize = true;
					item.loadError = true;
					_mfpTrigger('LazyLoadError', item);
				}).attr('src', item.src);
			}


			item.preloaded = true;
		},

		/**
		 * Show/hide the gallery prev/next buttons if we're at the start/end, if looping is turned off
		 * Added by Joloco for Veg
		 */
		updateGalleryButtons: function() {

			if ( !mfp.st.gallery.loop && typeof mfp.arrowPrev === 'object' && mfp.arrowPrev !== null) {

				if (mfp.index === 0) mfp.arrowPrev.hide();
				else mfp.arrowPrev.show();

				if (mfp.index === (mfp.items.length - 1)) mfp.arrowNext.hide();
				else mfp.arrowNext.show();

			}

		},

	}

});
