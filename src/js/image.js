
$.magnificPopup.registerModule('image', {

	options: {
		markup: '<img class="mfp-img" src="%url%" />',
		cursor: 'mfp-zoom-out-cur',
		mTop:44,
		mBottom:44,
		verticalFit: true,
		tError: '<a href="%url%">The image</a> could not be loaded.'
	},

	proto: {
		initImage: function() {
			mfp.types.push('image');

			var zoomOutCur = mfp.st.image.cursor,
				ns = '.image';

			mfp.on('ContentParse'+ns, function(e, item) {
				if(item.type === 'image'){
					if(zoomOutCur) {
						mfp.body.addClass(zoomOutCur);
					}
					mfp.parseImage(item);
				}	
			});

			mfp.on('Close'+ns, function() {
				if(zoomOutCur) {
					mfp.body.removeClass(zoomOutCur);
				}
			});

			mfp.on('Resize'+ns, mfp.resizeImage);
			mfp.on('Change'+ns, mfp.resizeImage);
			
		},
		resizeImage: function() {
			if(mfp.st.image.verticalFit && mfp.currItem.type !== 'image') {
				return;
			}
			var img = mfp.currItem.img;
			if(img) {
				img.css('max-height', mfp.wH - mfp.st.image.mTop - mfp.st.image.mBottom);
			}
		},
		parseImage: function(item) {

			item.view = $( mfp.st.image.markup.replace('%url%', item.src) );
			item.img = ( item.view.is('img') ? item.view : item.view.find('img') )
					.css('max-height', mfp.wH - mfp.st.marTop - mfp.st.marBottom)
					.one('error.mfp', function() {
						if(item) {
							item.view.hide();
							item.imgLoadError = true;
							item.errorText = mfp.st.image.tError;
							if(mfp.st.preloader) {
								mfp.updatePreloader();
							}
						}
					});



			// Image loader concept
			//	function onComplete(){
			//		if (img.complete) {
			//			$img.unbind('.loader');
			//			if ($.isFunction(success)) success.call(img);
			//		}
			//		else {
			//			window.setTimeout(onComplete,100);
			//		}
			//	}

			//	$img
			//		.bind('load.loader',onComplete)
			//		.bind('error.loader',function(e){
			//			$img.unbind('.loader');
			//			if ($.isFunction(error)) error.call(img);
			//		});

			//	if (img.complete && $.isFunction(success)){
			//		$img.unbind('.loader');
			//		success.call(img);
			//	}

		}
	}
});

