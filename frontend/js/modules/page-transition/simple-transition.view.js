define(['../dispatcher', './page-transition.store', '../resize/resize.store', '../utils'], function(dispatcher, store, resizeStore, utils) {

	"use strict";

	var body;

	var idName = 'simple-load-id-';
	var idNum  = 1;

	var animation = false;
	var preloaderElement;
	var transform;
	var scroll;

	var requestAnimationFrame;
	var counter = 0;
	var tl;

	var _preventScroll = function(e) {
		e.preventDefault();
	}

	var _animate = function() {

		var loop = function() {

			counter += 0.5;

			preloaderElement.style.width = counter + "%";

			if (counter === 80) {
				return
			} else if (counter >= 100) {
				return
			}

			requestAnimationFrame(loop);
		}

		loop();
	}


	var _animateStep1 = function(e) {
		animation = e.animation;
		var pw = document.getElementsByClassName('page-wrapper')[0];

		if (animation !== 'simple') return;

		tl = new TimelineLite();

		tl.to(preloaderElement, 0, {
			opacity: 0
		});
		tl.to(preloaderElement, 0.6, {
			onStart: function() {
				counter = 0;
				_animate();
				preloaderElement.style.display = 'block';
				pw.classList.remove('transition-animation-complete');
				
				dispatcher.dispatch({
					type: 'popup-close-all'
				});
			},
			opacity: 1,
			onComplete: function() {
				dispatcher.dispatch({
					type: 'transition-step-1',
					animation: 'simple'
				});
				dispatcher.dispatch({
					type: 'transition-step-2',
					animation: 'simple'
				});
			}
		});
	}

	var _animateStep2 = function() {
		var pw = document.getElementsByClassName('page-wrapper')[0];

		// if (animation !== 'simple') return;

		tl.to(preloaderElement, 0.6, {
			onStart: function() {
				counter = 81;
				_animate();
				pw.classList.add('transition-animation-complete');
			},
			opacity: 0,
			onComplete: function() {
				preloaderElement.style.display = 'none';
				animation = false;

				setTimeout(function() {
					dispatcher.dispatch({
						type: 'transition-step-reset',
						animation: false
					});
				}, 20)
			}
		});
	}

	var _remove = function(items, item) {
		delete items[item.id];
	}

	var _handleMutate = function() {
		preloaderElement = document.getElementById('simple-preloader');
		if (!preloaderElement) {
			console.warn('simple-preloader is missing');
			return;
		}
	}

	var _handle = function() {
		var storeData = store.getData();

		if (storeData.step1ready === true && storeData.step2ready === true) {
			_animateStep2();
		}
	}

	var init = function() {
		body = document.getElementsByTagName('body')[0];
		transform = Modernizr.prefixed('transform');

		requestAnimationFrame = utils.getRequestAnimationFrame();

		_handleMutate();
		_handle();
		store.eventEmitter.subscribe(_handle);

		dispatcher.subscribe(function(e) {
			if (e.type === 'link-animation-start') {
				_animateStep1(e);
			}
		});
	}

	return {
		init: init
	}
});