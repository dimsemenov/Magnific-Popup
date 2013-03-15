
// As we have only one instance of MagnificPopup, we define it locally to not to use 'this'
var mfp,
	MagnificPopup = function(){},
	_prevStatus,
	_window,
	_body,
	_document,
	_prevContentType;

// private static const
var CLOSE_EVENT = 'Close',
	BEFORE_APPEND_EVENT = 'BeforeAppend',
	MARKUP_PARSE_EVENT = 'MarkupParse',
	OPEN_EVENT = 'Open',
	CHANGE_EVENT = 'Change',

	CLICK_EVENT = 'click';

var NS = 'mfp';
	EVENT_NS = '.' + NS;

var READY_CLASS = 'mfp-ready',
	REMOVING_CLASS = 'mfp-removing';

var _mfpOn = function(name, f) {
		mfp.ev.on(NS + name+EVENT_NS, f);
	},
	_getEl = function(className, appendTo, html, raw) {
		var el = document.createElement('div');
		el.className = NS + '-'+className;
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
	_mfpTrigger = function(e, data) {
		// We dispatch a lot of events, so we use triggerHandler instead of trigger, as bubbling is slow
		mfp.ev.triggerHandler(NS + e, data);

		if(mfp.st.callbacks) {
			// converts mfpEventName to eventName
			e = e.charAt(0).toLowerCase() + e.slice(1);
			if(mfp.st.callbacks[e]) {
				mfp.st.callbacks[e].call(mfp, data);
			}
		}
	};

MagnificPopup.prototype = {

	constructor: MagnificPopup,

	/**
	 * Initializes Magnific Popup plugin. 
	 * This function is triggered only once. And only when $.fn.magnificPopup or $.magnificPopup is executed
	 */
	init: function() {
		var appVersion = navigator.appVersion;
		mfp.isIE7 = appVersion.indexOf("MSIE 7.") !== -1; 
		mfp.isAndroid = (/android/gi).test(appVersion);
		mfp.isIOS = (/iphone|ipad|ipod/gi).test(appVersion);

		// We disable fixed positioned lightbox on devices that don't handle it nicely.
		// If you know a better way of doing this - let me know.
		mfp.probablyMobile = (mfp.isAndroid || mfp.isIOS || /Opera Mini|webOS|BlackBerry|Opera Mobi|IEMobile/i.test(navigator.userAgent) );
		_window = $(window);
		_body = $(document.body);
		_document = $(document);
		mfp.templates = {};
		
	},


	/**
	 * Opens popup
	 * @param  {[type]} data [description]
	 * @return {[type]}      [description]
	 */
	open: function(data) {

		if(!mfp.isOpen) {
			mfp.types = []; 

			var isArr = $.isArray(data.items);
			mfp.ev = isArr ? _document : data.el;	


			var items = data.items,
				item;
			for(var i = 0; i < items.length; i++) {
				item = items[i];
				item = item.parsed ? item.el[0] : item;

				if(item === data.el[0]) {
					mfp.index = i;
					break;
				}
			}

			mfp.st = $.extend(true, {}, $.magnificPopup.defaults, data ); 
			mfp.fixedPosition = mfp.st.fixedPosition === 'auto' ? !mfp.probablyMobile : mfp.st.fixedPosition;


			
			mfp.items = data.items;
			mfp.popupID = data.id;


			// Dark overlay
			mfp.bgOverlay = _getEl('bg').on(CLICK_EVENT, function() {
				mfp.close();
			});


			mfp.wrap = _getEl('wrap').attr('tabindex', -1).on(CLICK_EVENT, function(e) {
				if(mfp.st.closeOnContentClick) {
					mfp.close();
				} else {
					// close popup if click is not on a content, on close button, or content does not exist
					var target = e.target;
					if( !mfp.content || 
						$(e.target).hasClass('mfp-close') ||
						(mfp.preloader && e.target === mfp.preloader[0]) || 
						(target !== mfp.content[0] && !$.contains(mfp.content[0], target)) ) {
						mfp.close();
					}
				}
			});



			

			mfp.container = _getEl('container', mfp.wrap);



			if(mfp.st.preloader) {
				mfp.preloader = _getEl('preloader', mfp.container, mfp.st.tLoading);
			}

			mfp.contentContainer = _getEl('content', mfp.container);


			var modules = $.magnificPopup.modules;
			for(var i = 0; i < modules.length; i++) {

				var n = modules[i];
				n = n.charAt(0).toUpperCase() + n.slice(1);
				mfp['init'+n].call(mfp);
			}
			_mfpTrigger('BeforeOpen');


			

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
					//height: _document.height(),
					position: 'fixed'
				});
				
				mfp.wrap.css({ 
					top: _window.scrollTop(),
					position: 'absolute'
				});
			}

			

			// ESC key
			_document.on('keyup' + EVENT_NS, function(e) {
				if(e.keyCode === 27) {
					mfp.close();
				}
			});


			if(mfp.st.closeOnContentClick) {
				mfp.wrap.addClass('mfp-zoom-out');
			}
			

			// this triggers recalculation of layout, so we get it once to not to trigger twice
			var windowHeight = mfp.wW = _window.width();
				windowWidth = mfp.wH = _window.height();

			
			var bodyStyles = {};
			if(mfp.fixedPosition && mfp._hasScrollBar(windowHeight) ) {
				var s = mfp._getScrollbarSize();
				if(s) {
					bodyStyles.paddingRight = s;
				}
			}

			if(mfp.fixedPosition) {
				if(!mfp.isIE7) {
					bodyStyles.overflow = 'hidden';
				} else {
					$('body, html').css('overflow', 'hidden');
				}
			}

			
			
			var classesToadd = mfp.st.mainClass;

			if(mfp.isIE7) {
				classesToadd += ' mfp-ie7';
			}

			if(classesToadd) {
				mfp._addClassToMFP( classesToadd );
			}
				
			

			mfp.setItemHTML(mfp.index);
			
			// TOOD: fix this
			if(mfp.currItem.type !== 'image' && mfp.currItem.type !== 'iframe') {
				mfp.container.css({
					paddingTop: 0,
					paddingBootom: 0
				});
			}
			
			mfp.bgOverlay.add(mfp.wrap).prependTo( document.body );
			
			_body.css(bodyStyles);



			//return;

			// Save last focused element
			mfp._lastFocusedEl = document.activeElement;
			//(mfp.st.focusInput ? mfp.contentContainer.find(':input').eq(0) : mfp.wrap).focus();
			
			// We aren't using mfp.wrap[0].offsetWidth; hack and trading smoothness for speed
			setTimeout(function() {
				
				if(mfp.content) {
					mfp._addClassToMFP(READY_CLASS);
					mfp.setFocus();
				} else {
					mfp.bgOverlay.addClass(READY_CLASS);
				}
				
				// Lock focus on popup
				_document.on('focusin' + EVENT_NS, function (e) {
					if( e.target !== mfp.wrap[0] && !$.contains(mfp.wrap[0], e.target) ) {
						mfp.wrap.focus();
						return false;
					}
				});
			}, 16);

			mfp.isOpen = true;
			_mfpTrigger(OPEN_EVENT);
		}

	},
	setFocus: function() {
		(mfp.st.focusInput ? mfp.content.find(':input').eq(0) : mfp.wrap).focus();
	},
	close: function() {
		

		if(mfp.isOpen) {
			mfp.isOpen = false;

			var remove = function() {

				_mfpTrigger(CLOSE_EVENT);

				if(mfp.closeBtn) {
					mfp.closeBtn.remove();
				}
				

				

				if(mfp._lastFocusedEl) {
					$(mfp._lastFocusedEl).focus(); // put tab focus back
				}
					

				var classesToRemove = REMOVING_CLASS + ' ' + READY_CLASS + ' ';
				
				


				mfp.bgOverlay.remove();
				mfp.wrap.remove();

				if(mfp.st.mainClass) {
					classesToRemove += mfp.st.mainClass + ' ';
				}
				mfp._removeClassFromMFP(classesToRemove);

				if(mfp.fixedPosition) {
					var bodyStyles = {paddingRight: 'inherit'};
					if(mfp.isIE7) {
						$('body, html').css('overflow', 'auto');
					} else {
						bodyStyles.overflow = 'visible';
					}
					_body.css(bodyStyles);
				}

				
				_document.off('keyup' + EVENT_NS + ' focusin' + EVENT_NS);
				mfp.ev.off(EVENT_NS);

				// clean up everything that has link to content
				//mfp.currItem = mfp.items = mfp.st = mfp.container = mfp.wrap = mfp.bgOverlay = mfp.content = mfp.closeBtn = null;
				mfp.prevHeight = 0;
			};

			// for CSS3 animation
			if(mfp.st.removalDelay)  {
				mfp._addClassToMFP(REMOVING_CLASS);
				setTimeout(function() {
					remove();
				}, mfp.st.removalDelay);
			} else {
				remove();
			}

		}
	},

	
	// set content of popup
	setItemHTML: function(index) {
		var item = mfp.items[index];

		if(!item.parsed) {
			item = mfp.parseEl( index );
		}
		//if(!preload) {
			mfp.currItem = item;
		//}

		// if(content) {
		// 	item.view = content;
		// } else if(!item.view) {
		

			//_mfpTrigger('ContentParse', item);

		// detach
		//if(mfp.content)
		//	mfp.content.detach();

		// update structure
		var type = item.type;
		if(!mfp.templates[type]) {
			var markup = mfp.st[type] ? mfp.st[type].markup : false;
			if(markup) {
				if(mfp.st.closeBtnInside) {
					markup = markup.replace('%close%', mfp._getCloseBtn() );
				}
				_mfpTrigger('FirstMarkupParse', markup);
				mfp.templates[type] = $(markup);
			}
			
		}



		mfp.content = mfp['get' + type.charAt(0).toUpperCase() + type.slice(1)](item);
		
		// TODO: fix this
		if(item.type === 'inline' || item.type === 'ajax') {
			if(mfp.st.closeBtnInside) {
				if( !(mfp.content.find('.mfp-close').length > 0) ) {
					mfp.content.prepend( mfp._getCloseBtn() );
				}
			}
		}

		_mfpTrigger(BEFORE_APPEND_EVENT);

		

		if(_prevContentType && _prevContentType !== item.type) {
			mfp.contentContainer.removeClass('mfp-'+item.type+'-content');
			
		}
		// put it back
		mfp.contentContainer.addClass('mfp-'+item.type+'-content').html(mfp.content);
		item.preloaded = true;
		_mfpTrigger(CHANGE_EVENT, item);
		_prevContentType = item.type;


			//mfp.content = item.view;
			// if(mfp.st.closeBtnInside) {
			// 	mfp.content.append( mfp._getCloseBtn() );
			// }

			

			// var contentContainer = _getEl('content');
			// contentContainer.attr('mfp-id', index);
			// contentContainer.addClass('mfp-'+item.type+'-content').html(mfp.content);

			
			



			//mfp.container.append(contentContainer);

			//_mfpTrigger('Change', mfp.[mfp.index]);


			// if still there is no view - we terminate
			// if(!item.view) {
			// 	item.emptyLoad = preload;
			// 	return;
			// }
		//}

		// if(item.rendered) {
		// 	mfp.content.parent().hide();
		// 	item.view.parent().show();		
		// } else {
		// 	var contentContainer = _getEl('content');
		// 	contentContainer.attr('mfp-id', index);
		// 	contentContainer.addClass('mfp-'+item.type+'-content').html(item.view);
			
			

		// 	if(!preload) {
		// 		if(mfp.content) {
		// 			mfp.content.parent().hide();
		// 		}
		// 	} else {
		// 		contentContainer.hide();
		// 	}

		// 	mfp.container.append(contentContainer);
		// 	item.rendered = true;
		// }

		// if(!preload) {
		// 	mfp.content = item.view;
		// 	if(mfp.st.closeBtnInside) {
		// 		mfp.content.append( mfp._getCloseBtn() );
		// 	}

		// 	if(mfp.st.preloader) {
		// 		mfp.updatePreloader();
		// 	}

		
		// }
	},

	
	// creates Magnific Popup data object
	parseEl: function(index) {
		var el,
			item = mfp.items[index];

		
		if(item.tagName) {
			el = $(item);
			item = { el: el };
		}

		//  else {
		// 	item.parsed = true;
		// 	return item;
		// }

		if(item.el) {
			var types = mfp.types;
			for(var i = 0; i < types.length; i++) {
				if( (mfp.st.type === types[i] && !item.src) || item.el.hasClass('mfp-'+types[i]) ) {
					item.src = item.el.attr('data-mfp-src');
					if(!item.src) {
						item.src = item.el.attr('href');
					}

					
					item.type = types[i];	
					
					break;
				}
			}
		}

		item.index = index;
		item.parsed = true;
		mfp.items[index] = item;
		_mfpTrigger('ElementParse', item);
		return mfp.items[index];
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
		var eName = CLICK_EVENT + '.magnificPopup';
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
	updateStatus: function(status, text) {
		
		//mfp.currStatus = 'loaded';




		if(mfp.preloader) {
			if(_prevStatus !== status) {
				mfp.container.removeClass('mfp-s-'+_prevStatus);
			}


			

			if(status === 'loading') {
				text = mfp.st.tLoading;
			} else if(status === 'ready') {

			} else if(status === 'error') {

			}
			mfp.preloader.html(text);

			mfp.preloader.find('a').click(function(e) {
				e.stopImmediatePropagation();
			});

			mfp.container.addClass('mfp-s-'+status);
			_prevStatus = status;
		}



	},


	
	





	/*
		"Private" helpers that aren't private at all
	 */
	_getCloseBtn: function() {
		
		// if(!mfp.closeBtn) {
		// 	mfp.closeBtn = $( mfp.st.closeMarkup.replace('%title%', mfp.st.tClose ) );
		// }
		
		return mfp.st.closeMarkup.replace('%title%', mfp.st.tClose );
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
		if(document.body.clientHeight > (winHeight || _window.height()) ) {
            return true;    
        }
        return false;
	},
	_parseMarkup: function(element, values, item) {
		_mfpTrigger(MARKUP_PARSE_EVENT, [element, values, item] );
		$.each(values, function(key, value) {
			if(key.indexOf('replace_') > -1 ) {
				element.find(EVENT_NS + '-'+key.slice(8)).replaceWith(value);
			} else {
				element.find(EVENT_NS + '-'+key).html(value);
			}
		});
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

		minHeight: 200,

		preloader: true,

		focusInput: false,
		
		closeOnContentClick: false,

		closeBtnInside: true,

		overlay: true,
	
		removalDelay: 0,

		alignTop: false,
		
		fixedPosition: 'auto', // "auto", true, false. "Auto" will automatically disable this option when browser doesn't support fixed position properly.
		overflow: 'auto', // CSS property of slider wrap: 'auto', 'scroll', 'hidden'. Doesn't apply when fixedPosition is on.

		closeMarkup: '<button title="%title%" class="mfp-close">&times;</button>',

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


