/*
	Spectral by HTML5 UP
	html5up.net | @n33co
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {
	var settings = {

		// Carousels
			carousels: {
				speed: 4,
				fadeIn: true,
				fadeDelay: 250
			},

	};
	skel
		.breakpoints({
			xlarge:	'(max-width: 1680px)',
			large:	'(max-width: 1280px)',
			medium:	'(max-width: 980px)',
			small:	'(max-width: 736px)',
			xsmall:	'(max-width: 480px)'
		});

	$(function() {

		var	$window = $(window),
			$body = $('body'),
			$wrapper = $('#page-wrapper'),
			$banner = $('#banner'),
			$header = $('#header');

		// Disable animations/transitions until the page has loaded.
			$body.addClass('is-loading');

			$window.on('load', function() {
				window.setTimeout(function() {
					$body.removeClass('is-loading');
				}, 100);
			});

		// Mobile?
			if (skel.vars.mobile)
				$body.addClass('is-mobile');
			else
				skel
					.on('-medium !medium', function() {
						$body.removeClass('is-mobile');
					})
					.on('+medium', function() {
						$body.addClass('is-mobile');
					});

		// Fix: Placeholder polyfill.
			$('form').placeholder();

		// Prioritize "important" elements on medium.
			skel.on('+medium -medium', function() {
				$.prioritize(
					'.important\\28 medium\\29',
					skel.breakpoint('medium').active
				);
			});

		// Scrolly.
			$('.scrolly')
				.scrolly({
					speed: 1500,
					offset: $header.outerHeight()
				});

		// Menu.
			$('#menu')
				.append('<a href="#menu" class="close"></a>')
				.appendTo($body)
				.panel({
					delay: 500,
					hideOnClick: true,
					hideOnSwipe: true,
					resetScroll: true,
					resetForms: true,
					side: 'right',
					target: $body,
					visibleClass: 'is-menu-visible'
				});

		// Header.
			if (skel.vars.IEVersion < 9)
				$header.removeClass('alt');

			if ($banner.length > 0
			&&	$header.hasClass('alt')) {

				$window.on('resize', function() { $window.trigger('scroll'); });

				$banner.scrollex({
					bottom:		$header.outerHeight() + 1,
					terminate:	function() { $header.removeClass('alt'); },
					enter:		function() { $header.addClass('alt'); },
					leave:		function() { $header.removeClass('alt'); }
				});

			}
		// Carousels.
			$('.carousel').each(function() {

				var	$t = $(this),
					$forward = $('<span class="forward"></span>'),
					$backward = $('<span class="backward"></span>'),
					$reel = $t.children('.reel'),
					$items = $reel.children('article');

				var	pos = 0,
					leftLimit,
					rightLimit,
					itemWidth,
					reelWidth,
					timerId;

				// Items.
					if (settings.carousels.fadeIn) {

						$items.addClass('loading');

						$t.onVisible(function() {
							var	timerId,
								limit = $items.length - Math.ceil($window.width() / itemWidth);

							timerId = window.setInterval(function() {
								var x = $items.filter('.loading'), xf = x.first();

								if (x.length <= limit) {

									window.clearInterval(timerId);
									$items.removeClass('loading');
									return;

								}

								if (skel.vars.IEVersion < 10) {

									xf.fadeTo(750, 1.0);
									window.setTimeout(function() {
										xf.removeClass('loading');
									}, 50);

								}
								else
									xf.removeClass('loading');

							}, settings.carousels.fadeDelay);
						}, 50);
					}

				// Main.
					$t._update = function() {
						pos = 0;
						rightLimit = (-1 * reelWidth) + $window.width();
						leftLimit = 0;
						$t._updatePos();
					};

					if (skel.vars.IEVersion < 9)
						$t._updatePos = function() { $reel.css('left', pos); };
					else
						$t._updatePos = function() { $reel.css('transform', 'translate(' + pos + 'px, 0)'); };

				// Forward.
					$forward
						.appendTo($t)
						.hide()
						.mouseenter(function(e) {
							timerId = window.setInterval(function() {
								pos -= settings.carousels.speed;

								if (pos <= rightLimit)
								{
									window.clearInterval(timerId);
									pos = rightLimit;
								}

								$t._updatePos();
							}, 10);
						})
						.mouseleave(function(e) {
							window.clearInterval(timerId);
						});

				// Backward.
					$backward
						.appendTo($t)
						.hide()
						.mouseenter(function(e) {
							timerId = window.setInterval(function() {
								pos += settings.carousels.speed;

								if (pos >= leftLimit) {

									window.clearInterval(timerId);
									pos = leftLimit;

								}

								$t._updatePos();
							}, 10);
						})
						.mouseleave(function(e) {
							window.clearInterval(timerId);
						});

				// Init.
					$window.load(function() {

						reelWidth = $reel[0].scrollWidth;

						skel.on('change', function() {

							if (skel.vars.touch) {

								$reel
									.css('overflow-y', 'hidden')
									.css('overflow-x', 'scroll')
									.scrollLeft(0);
								$forward.hide();
								$backward.hide();

							}
							else {

								$reel
									.css('overflow', 'visible')
									.scrollLeft(0);
								$forward.show();
								$backward.show();

							}

							$t._update();

						});

						$window.resize(function() {
							reelWidth = $reel[0].scrollWidth;
							$t._update();
						}).trigger('resize');

					});

			});
			// Gallery.
			$window.on('load', function() {

				var $gallery = $('.gallery');

				$gallery.poptrox({
					baseZIndex: 10001,
					useBodyOverflow: false,
					usePopupEasyClose: false,
					overlayColor: '#1f2328',
					overlayOpacity: 0.65,
					usePopupDefaultStyling: false,
					usePopupCaption: true,
					popupLoaderText: '',
					windowMargin: 50,
					usePopupNav: true
				});

				// Hack: Adjust margins when 'small' activates.
					skel
						.on('-small', function() {
							$gallery.each(function() {
								$(this)[0]._poptrox.windowMargin = 50;
							});
						})
						.on('+small', function() {
							$gallery.each(function() {
								$(this)[0]._poptrox.windowMargin = 5;
							});
						});

			});
			// Section transitions.
			if (skel.canUse('transition')) {

				var on = function() {

					// Galleries.
						$('.gallery')
							.scrollex({
								top:		'30vh',
								bottom:		'30vh',
								delay:		50,
								initialize:	function() { $(this).addClass('inactive'); },
								terminate:	function() { $(this).removeClass('inactive'); },
								enter:		function() { $(this).removeClass('inactive'); },
								leave:		function() { $(this).addClass('inactive'); }
							});
						

				};

				var off = function() {

					// Galleries.
						$('.gallery')
							.unscrollex();


				};

				skel.on('change', function() {

					if (skel.breakpoint('small').active)
						(off)();
					else
						(on)();

				});

			}


	});

})(jQuery);
