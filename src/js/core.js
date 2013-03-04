
// As we have only one instance of MagnificPopup, we define it locally to not to use 'this'
var mfp,
	MagnificPopup = function(){};

MagnificPopup.prototype = {

	constructor: MagnificPopup,

	init: function() {
		mfp.isLowIE = jQuery && $.support.leadingWhiteSpace; // <=IE8
		mfp.isAndroid = (/android/gi).test(navigator.appVersion);
		mfp.isIOS = (/iphone|ipad|ipod/gi).test(navigator.appVersion);

		// We disable fixed positioned lightbox on devices that don't handle it nicely.
		// If you know a better way of doing this - let me know.
		mfp.probablyMobile = (mfp.isAndroid || mfp.isIOS || /Opera Mini|webOS|BlackBerry|Opera Mobi|IEMobile/i.test(navigator.userAgent) );
		mfp.win = $(window);
		mfp.body = $(document.body);
		mfp.doc = $(document);
	},

	/**
	 * Updates layout of popup
	 * @param  Boolean force     If set to true forces the resize, no matter if height is changed or not.
	 * @param  Number  winHeight Height of window (optional).
	 */
	resize: function(force, winHeight) {
		if(mfp.st.alignTop){
			return;
		} 

		mfp.wH = winHeight || mfp.win.height();

		// we resize popup only when height changes
		if(force || mfp.prevHeight !== mfp.wH) {
			mfp.prevHeight = mfp.wH;
		
			if(mfp.wH < mfp.st.minHeight ) {
				mfp.wH = mfp.st.minHeight;
			}

			var containerCSS = {
				height: mfp.wH ,
				lineHeight: mfp.wH + 'px'
			};
			mfp.trigger('Resize', containerCSS);
			mfp.container.css(containerCSS);
		}
	}, 

	
	open: function(data) {

		if(!mfp.isOpen) {
			mfp.types = []; 
		
			var isArr = $.isArray(data.items);

			mfp.ev = isArr ? mfp.doc : data.el;	

			//mfp.index = data.items.length > 1 ? data.items.index( data.el ) : 0;
			mfp.index = isArr ? data.index : data.items.index(data.el);

			mfp.st = $.extend(true, {}, $.magnificPopup.defaults, data ); 
			mfp.fixedPosition = mfp.st.fixedPosition === 'auto' ? !mfp.probablyMobile : mfp.st.fixedPosition;


			mfp.isOpen = true;
			mfp.items = data.items;
			mfp.popupID = data.id;
			mfp.parsedItems = [];


			// Dark overlay
			mfp.bgOverlay = mfp._getEl('bg').on('click.mfp', function() {
				mfp.close();
			});


			mfp.wrap = mfp._getEl('wrap').attr('tabindex', -1).on('click.mfp', function(e) {
				if(mfp.st.closeOnContentClick) {
					mfp.close();
				} else {
					// close popup if click is not on a content or content does not exist
					if( !mfp.content || 
						(mfp.preloader && e.target === mfp.preloader[0]) || 
						(e.target !== mfp.content[0] && !$.contains(mfp.content[0], e.target)) ) {
						mfp.close();
					}
				}
			});



			

			mfp.container = mfp._getEl('container', mfp.wrap);


			var modules = $.magnificPopup.modules;
			for(var i = 0; i < modules.length; i++) {

				var n = modules[i];
				n = n.charAt(0).toUpperCase() + n.slice(1);
				mfp['init'+n].call(mfp);
			}
			mfp.trigger('BeforeOpen');


			if(mfp.st.preloader) {
				mfp.preloader = mfp._getEl('preloader', mfp.container, mfp.st.tLoading);
			}

			if(!mfp.st.closeBtnInside) {
				mfp.wrap.append( mfp._getCloseBtn() );
			} else {
				mfp.wrap.addClass('mfp-close-btn-in');
			}
		

			if(mfp.fixedPosition) {
				mfp.wrap.css({
					overflow: mfp.st.overflow,
					overflowX: 'hidden',
					overflowY: mfp.st.overflow
				});
			} else {
				mfp.bgOverlay.css({
					height: mfp.doc.height(),
					position: 'absolute'
				});
				
				mfp.wrap.css({ 
					top: mfp.win.scrollTop(),
					position: 'absolute'
				});
			}

			// Window resize
			mfp.win.on('resize.mfp', function() {
				mfp.resize();
			});

			// ESC key
			mfp.doc.on('keyup.mfp', function(e) {
				if(e.keyCode === 27) {
					mfp.close();
				}
			});


			if(mfp.st.closeOnContentClick) {
				mfp.wrap.addClass('mfp-zoom-out');
			}
			

			// this triggers recalculation of layout, so we get it once to not to trigger twice
			mfp.wH = mfp.win.height();

			
			var bodyStyles = {};
			if(mfp.fixedPosition && mfp._hasScrollBar(mfp.wH) ) {
				var s = mfp._getScrollbarSize();
				if(s) {
					bodyStyles.paddingRight = s;
				}
			}

			if(mfp.fixedPosition) {
				if(!mfp.isLowIE) {
					bodyStyles.overflow = 'hidden';
				} else {
					$('body, html').css('overflow', 'hidden');
				}
			}

			
			
				
			if(mfp.st.mainClass) {
				mfp._addClassToMFP( mfp.st.mainClass );
			}
				
			

			mfp.setItemHTML(mfp.index);
			
			mfp.body.css(bodyStyles);

			mfp.resize(true, mfp.wH);
			mfp.bgOverlay.add(mfp.wrap).appendTo( document.body );

			// Save last focused element
			mfp._lastFocusedEl = document.activeElement;
			//(mfp.st.focusInput ? mfp.contentContainer.find(':input').eq(0) : mfp.wrap).focus();
			
			// We aren't using mfp.wrap[0].offsetWidth; hack and trading smoothness for speed
			setTimeout(function() {
				
				if(mfp.content) {
					mfp._addClassToMFP('mfp-ready');
					mfp.setFocus();
				} else {
					mfp.bgOverlay.addClass('mfp-ready');
				}
				

				
				// Lock focus on popup
				mfp.doc.on('focusin.mfp', function (e) {
					if( e.target !== mfp.wrap[0] && !$.contains(mfp.wrap[0], e.target) ) {
						mfp.wrap.focus();
						return false;
					}
				});
				mfp.trigger('Open');

			}, 16);
		}

	},
	setFocus: function() {
		(mfp.st.focusInput ? mfp.content.find(':input').eq(0) : mfp.wrap).focus();
	},
	close: function(browserAction) {
		

		if(mfp.isOpen) {
			mfp.isOpen = false;

			var remove = function() {

				mfp.trigger('Close', mfp, browserAction);

				if(mfp.closeBtn) {
					mfp.closeBtn.remove();
				}
				

				

				if(mfp._lastFocusedEl) {
					$(mfp._lastFocusedEl).focus(); // put tab focus back
				}
					

				var classesToRemove = 'mfp-removing mfp-ready ';
				
				

				mfp.parsedItems = null;
				mfp.bgOverlay.remove();
				mfp.wrap.remove();

				if(mfp.st.mainClass) {
					classesToRemove += mfp.st.mainClass + ' ';
				}
				mfp._removeClassFromMFP(classesToRemove);

				if(mfp.fixedPosition) {
					var bodyStyles = {paddingRight: 'inherit'};
					if(mfp.isLowIE) {
						$('body, html').overflow = 'visible';
					} else {
						bodyStyles.overflow = 'visible';
					}
					mfp.body.css(bodyStyles);
				}

				


				mfp.win.off('resize.mfp');
				mfp.doc.off('keyup.mfp');
				mfp.doc.off('focusin.mfp');
				mfp.ev.off('.mfp');

				// clean up everything that has link to content
				mfp.currItem = mfp.items = mfp.st = mfp.container = mfp.wrap = mfp.bgOverlay = mfp.content = mfp.closeBtn = null;
				mfp.prevHeight = 0;
			};

			// for CSS3 animation
			if(mfp.st.removalDelay)  {
				mfp._addClassToMFP('mfp-removing');
				setTimeout(function() {
					remove();
				}, mfp.st.removalDelay);
			} else {
				remove();
			}

		}
	},

	
	// set content of popup
	setItemHTML: function(index, preload, content) {
		var item = mfp.parsedItems[index];

		if(!item) {
			mfp.parsedItems[index] = item = mfp.parseEl( mfp.items[index] );
			item.index = index;
		}
		if(!preload) {
			mfp.currItem = item;
		}

		if(content) {
			item.view = content;
		} else if(!item.view) {
			mfp.trigger('ContentParse', item, preload);

			// if still there is no view - we terminate
			if(!item.view) {
				item.emptyLoad = preload;
				return;
			}
		}

		if(item.rendered) {
			mfp.content.parent().hide();
			item.view.parent().show();		
		} else {
			var contentContainer = mfp._getEl('content');
			contentContainer.attr('mfp-id', index);
			contentContainer.addClass('mfp-'+item.type+'-content').html(item.view);
			
			

			if(!preload) {
				if(mfp.content) {
					mfp.content.parent().hide();
				}
			} else {
				contentContainer.hide();
			}

			mfp.container.append(contentContainer);
			item.rendered = true;
		}

		if(!preload) {
			mfp.content = item.view;
			if(mfp.st.closeBtnInside) {
				mfp.content.append( mfp._getCloseBtn() );
			}

			if(mfp.st.preloader) {
				mfp.updatePreloader();
			}

			mfp.trigger('Change', mfp.parsedItems[mfp.index]);
		}
	},

	
	// creates Magnific Popup data object
	parseEl: function(item) {
		var el;


		if(item.tagName) {
			el = $(item);
			item = { el: el, parsed: true };
		} else {
			item.parsed = true;
			return item;
		}

		if(item.el) {
			var types = mfp.types;
			for(var i = 0; i < types.length; i++) {
				if( (mfp.st.type === types[i] && !item.src) || item.el.hasClass('mfp-'+types[i]) ) {
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

		mfp.ev.trigger('ElementParse', item);
		return item;
	},


	/**
	 * Initializes single popup or group of popups
	 * @param el      jQuery DOM element
	 * @param options MFP options
	 */
	gCounter: 0,
	addGroup: function(el, options) {
		var eHandler = function(e) {

				var midClick = options.midClick !== undefined ? options.midClick : $.magnificPopup.defaults.midClick;
				if( midClick || e.which !== 2 ) {
					var disableOn = options.disableOn !== undefined ? options.disableOn : $.magnificPopup.defaults.disableOn;

					if(disableOn) {
						if($.isFunction(disableOn)) {
							if( !disableOn.call(mfp) ) {
								return true;
							}
						} else { // else it's number
							if( $(window).width() < disableOn ) {
								return true;
							}
						}
					}

					//if( $(window).width() > (options.disableOn !== undefined ? options.disableOn : $.magnificPopup.defaults.disableOn ) ) {
						e.preventDefault();
						options.el = $(this);
						mfp.open(options);
					//}

				}
				
			};

		if(!options) {
			options = {};
		} 

		options.id = mfp.gCounter++;
		var eName = 'click.magnificPopup';
		if(options.delegate) {
			options.items = el.find(options.delegate);
			el.off(eName).on(eName, options.delegate , eHandler);
		} else {
			options.items = el;
			el.off(eName).on(eName, eHandler);
		}
	},


	/**
	 * Updates text on preloader
	 * @param  {String}  txt     Preloader text
	 * @param  {Boolean} isError Adds mfp-img-error class if enabled
	 */
	updatePreloader: function() {
		
		if(mfp.preloader ) {
			
			var errorText = mfp.currItem.errorText;
			if(errorText || mfp._isPreloaderError) {
				var txt;
				mfp.preloader.css('display', 'block');
				if(!errorText) {
					txt = mfp.st.tLoading;
				} else {
					txt = errorText;
				}
				mfp._isPreloaderError = Boolean(errorText);
				
				mfp.preloader[errorText ? 'addClass' : 'removeClass']('mfp-load-error').html( txt.replace('%url%', mfp.currItem.src) );
				if(errorText) {
					// prevent closing of popup, when link is clicked in preloader text
					mfp.preloader.find('a').click(function(e) {
						e.stopImmediatePropagation();
					});
				}
			} else {
				if(mfp.currItem.finished) {
					mfp.preloader.css('display', 'none');
				} else {
					mfp.preloader.css('display', 'block');
				}

			}
			
		}

	},


	trigger: function(e, data) {
		// We have a lot of events, so we use triggerHandler instead of trigger, as bubbling is slow
		mfp.ev.triggerHandler('mfp' + e, data);

		if(mfp.st.callbacks) {
			// converts mfpEventName to eventName
			e = e.charAt(0).toLowerCase() + e.slice(1);
			if(mfp.st.callbacks[e]) {
				mfp.st.callbacks[e].call(mfp, data);
			}
		}
	},
	on: function(name, f) {
		mfp.ev.on('mfp' + name+'.mfp', f);
	},





	/*
		"Private" helpers that aren't private at all
	 */
	_getCloseBtn: function() {
		
		if(!mfp.closeBtn) {
			mfp.closeBtn = $( mfp.st.closeMarkup.replace('%title%', mfp.st.tClose ) ).click(function(e) {
				e.preventDefault();
				mfp.close();
			});
		}
		
		return mfp.closeBtn;
	},
	_addClassToMFP: function(cName) {

		mfp.bgOverlay.addClass(cName);
		mfp.wrap.addClass(cName);
	},
	_removeClassFromMFP: function(cName) {
		this.bgOverlay.removeClass(cName);
		mfp.wrap.removeClass(cName);
	},
	_hasScrollBar: function(winHeight) {
		if(document.body.clientHeight > (winHeight || mfp.win.height()) ) {
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
		// thx David
		if(mfp.scrollbarSize === undefined) {
			var scrollDiv = document.createElement("div");
			scrollDiv.id = "mfp-sbm";
			document.body.appendChild(scrollDiv);
			mfp.scrollbarSize = scrollDiv.offsetWidth - scrollDiv.clientWidth;
			document.body.removeChild(scrollDiv);
		}
		return mfp.scrollbarSize;
	}

}; /* MagnificPopup core prototype end */

/**
 * Public static interface
 */
$.magnificPopup = {
	instance: null,
	proto: MagnificPopup.prototype,
	modules: [],

	// $.magnificPopup.open({src: "site-assets/img/p1/1.jpg", type: "image"});
	open: function(items, options, index) {
		if(!$.magnificPopup.instance) {
			mfp = new MagnificPopup();
			mfp.init();
			$.magnificPopup.instance = mfp;
		}	
		var el;
		if(!options) {
			options = {};
		}
		if( !$.isArray(items) ){
			el = items;
			items = [items];
			index = 0;
		} else if(index === undefined) {
			index = 0;
		}

		options.items = items;
		options.index = index;
		options.el = items[index];		

		this.instance.open(options);
	},
	close: function() {
		$.magnificPopup.instance.close();
	},

	registerModule: function(name, module) {
		if(module.options) {
			$.magnificPopup.defaults[name] = module.options;
		}
		$.extend(this.proto, module.proto);			
		this.modules.push(name);
	},


	defaults: {   
		disableOn: 0,	

		midClick: false,	// 

		mainClass: null,

		minHeight: 400,

		preloader: true,

		focusInput: false,
		
		closeOnContentClick: false,

		closeBtnInside: false,

		overlay: true,
	
		removalDelay: 0,

		alignTop: false,
		
		fixedPosition: 'auto', // "auto", true, false. "Auto" will automatically disable this option when browser doesn't support fixed position properly.
		overflow: 'auto', // CSS property of slider wrap: 'auto', 'scroll', 'hidden'. Doesn't apply when fixedPosition is on.

		closeMarkup: '<button title="%title%" class="mfp-close"><i class="mfp-close-icn">&times;</i></button>',

		tClose: 'Close (Esc)',
		tLoading: 'Loading...'
	}
};


$.fn.magnificPopup = function(options) {
	// Initialize Magnific Popup only when called at least once
	if(!$.magnificPopup.instance) {
		mfp = new MagnificPopup();
		mfp.init();
		$.magnificPopup.instance = mfp;
	}
	mfp.addGroup($(this), options);
	return $(this);
};


