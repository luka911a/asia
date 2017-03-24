define(['../dispatcher', './preload.store', '../images/images.store', '../utils', '../resize/breakpoint.store'], function(dispatcher, store, imagesStore, utils, breakpointStore) {

	"use strict";

	var pageWrapper;
	var elements;
	var imgItems = {};
	var videoItems = {};
	var total = 0;
	var complete = false;
	var loaded = 0;
	var startTime;
	var minTimeout = 300;
	var delay = 0;
	var preloader;
	var myAnim;
	var step1 = false;
	var step2 = false;
	var direction = "front";

	var idName = 'preload-image-id-';
	var idNum  = 1;

	var path = document.querySelector('head').getAttribute('data-path');
	if (path.slice(-1) !== '/') path += '/';


	var _handleChange = function() {
		
		var storeData = store.getData();

		if (complete === storeData.complete) return;
		complete = storeData.complete;

		pageWrapper.classList.add('load-complete');
		pageWrapper.classList.add('load-complete-once');

		setTimeout(function() {
			window.cancelAnimationFrame(myAnim);
			step2 = true;
		}, 700);

		dispatcher.dispatch({
			type: 'transition-step-2'
		});
	}

	var _loaded = function() {
		var currTime;

		currTime = Date.now();
		delay = currTime - startTime + minTimeout;

		if (delay < 0) delay = 0;

		setTimeout(function() {
			step1 = true;
			_start();
		}, delay);
	}
	function _start() {
		if (step1 === true && step2 === true) {
			preloader.style.opacity = "0";
			dispatcher.dispatch({
				type: 'preload-complete'
			});
		}
	}

	var _pagePreloader = function() {
		var img = document.getElementsByClassName('preloader-img')[0];
		img.style.opacity = "0";
		var start = 140;
		var totalImg = 254;
		var imgLoadNum = 1;
		
		isLoadingImg();
		function preloadImg() {
			var loadImg = new Image();
    		loadImg.src = path + "preloader/img" + imgLoadNum + ".jpg";
    		imgLoadNum++;
    		isLoadingImg();
    	}

		function isLoadingImg() {
			if (imgLoadNum === 254) {
				img.style.opacity = "1";
				myAnim = requestAnimationFrame(step);
			} else {
				preloadImg();
			}
		}

		function step() {
			if (direction === 'front') {
				start++
			} else if (direction === 'back') {
				start--
			}
			step2 = false;
			img.setAttribute("src", path + "preloader/img" + start + ".jpg");

			if (start === 254) {	
				direction = 'back'
				step2 = true;
				_start();
			} else if (start === 1) {
				direction = 'front'
			}
		
		    myAnim = requestAnimationFrame(step);
		  }
	}

	var _handleImages = function() {
		var storeData = imagesStore.getData();

		var checkItem = function(item) {
			var storeItem;
			if (!storeData.items.hasOwnProperty(item.id)) return;
			if (item.loaded) return;
			storeItem = storeData.items[item.id];
			if (storeItem.loaded) {
				loaded++;
				item.loaded = true;
			}
		}
		for (var id in imgItems) {
			if (imgItems.hasOwnProperty(id)) {
				checkItem(imgItems[id]);
			}
		}

		if (loaded >= total) {
			_loaded();
		}
	}

	var _add = function(element, items) {
		var id = element.getAttribute('data-preload-id');

		if (!id) {
			id = idName + idNum;
			idNum++;
			element.setAttribute('data-preload-id', id);
		}

		items[id] = {
			id: id,
			element: element,
			loaded: false
		}
	}

	var _handleWheel = function(e) {
		e.preventDefault();
	}
	var _setupHandlers = function() {
		window.addEventListener('mousewheel', _handleWheel);
		document.addEventListener('mousewheel', _handleWheel);
		document.addEventListener('DOMMouseScroll', _handleWheel);
		document.addEventListener('keydown', _handleWheel);
		document.addEventListener('touchmove', _handleWheel);
	}

	var _removeHandlers = function() {
		window.removeEventListener('mousewheel', _handleWheel);
		document.removeEventListener('mousewheel', _handleWheel);
		document.removeEventListener('DOMMouseScroll', _handleWheel);
		document.removeEventListener('keydown', _handleWheel);
		document.removeEventListener('touchmove', _handleWheel);
	}

	var _handleMutate = function() {
		// _setupHandlers();
		pageWrapper = document.querySelector('.page-wrapper');
		elements    = document.querySelectorAll('.wait-load-image');

		imgItems = {};
		total  = 0;
		complete = false;
		loaded = 0;

		pageWrapper.classList.remove('load-complete');
		dispatcher.dispatch({
			type: 'preload-reset'
		});

		total = elements.length;

		startTime = Date.now();

		for (var i = 0; i < elements.length; i++) {
			_add(elements[i], imgItems);
		}

		if (total === 0) {
			_loaded();
		}

	}

	var init = function() {
		preloader = document.getElementById('preloader');
		_handleMutate();
		_handleChange();
		_handleImages();
		_pagePreloader();

		store.eventEmitter.subscribe(_handleChange);
		imagesStore.eventEmitter.subscribe(_handleImages);

		dispatcher.subscribe(function(e) {
			if (e.type === 'mutate') {
				_handleMutate();
				_handleChange();
				_handleImages();
			}
		});
	}

	return {
		init: init
	}
});