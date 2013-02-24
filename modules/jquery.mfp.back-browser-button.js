/**
 *
 * Magnific Popup Experimental Module - Back Browser Button To Close Popup
 * @version 0.0.1:
 *
 */
;(function($) {

	"use strict";
	 
	$.extend($.magnificPopup.proto, {

		initBackBrowserButton: function() {
			var self = this,
				enabled = false;

			/**
			 * Known bugs:
			 * - iOS scroll jumping 
			 * - When absolute position is used browser scrolls back to original position  
			 */
			//Only when browser supports history API. iOS has a bug related to position of scroll, so we disable it.
			if(enabled && !self.isIOS && window.history && window.history.pushState) {

				var getTrueHash = function () {
						var str = window.location.href,
							c = str.indexOf("#");
						if(c !== -1) {
							return str.substr(c)
						} else {
							return '';
						}
					};

				self.ev.on('mfpOpen', function() {

					if(self._forwardAction) {
						return;
					}
					var hash = getTrueHash();
					self.currHash = hash;

					// get true hash, as location.hash doesn't always include "#" char
					var anchor = '#';
					if(!hash) {
						hash = anchor;
					} else if(self.currHash === anchor) {
						hash = '';
					} else {
						// if last char is #
						if(hash.substr(-1) === anchor) {
							hash = hash.slice(0,-1);
						} else {
							hash += anchor;
						}
					}
					var fullURL = window.location.href.split("#")[0];
					self.newHash = hash;
					history.pushState({a:1}, document.title, fullURL + hash);
					
				});

				// TODO: implement IOS hashchange bug fix
				self.win.on('hashchange.lb', function() {
					if(self.isOpen) {
						if(getTrueHash() === self.currHash) {
							self._browserAction = true;
							self.close(true);
						}
					} else {
						if(getTrueHash() === self.newHash) {
							self._forwardAction = true;
							//var fullURL = window.location.href.split("#")[0];
							//history.replaceState({a:1}, document.title, fullURL + self.newHash);
							self.open(self.currData);
							self._forwardAction = false;
						}
					}
					
				});

				self.ev.on('mfpClose', function() {
					if(!self._browserAction) {
						history.back();
					} else {
						self._browserAction = false;
					}
				});

			}

		}

	});
	$.magnificPopup.modules.push( $.magnificPopup.proto.initBackBrowserButton );
})(window.jQuery || window.Zepto);