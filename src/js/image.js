var _imgInterval;

$.magnificPopup.registerModule('image', {

	options: {
		markup: '<figure class="mfp-figure"><div class="mfp-close"></div><div class="mfp-img"></div><figcaption class="mfp-title">%title%<span class="mfp-counter"></span></figcaption></figure>',

		cursor: 'mfp-zoom-out-cur',
		titleSrc: 'title', 

		verticalGap:88,

		verticalFit: true,
		tError: '<a href="%url%">The image</a> could not be loaded.',
		captionSel: 'figcaption'
	},


	proto: {
		initImage: function() {
			var imgSt = mfp.st.image,
				ns = '.image';

			mfp.types.push('image');

			if(!imgSt.verticalFit)
				_wrapClasses += ' mfp-img-no-vertical-fit';

			

			_mfpOn(OPEN_EVENT+ns, function() {
				if(mfp.currItem.type === 'image' && imgSt.cursor) {
					_body.addClass(imgSt.cursor);
				}
			});

			_mfpOn(CLOSE_EVENT+ns, function() {
				if(imgSt.cursor) {
					_body.removeClass(imgSt.cursor);
				}
				_window.off('resize' + EVENT_NS);
			});

			_mfpOn(OPEN_EVENT+ns, function() {
				mfp.resizeImage();
			});

			var onWindowResize = function(force, winHeight, winWidth) {
				mfp.wH = winHeight || _window.height();

				// we resize popup only when height changes
				if(force || mfp.prevHeight !== mfp.wH) {
					mfp.prevHeight = mfp.wH;
					mfp.resizeImage();
				}
			};

			_mfpOn(OPEN_EVENT + ns, function() {
				_window.on('resize' + EVENT_NS,onWindowResize);
			});

			// _mfpOn(BEFORE_APPEND_EVENT+ns, function() {
			// 	//mfp.resizeImage();
			// });
			
		},
		resizeImage: function() {
			var item = mfp.currItem;
			if(!item.img) return;
			if(mfp.st.image.verticalFit) {
				item.img.css('max-height', (mfp.wH - mfp.st.image.verticalGap) + 'px');
			}
		},
		_onImageHasSize: function(item) {
			if(item.img) {
				if(item.imgHidden) {
					mfp.content.removeClass('mfp-loading');
					// if(item.loadError) {
					// 	mfp.content.addClass('mfp-load-error');
					// }
				}

				item.imgHidden = false;
				item.hasSize = true;

				if(_imgInterval) {
					clearInterval(_imgInterval);
				}
				item.isCheckingImgSize = false;
			}
		},

		/**
		 * Function that loops until image has size to display elements that rely on it asap
		 */
		findImageSize: function(item) {
			var counter = 0,
				mfpSetInterval = function(delay) {
					if(_imgInterval) {
						clearInterval(_imgInterval);
					}
					// decelerating interval that checks for size of an image
					_imgInterval = setInterval(function() {
						// Opera mobile shows 22px height for not loaded image, IE - 30, FF - based on line-height (15-20), other browsers - 0. 
						// Just in case we check for 40.
						if(item.img.height() > 40) {
							mfp._onImageHasSize(item);
							return;
						}
						if(counter > 200) {
							clearInterval(_imgInterval);
						}

						counter++;
						if(counter === 3) {
							mfpSetInterval(10);
						} else if(counter === 15) {
							mfpSetInterval(50);
						} else if(counter === 40) {
							mfpSetInterval(100);
						} else if(counter === 100) {
							mfpSetInterval(500);
						}
					}, delay);
				};
			mfpSetInterval(1);
		},

		getImage: function(item, template) {

			var guard = 0,

				// image load complete handler
				onLoadComplete = function() {
					if(item) {
						if (item.img[0].complete) {
							item.img.off('.mfploader');
							
							if(item === mfp.currItem){
								mfp._onImageHasSize(item);
								mfp.updateStatus('ready');
							}

							item.hasSize = true;
							item.loaded = true;
							
						}
						else {
							// if image complete check fails 200 times (20 sec), we assume that there was an error.
							guard++;
							if(guard < 200) {
								setTimeout(onLoadComplete,100);
							} else {
								onError();
							}
						}
					}
				},

				// image error handler
				onError = function() {
					if(item) {
						item.img.off('.mfploader');


						if(item === mfp.currItem){
							mfp._onImageHasSize(item);
							mfp.updateStatus('error', imgSt.tError.replace('%url%', item.src) );
						}

						item.hasSize = true;
						item.loadError = true;
					}
				},
				imgSt = mfp.st.image,
				title;


			// parsing title
			if(item.title) {
				title = item.title;
			} else {
				title = imgSt.titleSrc;
				if(title) {
					if($.isFunction(title)) {
						title = title.call(mfp, item);
					} else if(item.el) {
						title = item.el.attr('title');
						if(!title) {
							title = '';
						}
					}
				} else {
					title = '';
				}
			}
			
			mfp._parseMarkup(template, {
				title: title,
				img_replaceWith: item.img || '<img src="'+item.src+'" class="mfp-img" />'
			}, item);


			mfp.resizeImage();

			if(item.hasSize) {
				if(_imgInterval) clearInterval(_imgInterval);

				if(item.loadError) {
					template.addClass('mfp-loading');
					mfp.updateStatus(ERROR_STATUS, imgSt.tError.replace('%url%', item.src) );
				} else {
					template.removeClass('mfp-loading');
					mfp.updateStatus(READY_STATUS);
				}

				return template;
			}

			mfp.updateStatus(LOADING_STATUS);

			item.img = ( template.is('img') ? template : template.find('.mfp-img') )
					.on('error.mfploader', onError).on('load.mfploader', onLoadComplete);

			item.loading = true;
			

			if(!item.hasSize) {
				item.imgHidden = true;
				template.addClass('mfp-loading');
				mfp.findImageSize(item);
			} else {

			}

			return template;
		}

		
	}
});

