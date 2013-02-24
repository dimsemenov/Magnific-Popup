/**
 *
 * Magnific Popup Ajax
 * @version 0.0.1:
 *
 */ 
;(function($) {
	
	"use strict";

	$.magnificPopup.defaults.ajax = {
		settings: null,
		cursor: 'mfp-ajax-cur'
	};
	$.extend($.magnificPopup.proto, {
		initAjax: function() {
			var self = this;
			self.types.push('ajax');

			self.ev.on('mfpBeforeOpen', function() {
				var ajaxCur = self.st.ajax.cursor;

				self.ev.on({
					'mfpContentParse.mfpAjax' : function(e, item) {
						
						if(item.type === 'ajax') {

							if(ajaxCur)
								self.body.addClass(ajaxCur);

							self.req = $.ajax(item.src, 

								$.extend({
									complete:function(jqXHR) {
										self.trigger('mfpParseAjax', jqXHR);
										self.setItemHTML(self.index, false, $(jqXHR.responseText) );
										
										if(ajaxCur)
											self.body.removeClass(ajaxCur);
									},
									error:function(jqXHR) {
										if(ajaxCur)
											self.body.removeClass(ajaxCur);
										// TODO ajax error handling
										//if(self.currItem.loadError) {
											//self.updatePreloader(self.st.txt.imageError, true);
										//}
									}
								}, self.st.ajax.settings)

							);
						}
					},
					'mfpClose.mfpIframe' : function() {
						if(ajaxCur)
							self.body.removeClass(ajaxCur);

						if(self.req) 
							self.req.abort();

						self.ev.off('.mfpAjax');
					}
				});

			});

		}

	});
	$.magnificPopup.modules.push( $.magnificPopup.proto.initAjax );
})(window.jQuery || window.Zepto);