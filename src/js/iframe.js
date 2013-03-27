
var IFRAME_NS = 'iframe';

$.magnificPopup.registerModule(IFRAME_NS, {

	options: {
		markup: '<div class="mfp-iframe-scaler"><div class="mfp-close"></div><iframe class="mfp-iframe" frameborder="0" allowfullscreen></iframe></div>',

		// we don't care and support only one default type of URL for each service. Without slow regexps
		patterns: {
			youtube: {
				// Supported url: youtube.com/watch?v=7HKoqNJtMTQ
				index: 'youtube.com/', 
				id: 'v=', // String or function that returns %id% for src param. Can be null.
				//  E.g.:
				//	id: function(url) {
				//		return '123123'; // returning ID
				//	}
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
	},

	proto: {
		initIframe: function() {
			mfp.types.push(IFRAME_NS);
			
			_mfpOn(CLOSE_EVENT + '.' + IFRAME_NS, function() {
				if(mfp.isIE7 && mfp.currItem.type === IFRAME_NS) {
					// ie black screen bug fix
					var el = mfp.content.find('iframe');
					if(el.length) {
						el.css('display', 'none');
					}
				}
			});
		},

		getIframe: function(item, template) {
			var embedSrc = item.src;
				
			$.each(mfp.st.iframe.patterns, function() {
				if(embedSrc.indexOf( this.index ) > -1) {
					if(this.id) {
						if(typeof this.id === 'string') {
							embedSrc = embedSrc.substr(embedSrc.lastIndexOf(this.id)+this.id.length, embedSrc.length);
						} else {
							embedSrc = this.id.call( this, embedSrc );
						}
					}
					embedSrc = this.src.replace('%id%', embedSrc );
					return false; // break;
				}
			});
			
			mfp._parseMarkup(template, {
				iframe_src: embedSrc
			}, item);

			return template;
		}
	}
});

