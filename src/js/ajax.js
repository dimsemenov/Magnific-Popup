$.magnificPopup.registerModule('ajax', {

	options: {
		settings: null,
		cursor: 'mfp-ajax-cur',
		tError: '<a href="%url%">The request</a> failed.'
	},

	proto: {
		initAjax: function() {
			mfp.types.push('ajax');

			var ajaxCur = mfp.st.ajax.cursor,
				ns = '.ajax';

			mfp.on('ContentParse'+ns, function(e, item) {
				if(item.type === 'ajax') {

					if(ajaxCur)
						mfp.body.addClass(ajaxCur);

					mfp.req = $.ajax(item.src, 

						$.extend({
							success:function(data, textStatus, jqXHR) {
								mfp.trigger('ParseAjax', jqXHR);
								mfp.setItemHTML(item.index, item.emptyLoad, $(jqXHR.responseText) );
								item.finished = true;
								if(ajaxCur) {
									mfp.body.removeClass(ajaxCur);
								}
									

								mfp.setFocus();

								setTimeout(function() {
									mfp.wrap.addClass('mfp-ready');
								}, 16);
								mfp.updatePreloader();
							},
							error:function() {
								item.finished = true;
								if(ajaxCur)
									mfp.body.removeClass(ajaxCur);
								item.ajaxLoadError = true;
								item.errorText = mfp.st.ajax.tError;
								mfp.updatePreloader();
								mfp.setItemHTML(item.index, item.emptyLoad, $('<div>') );
							}
						}, mfp.st.ajax.settings)

					);
				}
			});

			mfp.on('Close'+ns, function() {
				if(ajaxCur) {
					mfp.body.removeClass(ajaxCur);
				}
				if(mfp.req) {
					mfp.req.abort();
				}
			});

			
		}
	}
});





	