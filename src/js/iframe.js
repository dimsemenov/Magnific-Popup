

$.magnificPopup.registerModule('iframe', {

	options: {
		markup: '<div class="mfp-iframe-scaler"><iframe class="mfp-video" src="%url%" frameborder="0" allowfullscreen></iframe></div>',
		ratio: 9/16,

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
			var self = this,
				ns = '.iframe';
			self.types.push('iframe');

			self.on('ContentParse'+ns, function(e, item) {
				if(item.type === 'iframe') {
					self.parseIframe(item);
				}
			});
			self.on('Close'+ns, function() {
				if(self.isLowIE && self.currItem.type === 'iframe') {
					// ie black screen bug fix
					var el = self.content.find('iframe');
					if(el.length) {
						el.hide();
					}
				}
			});
		},

		parseIframe: function(item) {
			var self = this,
				embedSrc = item.src;
				
			$.each(self.st.iframe.patterns, function() {
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
	}
});

