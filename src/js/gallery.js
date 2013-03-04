
$.magnificPopup.registerModule('gallery', {

	options: {
		enabled: false,
		arrowMarkup: '<button title="%title%" class="mfp-arrow mfp-arrow-%dir%"><span><i></i></span></button>',
		preload: [0,1], // will preload previous image and next three. can be chaged dynamically.
		swipe: true,

		tPrev: 'Previous (Left arrow key)',
		tNext: 'Next (Right arrow key)',
		tCounter: '%curr% of %total%'
	},

	proto: {
		initGallery: function() {

			var gSt = mfp.st.gallery,
				ns = '.gallery';
			mfp.direction = true; // true - next, false - prev
			
			if(gSt && gSt.enabled ) {
				mfp.wrap.addClass('mfp-gallery');

				mfp.on('Open'+ns, function() {

					mfp.wrap.on('click', 'img', function() {
						mfp.next();
						return false;
					});

					mfp.doc.on('keydown.mfp-gallery', function(e) {
						if (e.keyCode === 37) {
							mfp.prev();
						} else if (e.keyCode === 39) {
							mfp.next();
						}
					});
					if(mfp.st.gallery.swipe) {
						mfp.addSwipeGesture();
					}
				});

				mfp.on('Change'+ns, function(e, data) {

					var tVar = '%title%';

					if(mfp._preloadTimeout) clearTimeout(mfp._preloadTimeout);

					mfp._preloadTimeout = setTimeout(function() {
						mfp.preloadNearbyImages();
					}, 16);
					
					mfp.counterHTML = gSt.tCounter
										.replace(tVar, data.title || '')
										.replace('%curr%', mfp.index + 1)
										.replace('%total%', mfp.items.length);					

					if(!mfp.counter) {
						mfp.counter = mfp._getEl('counter');
						var markup = mfp.st.gallery.arrowMarkup;
						mfp.arrowLeft = $( markup.replace(tVar, gSt.tPrev).replace('%dir%', 'left') ).click(function() {
							mfp.prev();
							return false;
						});							

						mfp.arrowRight = $( markup.replace(tVar, gSt.tNext).replace('%dir%', 'right') ).click(function() {
							e.preventDefault();
							mfp.next();
							return false;
						});
						mfp.container.append(mfp.counter, mfp.arrowLeft, mfp.arrowRight);
					}

					mfp.counter.html(mfp.counterHTML);
				});

				mfp.on('Close'+ns, function() {
					mfp.win.off(mfp._tStart + ' ' + mfp._tMove + ' ' + mfp._tEnd + ' ' + mfp._tCancel);
					mfp.doc.off('.mfp-gallery');
					mfp.counter = null;
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
					if(!mfp.parsedItems[index] || !mfp.parsedItems[index].rendered) {
						mfp.setItemHTML(index, true);
					}
				},
				p = mfp.st.gallery.preload,
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






		addSwipeGesture: function() {
			var startX,
				moved,
				multipleTouches;

			var namespace = '.mfp',
				addEventNames = function(pref, down, move, up, cancel) {
					mfp._tStart = pref + down + namespace;
					mfp._tMove = pref + move + namespace;
					mfp._tEnd = pref + up + namespace;
					mfp._tCancel = pref + cancel + namespace;
				};

			if(window.navigator.msPointerEnabled) {
				addEventNames('MSPointer', 'Down', 'Move', 'Up', 'Cancel');
			} else if('ontouchstart' in window) {
				addEventNames('touch', 'start', 'move', 'end', 'cancel');
			} else {
				return;
			}


			mfp.win.on(mfp._tStart, function(e) {
				var oE = e.originalEvent;
				multipleTouches = moved = false;
				startX = oE.pageX || oE.changedTouches[0].pageX;
			}).on(mfp._tMove, function(e) {
				if(e.originalEvent.touches.length > 1) {
					multipleTouches = e.originalEvent.touches.length;
				} else {
					e.preventDefault();
					moved = true;
				}
			}).on(mfp._tEnd + ' ' + mfp._tCancel, function(e) {
				if(moved && !multipleTouches) {
					var oE = e.originalEvent,
						diff = startX - (oE.pageX || oE.changedTouches[0].pageX);

					if(diff > 20) {
						mfp.next();
					} else if(diff < -20) {
						mfp.prev();
					}
				}
			});
		},


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
