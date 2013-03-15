
var INLINE_NS = 'inline',
	_atLeastOneInline;
$.magnificPopup.registerModule(INLINE_NS, {

	proto: {
		initInline: function() {
			mfp.types.push(INLINE_NS);

			_mfpOn(CLOSE_EVENT+'.'+INLINE_NS, function() {
				if(_atLeastOneInline) {
					var item;
					for(var i = 0; i < mfp.items.length; i++) {
						item = mfp.items[i];
						if(item && item.inlinePlaceholder){
							item.inlinePlaceholder.after( item.inlineElement.hide() ).detach();
						}
					}
				}
			});
		},
		getInline: function(item) {
			var inlinePlaceHolder
			_atLeastOneInline = true;

			if(!item.inlinePlaceholder) {
				item.inlinePlaceholder = _getEl('mfp-hidden mfp-placeholder-'+mfp.popupID + '-'+ item.index);
			}

			if(!item.inlineElement) {
				item.inlineElement = $(item.src);
			}

			item.inlineElement.after(item.inlinePlaceholder).detach().show();
			return item.inlineElement;
		}

	}
});