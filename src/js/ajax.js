var AJAX_NS = 'ajax',
	_ajaxCur,
	_removeAjaxCursor = function() {
		if(_ajaxCur) {
			_body.removeClass(_ajaxCur);
		}
	};

$.magnificPopup.registerModule(AJAX_NS, {

	options: {
		settings: null,
		cursor: 'mfp-ajax-cur',
		tError: '<a href="%url%">The request</a> failed.'
	},

	proto: {
		initAjax: function() {
			mfp.types.push(AJAX_NS);
			_ajaxCur = mfp.st.ajax.cursor;

			_mfpOn(CLOSE_EVENT+'.'+AJAX_NS, function() {
				_removeAjaxCursor();
				if(mfp.req) {
					mfp.req.abort();
				}
			});
		},

		getAjax: function(item) {

			if(_ajaxCur)
				_body.addClass(_ajaxCur);
			

			mfp.updateStatus('loading');

			mfp.req = $.ajax(item.src, 

				$.extend({
					success:function(data, textStatus, jqXHR) {
						_mfpTrigger('ParseAjax', jqXHR);
						item.ajaxContent.replaceWith( $(jqXHR.responseText) );
						//mfp.setItemHTML(item.index, item.emptyLoad, $(jqXHR.responseText) );
						item.finished = true;

						_removeAjaxCursor();

						mfp.setFocus();

						setTimeout(function() {
							mfp.wrap.addClass(READY_CLASS);
						}, 16);
						mfp.updateStatus('ready');
					},
					error:function() {
						item.finished = true;



						_removeAjaxCursor();
							

						item.loadError = true;
						mfp.updateStatus('error', mfp.st.ajax.tError);
					}
				}, mfp.st.ajax.settings)

			);

			item.ajaxContent = $(document.createElement('div'));
			return item.ajaxContent;




		}
	}
});





	