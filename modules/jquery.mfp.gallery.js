(function($) {
	/**
	 *
	 * Magnific Popup Gallery Module
	 * @version 0.0.1:
	 *
	 */ 
	$.fn.magnificPopup.defaults.gallery = {
		enabled: false,
		arrowMarkup: '<button title="%title%" class="mfp-arrow mfp-arrow-%dir%"><span><i></i></span></button>',
		preload: 0
	};
	$.extend($.magnificPopup.proto, {

		initGallery: function() {
			var self = this;

			self.ev.on('mfpBeforeOpen', function(e, data) {

				var gSt = self.st.gallery;
				if(gSt && (gSt === true || gSt.enabled) ) {
					self.st.gallery = $.extend({}, $.fn.magnificPopup.defaults.gallery, gSt);

					self.ev.one('mfpOpen.gallery', function() {

						self.index = self.currData.index;
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
						if(self.st.gallery.preload > 0)
							self.preloadNearbyImages();
					});
					
					self.ev.on('mfpBeforeContentSet.gallery-controls', function(e, data) {

						self.counterHTML = self.st.txt.counter
											.replace('%of%', self.st.txt.of)
											.replace('%title%', data.title || '')
											.replace('%curr%', data.index + 1)
											.replace('%total%', self.items.length);

						self.ev.trigger('mfpParseCounter'); //allow custom parsing for self.counterHTML
						

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
						self.ev.off('mfpBeforeContentSet.gallery-controls');
						self.wrap.off('click.mfparrow');
						self.counter = null;
					});

				}
				
			});
			

		}, 

		next: function() {
			var self = this;
			if(self.index >= self.items.length - 1) {
				self.index = 0;
			} else {
				self.index++;
			}

			self.currData.el = self.items.eq( self.index );
			self.setItemHTML( self.currData, true );
		},

		prev: function() {
			var self = this;
		
			if(self.index <= 0) {
				self.index = self.items.length - 1;
			} else {
				self.index--;
			}

			self.currData.el = self.items.eq( self.index );
			self.setItemHTML( self.currData, true );
		},

		preloadNearbyImages: function() {
			var self = this,
			//  TODO: make number of images to preload configurable
			//	itemsToLoad = 2,
				img,
				itemData;

			for(var i = 0; i < self.items.length; i++) {
				img = new Image();
				itemData = self.parseEl({el: $(self.items[i]) });

				if(itemData.url)
					img.src = itemData.url;
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
		}
	});
	$.magnificPopup.modules.push( $.magnificPopup.proto.initGallery );
})(window.jQuery || window.Zepto);



