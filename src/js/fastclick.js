/**
 * Fast click event for touch devices
 *
 * Thx to Ryan Fioravanti 
 * 
 * https://developers.google.com/mobile/articles/fast_buttons
 */
(function() {
	var ghostClickDelay = 1000,
		supportsTouch,
		unbindTouchMove,
		eName = 'magnificFastClick',
		ns = '.'+eName;

	var st = $.magnificPopup;

	if(st && st.defaults && st.defaults.gallery) {
		st.defaults.gallery.arrowClickEvent = 'magnificFastClick';
	}

	$.event.special[eName] = {

		setup: function() {
			var elem = $(this),
				lock;

			if( 'ontouchstart' in window ) {

				unbindTouchMove = function() {
					_window.off('touchmove'+ns+' touchend'+ns);
				};

				supportsTouch = true;

				var timeout,
					startX,
					startY,
					pointerMoved,
					point,
					numPointers;

				elem.on('touchstart' + ns, function(e) {
					var startTarget = e.target;
					pointerMoved = false;
					numPointers = 1;
					point = e.originalEvent.touches[0];
					startX = point.clientX;
					startY = point.clientY;

					_window.on('touchmove'+ns, function(e) {
						point = e.originalEvent.touches;
						numPointers = point.length;
						point = point[0];
						if (Math.abs(point.clientX - startX) > 10 ||
							Math.abs(point.clientY - startY) > 10) {
							pointerMoved = true;
							unbindTouchMove();
						}
					}).on('touchend'+ns, function(e) {

						unbindTouchMove();

						if(pointerMoved || numPointers > 1) {
							return;
						}
						lock = true;
						e.preventDefault();
						clearTimeout(timeout);
						timeout = setTimeout(function() {
							lock = false;
						}, ghostClickDelay);

						elem.triggerHandler({
							type: eName,
							target: startTarget
						});
					});
				});

			}

			elem.on('click' + ns, function(e) {
				if(!lock) {
					elem.triggerHandler({
						type: eName,
						target: e.target
					});
				}
			});
		},
		
		teardown: function() {
			$(this).off('touchstart' + ns + ' click' + ns);
			if(supportsTouch) unbindTouchMove();
		}
	};
})();