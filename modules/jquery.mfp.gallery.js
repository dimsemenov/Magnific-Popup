/**
 *
 * Magnific Popup Gallery Module
 * @version 0.0.1:
 *
 */
;(function($) {

	"use strict";
	
	$.magnificPopup.defaults.gallery = {
		enabled: false,
		arrowMarkup: '<button title="%title%" class="mfp-arrow mfp-arrow-%dir%"><span><i></i></span></button>',
		preload: [0,1] // will preload previous image and next three. can be chaged dynamically.
	};
	$.extend($.magnificPopup.proto, {

		initGallery: function() {
			var self = this;

			self.ev.on('mfpBeforeOpen', function(e, data) {

				var gSt = self.st.gallery;
				self.direction = true; // true - next, false - prev
				
				if(gSt && (gSt === true || gSt.enabled) ) {
					self.wrap.addClass('mfp-gallery');

					self.st.gallery = $.extend({}, $.magnificPopup.defaults.gallery, gSt);

					self.ev.one('mfpOpen.gallery', function() {

						self.wrap.on('click.mfp-g-next', 'img', function(e) {
							self.next();
							return false;
						});

						self.doc.on('keydown.mfp-gallery', function(e) {
							if (e.keyCode === 37) {
								self.prev();
							} else if (e.keyCode === 39) {
								self.next();
							}
						});

						self.addSwipeGesture();
					});

					self.ev.on('mfpChange.gallery-controls', function(e, data) {


						if(self._preloadTimeout) clearTimeout(self._preloadTimeout);

						self._preloadTimeout = setTimeout(function() {
							self.preloadNearbyImages();
						}, 16);
						
						self.counterHTML = self.st.txt.counter
											.replace('%of%', self.st.txt.of)
											.replace('%title%', data.title || '')
											.replace('%curr%', self.index + 1)
											.replace('%total%', self.items.length);

						self.trigger('mfpParseCounter'); //allow custom parsing for self.counterHTML
						

						if(!self.counter) {
							self.counter = self._getEl('counter');
							var markup = self.st.gallery.arrowMarkup;
							self.arrowLeft = $( markup.replace('%title%', self.st.txt.prev).replace('%dir%', 'left') ).click(function(e) {
								self.prev();
								return false;
							});
							self.arrowRight = $( markup.replace('%title%', self.st.txt.next).replace('%dir%', 'right') ).click(function(e) {
								e.preventDefault();
								self.next();
								return false;
							});
							self.container.append(self.counter, self.arrowLeft, self.arrowRight);
						}

						self.counter.html(self.counterHTML);
					});

					self.ev.one('mfpClose', function() {
						self.win.off(self._tStart + ' ' + self._tMove + ' ' + self._tEnd + ' ' + self._tCancel);
						self.doc.off('.mfp-gallery');
						self.ev.off('mfpChange.gallery-controls');
						self.wrap.off('click.mfparrow');
						self.counter = null;
					});

				}
				
			});
			

		}, 

		next: function() {
			var self = this;
			self.direction = true ;
			self.index = self._getId(self.index + 1);
			self.setItemHTML( self.index, self.contentContainer );
		},

		prev: function() {
			var self = this;
			self.direction = false;
			self.index = self._getId(self.index - 1);
			self.setItemHTML( self.index, self.contentContainer );
		},


		

		preloadNearbyImages: function() {
			var self = this,
				itemsToLoad = 2,
				img,
				itemData;


			var preload = [false,true,true,true];
			

			var preload = function(index) {
				var index = self._getId(index);
				if(!self.parsedItems[index] || !self.parsedItems[index].rendered) {
					self.setItemHTML(index, true);
				}
			};

			var p = self.st.gallery.preload;
			var preloadBefore = Math.min(p[0], self.items.length);
			var preloadAfter = Math.min(p[1], self.items.length);

			for(var i = 1; i <= (self.direction ? preloadAfter : preloadBefore); i++) {
				preload(self.index+i);
			}
			for(var i = 1; i <= (self.direction ? preloadBefore : preloadAfter); i++) {
				preload(self.index-i);
			}
		},






		addSwipeGesture: function() {
			var self = this,
				startX,
				moved,
				multipleTouches;

			var namespace = '.mfp',
				addEventNames = function(pref, down, move, up, cancel) {
					self._tStart = pref + down + namespace;
					self._tMove = pref + move + namespace;
					self._tEnd = pref + up + namespace;
					self._tCancel = pref + cancel + namespace;
				};

			if(window.navigator.msPointerEnabled) {
				addEventNames('MSPointer', 'Down', 'Move', 'Up', 'Cancel');
			} else if('ontouchstart' in window) {
				addEventNames('touch', 'start', 'move', 'end', 'cancel');
			} else {
				return;
			}


			self.win.on(self._tStart, function(e) {
				var oE = e.originalEvent;
				multipleTouches = moved = false;
				startX = oE.pageX || oE.changedTouches[0].pageX;
			}).on(self._tMove, function(e) {
				if(e.originalEvent.touches.length > 1) {
					multipleTouches = e.originalEvent.touches.length;
				} else {
					e.preventDefault();
					moved = true;
				}
			}).on(self._tEnd + ' ' + self._tCancel, function(e) {
				if(moved && !multipleTouches) {
					var oE = e.originalEvent,
						diff = startX - (oE.pageX || oE.changedTouches[0].pageX);

					if(diff > 20) {
						self.next();
					} else if(diff < -20) {
						self.prev();
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
	});
	$.magnificPopup.modules.push( $.magnificPopup.proto.initGallery );
})(window.jQuery || window.Zepto);