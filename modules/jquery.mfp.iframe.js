/**
 *
 * Magnific Popup Image
 * @version 0.0.1:
 *
 */ 
;(function($) {

	"use strict";
	
	$.magnificPopup.defaults.iframe = {
		markup: '<div class="mfp-iframe-scaler"><iframe class="mfp-video" src="%url%" frameborder="0" allowfullscreen></iframe></div>',
		ratio: 9/16,

		// we don't care and support only one default type of URL for each service. Without slow regexps
		patterns: {
			youtube: {
				// Supported url: youtube.com/watch?v=7HKoqNJtMTQ
				index: 'youtube.com/', 
				id: 'v=', // String or function that returns %id% for src param. Can be null.
				// id: function(url) {
				// 	return '123123'; // returning ID
				// }
				src: '//www.youtube.com/embed/%id%?autoplay=1'
			},
			vimeo: {
				// Supported url: vimeo.com/123123
				index: 'vimeo.com/',
				id: '/',
				src: '//player.vimeo.com/video/%id%?autoplay=1'
			},
			gmaps: {
				index: '//maps.google.',
				src: '%id%&output=embed'
			}
		}
	};
	$.extend($.magnificPopup.proto, {

		initIframe: function() {
			var self = this;
			self.types.push('iframe');

			self.ev.on('mfpBeforeOpen', function() {

				self.ev.on({
					'mfpContentParse.mfpIframe' : function(e, item) {
						if(item.type === 'iframe') {
							self.parseIframe(item);
						}
					},
					'mfpClose.mfpIframe' : function() {
						if(self.isLowIE && self.currItem.type === 'iframe') {
							// ie black screen bug fix
							var el = self.content.find('iframe');
							if(el.length) {
								el.hide();
							}
						}
						self.ev.off('.mfpIframe');
					}
				});

			});

		},

		parseIframe: function(item) {
			var self = this;

			var patters = self.st.iframe.patterns;
			var embedSrc = item.src;
			var id;
			$.each(patters, function() {
				if(embedSrc.indexOf( this.index ) > -1) {
					if(this.id) {
						if(typeof this.id === 'string') {
							embedSrc = embedSrc.substr(embedSrc.lastIndexOf(this.id)+this.id.length, embedSrc.length);
						} else {
							embedSrc = this.id.call( this, embedSrc );
						}
					}
					
					embedSrc = this.src.replace('%id%', embedSrc );
					return false; //break
				}
			});

			item.view = self.st.iframe.markup.replace('%url%', embedSrc);

			// auto scaling of iframe
			// Technique stolen from FITVIDS.JS http://fitvidsjs.com/  (by Chris Coyier and Paravel)
			item.view = $(item.view).css('padding-top', (self.st.iframe.ratio * 100)+"%");	
		}

	});
	$.magnificPopup.modules.push( $.magnificPopup.proto.initIframe );
})(window.jQuery || window.Zepto);