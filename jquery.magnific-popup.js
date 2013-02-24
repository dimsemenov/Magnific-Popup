/**
* 
* MagnificPopup | http://dimsemenov.com/magnific
*
* @version 0.0.6:
*
*/
;(function($) {

	"use strict";

	function MagnificPopup() {
		var self = this;


		self.isLowIE = jQuery && $.support.leadingWhiteSpace; // <=IE8
		self.isAndroid = (/android/gi).test(navigator.appVersion);
		self.isIOS = (/iphone|ipad|ipod/gi).test(navigator.appVersion);

		console.log(self.isLowIE);

		// We disable fixed positioned lightbox on devices that don't handle it properly.
		// If you know a better way of doing this - let me know.
		self.probablyMobile = (self.isAndroid || self.isIOS || /Opera Mini|webOS|BlackBerry|Opera Mobi|IEMobile/i.test(navigator.userAgent) );

		self.bodyhtml = $('body, html');
		self.ev = self.win = $(window);
		self.body = $(document.body);
		self.doc = $(document);
		self.types = ['inline']; // built-in is inline
		
		// Initialize modules
		var modules = $.magnificPopup.modules;
		for(var i = 0; i < modules.length; i++) {
			modules[i].call(self);
		}
	}



	MagnificPopup.prototype = {

		constructor: MagnificPopup,

		/**
		 * Updates layout of popup
		 * @param  Boolean force     If set to true forces the resize, no matter if height is changed or not.
		 * @param  Number  winHeight Height of window (optional).
		 */
		resize: function(force, winHeight) {
			var self = this;
			if(self.st.alignTop){
				return;
			} 

			self.wH = winHeight || self.win.height();

			// we resize popup only when height changes
			if(force || self.prevHeight !== self.wH) {
				self.prevHeight = self.wH;
			
				if(self.wH < self.st.minHeight ) {
					self.wH = self.st.minHeight;
				}

				var containerCSS = {
					height: self.wH ,
					lineHeight: self.wH + 'px'
				};
				self.trigger('mfpResize', containerCSS);
				self.container.css(containerCSS);
			}
		}, 



		
		open: function(data) {
			var self = this;
			
			if(!self.isOpen) {
			
				self.isOpen = true;
				self.items = data.items;

				self.currentData = data;
				self.popupID = data.id;

				if(!data.parsedItems) {
					data.parsedItems = [];
				}
				self.parsedItems = data.parsedItems;

				var id = data.el.data('mfp-id');
				if(data.el.data('mfp-id') !== undefined) {
					self.index = id;
				} else {
					self.index = data.items.index( data.el );
				}

				self.st = $.extend({}, $.magnificPopup.defaults, data); 
				self.fixedPosition = self.st.fixedPosition === 'auto' ? !self.probablyMobile : self.st.fixedPosition;
				


				// Dark overlay
				self.bgOverlay = self._getEl('bg').on('click.mfp', function() {
					self.close();
				});


				self.wrap = self._getEl('wrap').attr('tabindex', -1).on('click.mfp', function(e) {
					if(self.st.closeOnContentClick) {
						self.close();
					} else {
						// close popup if click is not on a content
						if( e.target !== self.content[0] && (!self.st.preloader || e.target !== self.preloader[0]) && !$.contains(self.content[0], e.target) ) {
							self.close();
						}
					}
				});


				self.container = self._getEl('container', self.wrap);


				self.trigger('mfpBeforeOpen');


				if(self.st.preloader) {
					self.preloader = self._getEl('preloader', self.container, self.st.txt.loading);
				}

				if(!self.st.closeBtnInside) {
					self.wrap.append( self._getCloseBtn() );
				}
			

				if(self.fixedPosition) {
					self.wrap.css({
						overflow: self.st.overflow,
						overflowX: 'hidden',
						overflowY: self.st.overflow
					});
				} else {
					self.bgOverlay.css({
						height: self.doc.height(),
						position: 'absolute'
					});
					
					self.wrap.css({ 
						top: self.win.scrollTop(),
						position: 'absolute'
					});
				}

				// Window resize
				self.win.on('resize.mfp', function() {
					self.resize();
				});

				// ESC key
				self.doc.on('keyup.mfp', function(e) {
					if(e.keyCode === 27) {
						self.close();
					}
				});


				if(self.st.closeOnContentClick) {
					self.wrap.addClass('mfp-zoom-out');
				}
				

				// this triggers recalculation of layout, so we get it once to not to trigger twice
				self.wH = self.win.height();

				
				var bodyStyles = {};
				if(self.fixedPosition && self._hasScrollBar(self.wH) ) {
					var s = self._getScrollbarSize();
					if(s) {
						bodyStyles.paddingRight = s;
					}
				}

				if(self.fixedPosition) {
					if(!self.isLowIE) {
						bodyStyles.overflow = 'hidden';
					} else {
						self.bodyhtml.css('overflow', 'hidden');
					}
				}

				
				
					
				if(self.st.mainClass) {
					self._addClassToMFP( self.st.mainClass );
				}
					
				

				self.setItemHTML(self.index);
				
				self.body.css(bodyStyles);

				self.resize(true, self.wH);
				self.bgOverlay.add(self.wrap).appendTo( document.body );

				// Save last focused element
				self._lastFocusedEl = document.activeElement;
				//(self.st.focusInput ? self.contentContainer.find(':input').eq(0) : self.wrap).focus();
				
				// We aren't using self.wrap[0].offsetWidth; hack and trading smoothness for speed
				setTimeout(function() {

					if(self.content)
						(self.st.focusInput ? self.content.find(':input').eq(0) : self.wrap).focus();

					self._addClassToMFP('mfp-ready');

					
					// Lock focus on popup
					$(document).on('focusin.mfp', function (e) {
						if( e.target !== self.wrap[0] && !$.contains(self.wrap[0], e.target) ) {
							self.wrap.focus();
							return false;
						}
					});
					self.trigger('mfpOpen');

				}, 16);
			}

		},

		close: function(browserAction) {
			var self = this;

			if(self.isOpen) {
				self.isOpen = false;

				var remove = function() {

					self.trigger('mfpClose', self, browserAction);

					$(document).off('focusin.mfp');

					if(self._lastFocusedEl) {
						$(self._lastFocusedEl).focus(); // put tab focus back
					}
						

					var classesToRemove = 'mfp-removing mfp-ready ';
					self.bgOverlay.remove();
					self.wrap.remove();

					// if cleanup
					if(!self.st.keepReference) {
						var item;
						for(var i = 0; i < self.parsedItems.length; i++) {
							item = self.parsedItems[i];
							if(item && item.type === 'inline'){
								$('.mfp-placeholder-'+self.popupID + '-'+i).replaceWith( item.view.hide() );
							}
						}
						self.parsedItems = null;
						self.currentData.parsedItems = null;
					}

					self.closeBtn = null;
					self.currImg = null;
					self.content = null;


					if(self.st.mainClass) {
						classesToRemove += self.st.mainClass + ' ';
					}
						

					if(self.fixedPosition) {
						var bodyStyles = {paddingRight: 'inherit'};
						if(self.isLowIE) {
							self.bodyhtml.overflow = 'visible';
						} else {
							bodyStyles.overflow = 'visible';
						}
						self.body.css(bodyStyles);
					}

					self._removeClassFromMFP(classesToRemove);


					self.win.off('resize.mfp');
					self.doc.off('keyup.mfp');

					self.prevHeight = 0;
				};

				// for CSS3 animation
				if(self.st.removalDelay)  {
					self._addClassToMFP('mfp-removing');
					setTimeout(function() {
						remove();
					}, self.st.removalDelay);
				} else {
					remove();
				}

			}
		},

		
		// set content of popup
		setItemHTML: function(index, preload, content) {
			var self = this;

			var item = self.parsedItems[index];
			if(!item) {
				self.parsedItems[index] = item = self.parseEl( self.items[index] );
			}

			if(content) {
				item.view = content;
			} else if(!item.view) {
				switch(item.type) {
					case 'inline':
						if(!self.st.keepReference) {
							item.view = $(item.src).replaceWith( self._getEl('mfp-hidden mfp-placeholder-'+self.popupID + '-'+ index) ).detach().show();
						} else {
							item.view = $(item.src).detach().show();
						}
						break;
				}
				self.trigger('mfpContentParse', item);

				// if still there is no view - we terminate
				if(!item.view) {
					return;
				}
			}


			if(item.rendered) {
				self.content.parent().hide();
				item.view.parent().show();		
			} else {
				var contentContainer = self._getEl('content');
				contentContainer.attr('mfp-id', index);
				contentContainer.addClass('mfp-'+item.type+'-content').html(item.view);
				
				if(self.st.closeBtnInside) {
					contentContainer.append( self._getCloseBtn() );
				}

				if(!preload) {
					if(self.content) {
						self.content.parent().hide();
					}
				} else if(!content) {
					contentContainer.hide();
				}

				self.container.append(contentContainer);
				item.rendered = true;
			}

			if(!preload) {
				self.content = item.view;
				self.currItem = item;
				self.trigger('mfpChange', self.parsedItems[self.index]);
			}
		},

		
		// creates Magnific Popup data object
		parseEl: function(item) {
			var self = this,
				el;


			if(item.tagName) {
				el = $(item);
				item = { el: el, parsed: true };
			} else {
				item.parsed = true;
				return item;
			}

			if(item.el) {
				var types = self.types;
				for(var i = 0; i < types.length; i++) {
					if( (self.st.type === types[i] && !item.src) || item.el.hasClass('mfp-'+types[i]) ) {
						item.src = item.el.attr('data-mfp-src');
						if(!item.src) {
							item.src = item.el.attr('href');
						}
						
						item.type = types[i];	
						item.parsed = true;
						break;
					}
				}
			}

			self.ev.trigger('mfpElementParse', item);
			return item;
		},


		/**
		 * Initializes single popup or group of popups
		 * @param el      jQuery DOM element
		 * @param options MFP options
		 */
		gCounter: 0,
		addGroup: function(el, options) {
			var self = this,
				eHandler = function(e) {

					if(e.which !== 2) {

						if( $(window).width() > (options.disableOn !== undefined ? options.disableOn : $.magnificPopup.defaults.disableOn ) ) {
							e.preventDefault();
							options.el = $(this);
							self.open(options);
						}

					}
					
				};

			if(!options) {
				options = {};
			} 

			options.id = self.gCounter++;
			if(options.delegate) {
				options.items = el.find(options.delegate);
				el.off('click.mfp').on('click.mfp', options.delegate , eHandler);
			} else {
				options.items = el;
				el.off('click.mfp').on('click.mfp', eHandler);
			}
		},


		/**
		 * Updates text on preloader
		 * @param  {String}  txt     Preloader text
		 * @param  {Boolean} isError Adds mfp-img-error class if enabled
		 */
		updatePreloader: function(txt, isError) {
			if(this.preloader) {
				this.preloader[isError ? 'addClass' : 'removeClass']('mfp-load-error').html( txt.replace('%url%', this.currItem.src) );
				if(isError) {
					// prevent closing of popup, when link is clicked in preloader text
					this.preloader.find('a').click(function(e) {
						e.stopImmediatePropagation();
					});
				}
			}
		},


		trigger: function(e, data) {
			this.ev.trigger(e, data);
			if(this.st.callbacks) {
				// converts mfpEventName to eventName
				e = e.charAt(3).toLowerCase() + e.slice(4);
				if(this.st.callbacks[e]) {
					this.st.callbacks[e].call(this, data);
				}
			}
		},

		/*
			"Private" helpers
		 */
		_getCloseBtn: function() {
			var self = this;
			if(!self.closeBtn) {
				self.closeBtn = $( self.st.closeMarkup.replace('%title%', self.st.txt.close ) ).click(function(e) {
					e.preventDefault();
					self.close();
				});
			}
			
			return self.closeBtn;
		},
		_addClassToMFP: function(cName) {

			this.bgOverlay.addClass(cName);
			this.wrap.addClass(cName);
		},
		_removeClassFromMFP: function(cName) {
			this.bgOverlay.removeClass(cName);
			this.wrap.removeClass(cName);
		},
		_hasScrollBar: function(winHeight) {
			if(document.body.clientHeight > (winHeight || this.win.height()) ) {
                return true;    
            }
            return false;
		},
		_getEl: function(className, appendTo, html, raw) {
			var el = document.createElement('div');
			el.className = 'mfp-'+className;
			if(html) {
				el.innerHTML = html;
			}
			if(!raw) {
				el = $(el);
				if(appendTo) {
					el.appendTo(appendTo);
				}
			} else if(appendTo) {
				appendTo.appendChild(el);
			}
			return el;
		},
		_getScrollbarSize: function() {
			// from http://davidwalsh.name/detect-scrollbar-width
			// Know lighter solution that doesn't cause reflow? Let me know.
			if(this.scrollbarSize === undefined) {
				var scrollDiv = document.createElement("div");
				scrollDiv.id = "mfp-sbm";
				document.body.appendChild(scrollDiv);

				// Get the scrollbar width
				this.scrollbarSize = scrollDiv.offsetWidth - scrollDiv.clientWidth;

				// Delete the DIV 
				document.body.removeChild(scrollDiv);
			}
			return this.scrollbarSize;
		}

	}; /* MagnificPopup core prototype end */

	

	/**
	 * Public interface
	 */
	$.magnificPopup = {
		instance: null,
		proto: MagnificPopup.prototype,
		modules: [],

		open: function(data) {
			console.log('open');
		},
		close: function() {
			$.magnificPopup.instance.close();
		},



		defaults: {   
			mainClass: '',
			minHeight: 400,
			preloader: true,

			focusInput: false,

			gallery: false,
			disableOn: 600, // Conditional lightbox: property defines on what screen width in pixels should the lightbox be disabled. TODO: add option to pass function instead of number
				
			openOnMidClick: false,	// if middle button clicked - we do nothing, to allow opening images in new window e.t.c
			closeOnContentClick: false,
			

			keepReference: false, 
			// !important option
			// When popup is opened script creates new element and attaches it o DOM. After popup is closed element is detached.
			// This option defines if you want to keep detached element in memory after popup is closed (to not to create it second time).
			// If inline element is used - Popup will not put it where it was after it's closed.

			closeBtnInside: false,

			overlay: true,
		
			animated: false,
			removalDelay: 0,

			alignTop: false,
			
			fixedPosition: 'auto', // "auto", true, false. "Auto" will automatically disable this option when browser doesn't support fixed position properly.
			overflow: 'auto', // CSS property of slider wrap: 'auto', 'scroll', 'hidden'. Doesn't apply when fixedPosition is on.

			
				
			closeMarkup: '<button title="%title%" class="mfp-close"><i class="mfp-close-icn">&times;</i></button>',

			txt: {
				close: 'Close (Esc)',
				prev: 'Previous (Left arrow key)',
				next: 'Next (Right arrow key)',
				counter: '%curr% of %total%',
				loading: 'Loading...',
				imageError: '<a href="%url%">The image</a> could not be loaded'
			}
		}
	};


	$.fn.magnificPopup = function(options) {
		if(!$.magnificPopup.instance) {
			$.magnificPopup.instance = new MagnificPopup();
		}
		return this.each(function(){
			$.magnificPopup.instance.addGroup($(this), options);
			return $(this);
		});
	};

})(window.jQuery || window.Zepto, window);




// Quick benchmark
// var iterations = 500;
// var start = window.performance.now();
// for(var i = 0; i < iterations; i++) {
// 
// }
// var time1 = window.performance.now() - start;


// var start = window.performance.now();
// for(var i = 0; i < iterations; i++) {
// 
// }
// var time2 = window.performance.now() - start;
// console.log('Diff:' + (time1-time2) + ' t1,t2:',time1,time2);


//  FastClick 
// 	$.fn.mfpTap = function(handler) {
// 		return this.each(function(){
// 			// this.element = element;
// 			// this.handler = handler;
// 			var el = this;

			
// 			//handler.call(this, ev);
			

// 			//var superTouch = {

// 			var startX = 0,
// 				startY = 0,
// 				moved = false,

// 				init = function() {
// 					el.addEventListener('touchstart', onTouchStart, false);
// 					el.addEventListener('click', onClick, false);
// 				},

// 				onTouchStart = function(e) {
// 				  e.stopPropagation();
// 				  moved = false;

// 				  el.addEventListener('touchend', onClick, false);
// 				  document.body.addEventListener('touchmove', onTouchMove, false);

// 				  startX = e.touches[0].clientX;
// 				  startY = e.touches[0].clientY;
// 				},

// 				onTouchMove = function(e) {
// 					console.log('move:',e.touches[0].clientX, startX );
// 				  if (Math.abs(e.touches[0].clientX - startX) > 10 ||
// 				      Math.abs(e.touches[0].clientY - startY) > 10) {
// 				  	moved = true;
// 				    reset();
// 				  }
// 				},

// 				onClick = function(e) {
// 				  e.stopPropagation();
// 				  reset();
// 				  console.log('fire!', e.type);
// 				  if(moved) return;
// 				  handler(e);
				  

// 				  if (e.type == 'touchend') {
// 				  	preventGhostClick(startX, startY);
// 				   // google.clickbuster.preventGhostClick(this.startX, this.startY);
// 				  }
// 				},

// 				reset = function() {
// 					console.log('reset');
// 					el.removeEventListener('touchend', onClick, false);
// 	  				document.body.removeEventListener('touchmove', onTouchMove, false);
// 				},

// 				preventGhostClick = function(x, y) {
// 				  coordinates.push(x, y);
// 				  window.setTimeout(pop, 1000);
// 				},

// 				pop = function() {
// 				  coordinates.splice(0, 2);
// 				};

// 			var onClickBuster = function(e) {
// 				console.log('on click buster', coordinates);
// 				for (var i = 0; i < coordinates.length; i += 2) {
// 					var x = coordinates[i];
// 					var y = coordinates[i + 1];
// 					if (Math.abs(e.clientX - x) < 25 && Math.abs(e.clientY - y) < 25) {
// 						e.stopPropagation();
// 						e.preventDefault();
// 					}
// 				}
// 			};

// 			document.addEventListener('click', onClickBuster, true);
// 			var coordinates = [];


// 			//};

// 			init();

// 		});
//	};	
