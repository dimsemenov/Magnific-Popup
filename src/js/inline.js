
$.magnificPopup.registerModule('inline', {

	proto: {
		initInline: function() {
			var self = this,
				ns = '.inline',
				atLeastOne;

			self.types.push('inline');

			self.on('ContentParse'+ns, function(e, item) {
				if(item.type === 'inline') {
					if(mfp.preloader) {
						item.finished = true;
					}
					atLeastOne = true;
					item.view = $(item.src).after( mfp._getEl('mfp-hidden mfp-placeholder-'+mfp.popupID + '-'+ self.index) ).detach().show();
				}
			});
			self.on('Close'+ns, function() {
				if(atLeastOne) {
					var item;
					for(var i = 0; i < mfp.parsedItems.length; i++) {
						item = mfp.parsedItems[i];
						if(item && item.type === 'inline'){
							$('.mfp-placeholder-'+mfp.popupID + '-'+i).after( item.view.hide() ).remove();
						}
					}
				}
			});
		}

	}
});
