/**
 *
 * Magnific Popup Image
 * @version 0.0.1:
 *
 */ 
;(function($) {

	"use strict";
	
	$.magnificPopup.defaults.image = {
		markup: '<div class="img-popup-bg"><img src="%url%" /></div>',
		cursor: 'mfp-zoom-out-cur',
		mTop:44,
		mBottom:44,
		verticalFit: true
	};
	$.extend($.magnificPopup.proto, {

		initImage: function() {
			var self = this;
			self.types.push('image');

			self.ev.on('mfpBeforeOpen', function() {
				var zoomOutCur = self.st.image.cursor;
				self.ev.on({
					'mfpContentParse.mfpImage' : function(e, item) {
						if(item.type === 'image'){
							if(zoomOutCur) {
								self.body.addClass(zoomOutCur);
							}

							self.parseImage(item);
						}	
					},
					'mfpChange.mfpImage' : function() {
						if(self.currItem.imgLoadError) {
							self.updatePreloader(self.st.txt.imageError, true);
						} else {
							self.updatePreloader(self.st.txt.loading);
						}
						if(self.st.image.verticalFit) {
							self.resizeImage();
						}
					},
					'mfpClose.mfpImage' : function() {
						if(zoomOutCur) {
							self.body.removeClass(zoomOutCur);
						}

						self.ev.off('.mfpImage');
					}
				});

				if(self.st.image.verticalFit) {
					self.ev.on('mfpResize.mfpImage', function() {
						self.resizeImage();
					});
				}
			});


		},
		resizeImage: function() {
			var img = this.parsedItems[this.index].img;
			if(img) {
				img.css('max-height', this.wH - this.st.image.mTop - this.st.image.mBottom);
			}
		},
		parseImage: function(item) {
			var self = this;
			item.view = $( self.st.image.markup.replace('%url%', item.src) );
			item.img = ( item.view.is('img') ? item.view : item.view.find('img') )
					.css('max-height', self.wH - self.st.marTop - self.st.marBottom)
					.one('error.mfp', function() {
						item.view.hide();
						item.imgLoadError = true;
						if(self.currItem.imgLoadError) {
							self.updatePreloader(self.st.txt.imageError, true);
						}
							
					});


// Image loader koncept
//    function onComplete(){
//      if (img.complete) {
//        $img.unbind('.loader');
//        if ($.isFunction(success)) success.call(img);
//      }
//      else 
//      	window.setTimeout(onComplete,100);
//    }

//    $img
//      .bind('load.loader',onComplete)
//      .bind('error.loader',function(e){
//        $img.unbind('.loader');
//        if ($.isFunction(error)) error.call(img);
//      });

//    if (img.complete && $.isFunction(success)){
//      $img.unbind('.loader');
//      success.call(img);
//    }

		}
	});
	$.magnificPopup.modules.push( $.magnificPopup.proto.initImage );
})(window.jQuery || window.Zepto);



