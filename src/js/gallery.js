
$.magnificPopup.registerModule('gallery', {

	options: {
		enabled: false,
		arrowMarkup: '<button title="%title%" class="mfp-arrow mfp-arrow-%dir%"></button>',
		preload: [0,1], // will preload previous image and next three. can be chaged dynamically.
		//swipe: true,

		tPrev: 'Previous (Left arrow key)',
		tNext: 'Next (Right arrow key)',
		tCounter: '<span class="mfp-counter">%curr% of %total%</span>',
		tLoading: 'Loading image #%curr% of %total%' // Custom loading text for gallery

		//tCounter: '%curr% of %total%'
	},



	// <div class="mfp-b"></div><div class="mfp-a"></div>

	proto: {
		initGallery: function() {

			var gSt = mfp.st.gallery,
				ns = '.gallery';
			mfp.direction = true; // true - next, false - prev
			
			if(gSt && gSt.enabled ) {
				mfp.wrap.addClass('mfp-gallery');


				_mfpOn(OPEN_EVENT+ns, function() {

					mfp.wrap.on(CLICK_EVENT, 'img', function() {
						mfp.next();
						return false;
					});

					_document.on('keydown.mfp-gallery', function(e) {
						if (e.keyCode === 37) {
							mfp.prev();
						} else if (e.keyCode === 39) {
							mfp.next();
						}
					});
					// if(mfp.st.gallery.swipe) {
					// 	mfp.addSwipeGesture();
					// }
				});

				_mfpOn(MARKUP_PARSE_EVENT+ns, function(e, element, values, item) {
					values.title += gSt.tCounter.replace('%curr%', item.index + 1).replace('%total%', mfp.items.length);
				});

				_mfpOn(CHANGE_EVENT+ns, function(e, data) {

					var tVar = '%title%';

					if(mfp._preloadTimeout) clearTimeout(mfp._preloadTimeout);

					mfp._preloadTimeout = setTimeout(function() {
						mfp.preloadNearbyImages();
						mfp._preloadTimeout = null;
					}, 16);		

					if(!mfp.arrowLeft) {
						//mfp.counter = _getEl('counter');
						var markup = mfp.st.gallery.arrowMarkup;
						var arrowLeft = mfp.arrowLeft = $( markup.replace(tVar, gSt.tPrev).replace('%dir%', 'left') ).on(CLICK_EVENT, function() {
							mfp.prev();
							return false;
						});							

						var arrowRight = mfp.arrowRight = $( markup.replace(tVar, gSt.tNext).replace('%dir%', 'right') ).on(CLICK_EVENT, function() {
							e.preventDefault();
							mfp.next();
							return false;
						});

						// Polyfill for :before and :after (adds elements with classes mfp-a and mfp-b)
						if(mfp.isIE7) {
							_getEl('b', arrowLeft[0], false, true);
							_getEl('a', arrowLeft[0], false, true);
							_getEl('b', arrowRight[0], false, true);
							_getEl('a', arrowRight[0], false, true);
						}

						mfp.container.append(mfp.counter, arrowLeft, arrowRight);
					}

				});

				_mfpOn(CLOSE_EVENT+ns, function() {
					//_window.off(mfp._tStart + ' ' + mfp._tMove + ' ' + mfp._tEnd + ' ' + mfp._tCancel);
					_document.off('.mfp-gallery');
					mfp.arrowRight = mfp.arrowLeft = null;
				});

			}

		}, 

		next: function() {
			mfp.direction = true ;
			mfp.index = mfp._getId(mfp.index + 1);
			mfp.setItemHTML( mfp.index, mfp.contentContainer );
		},

		prev: function() {
			mfp.direction = false;
			mfp.index = mfp._getId(mfp.index - 1);
			mfp.setItemHTML( mfp.index, mfp.contentContainer );
		},


		

		preloadNearbyImages: function() {
			var preload = function(index) {
					index = mfp._getId(index);
					if(!mfp.items[index].preloaded) {


						var item = mfp.items[index];
						if(!item.parsed) {
							item = mfp.parseEl( index );
						}
						item.preloaded = true;

						if(item.type === 'image') {
							item.img = $('<img class="mfp-img" />').on('load.mfploader', function() {
								item.hasSize = true;
							}).on('error.mfploader', function() {
								item.hasSize = true;
								item.loadError = true;
							}).attr('src', item.src);
						}
					}
				},
				p = [0,1],//mfp.st.gallery.preload,
				preloadBefore = Math.min(p[0], mfp.items.length),
				preloadAfter = Math.min(p[1], mfp.items.length),
				i;

			for(i = 1; i <= (mfp.direction ? preloadAfter : preloadBefore); i++) {
				preload(mfp.index+i);
			}
			for(i = 1; i <= (mfp.direction ? preloadBefore : preloadAfter); i++) {
				preload(mfp.index-i);
			}
		},






		// addSwipeGesture: function() {
		// 	var startX,
		// 		moved,
		// 		multipleTouches;

		// 		return;

		// 	var namespace = '.mfp',
		// 		addEventNames = function(pref, down, move, up, cancel) {
		// 			mfp._tStart = pref + down + namespace;
		// 			mfp._tMove = pref + move + namespace;
		// 			mfp._tEnd = pref + up + namespace;
		// 			mfp._tCancel = pref + cancel + namespace;
		// 		};

		// 	if(window.navigator.msPointerEnabled) {
		// 		addEventNames('MSPointer', 'Down', 'Move', 'Up', 'Cancel');
		// 	} else if('ontouchstart' in window) {
		// 		addEventNames('touch', 'start', 'move', 'end', 'cancel');
		// 	} else {
		// 		return;
		// 	}


		// 	_window.on(mfp._tStart, function(e) {
		// 		var oE = e.originalEvent;
		// 		multipleTouches = moved = false;
		// 		startX = oE.pageX || oE.changedTouches[0].pageX;
		// 	}).on(mfp._tMove, function(e) {
		// 		if(e.originalEvent.touches.length > 1) {
		// 			multipleTouches = e.originalEvent.touches.length;
		// 		} else {
		// 			//e.preventDefault();
		// 			moved = true;
		// 		}
		// 	}).on(mfp._tEnd + ' ' + mfp._tCancel, function(e) {
		// 		if(moved && !multipleTouches) {
		// 			var oE = e.originalEvent,
		// 				diff = startX - (oE.pageX || oE.changedTouches[0].pageX);

		// 			if(diff > 20) {
		// 				mfp.next();
		// 			} else if(diff < -20) {
		// 				mfp.prev();
		// 			}
		// 		}
		// 	});
		// },


		/**
		 * Looped index depending on number of slides
		 * @param  {int} index 
		 * @return {int}       
		 */
		_getId: function(index) {
			var numSlides = this.items.length;
			if(index > numSlides - 1) {
				return index - numSlides;
			} else  if(index < 0) {
				return numSlides + index;
			}
			return index;
		}
	}
});
