define(['../dispatcher', './page-transition.store', '../resize/breakpoint.store'], function(dispatcher, store, breakpointStore) {

	"use strict";

	var projectOverlay;
	var imgContainer;
	var body;
	var items = {}
	var imgs  = {}
	var activeImg  = false;
	var activeItem = false;

	var idName = 'project-section-id-';
	var idNum  = 1;

	var id = false;
	var animation = false;
	var transitionDelay;

	var _preventScroll = function(e) {
		e.preventDefault();
	}

	var _animateStep1 = function(e) {
		var item;
		var tl;
		var pw = document.getElementsByClassName('page-wrapper')[0];

		//здесь мы получаем id и анимацию чтобы потом их проверять на следующих этапах
		id = e.id;
		animation = e.animation;
		if (animation !== 'project') return;

		tl = new TimelineLite();

		if (!items.hasOwnProperty(id)) {
			console.warn('project-section with id ' + id + ' is missing');
			return;
		}

		dispatcher.dispatch({
			type: 'project-open',
			id: id
		});

		item = items[id];

		if (breakpointStore.getData().breakpoint.name === 'mobile' && 
			imgContainer.getAttribute('id') === 'project-preloader-img-serv' ||
			breakpointStore.getData().breakpoint.name === 'tablet' && 
			imgContainer.getAttribute('id') === 'project-preloader-img-serv' ||
			breakpointStore.getData().breakpoint.name === 'mobile' && 
			imgContainer.getAttribute('id') === 'project-preloader-img-case') {

			TweenMax.to(imgContainer, 0, {top: "100%", y: "-545px"});
		} else if (breakpointStore.getData().breakpoint.name === 'desktop' && 
				   imgContainer.getAttribute('id') === 'project-preloader-img-serv') {

			TweenMax.to(imgContainer, 0, {top: "100%", y: "-480px"});
		} else if (breakpointStore.getData().breakpoint.name === 'mobile' && 
				   imgContainer.getAttribute('id') === 'project-preloader-img-blog') {

			TweenMax.to(imgContainer, 0, {top: "100%", y: "-702px"});
		} else if (breakpointStore.getData().breakpoint.name === 'tablet' && 
				   imgContainer.getAttribute('id') === 'project-preloader-img-blog') {

			TweenMax.to(imgContainer, 0, {top: "100%", y: "-666px"});
		} else if (breakpointStore.getData().breakpoint.name === 'desktop' && 
				   imgContainer.getAttribute('id') === 'project-preloader-img-blog') {

			TweenMax.to(imgContainer, 0, {top: "100%", y: "-600px"});
		} else if (breakpointStore.getData().breakpoint.name === 'desktop' && 
				   imgContainer.getAttribute('id') === 'project-preloader-img-blog' ||
				   breakpointStore.getData().breakpoint.name === 'tablet' && 
				   imgContainer.getAttribute('id') === 'project-preloader-img-case' ||
				   breakpointStore.getData().breakpoint.name === 'desktop' && 
				   imgContainer.getAttribute('id') === 'project-preloader-img-case') {

			TweenMax.to(imgContainer, 0, {top: "100%", y: "-600px"});
		}
		

		var arrow = item.element.getElementsByClassName('arrow')[0];

		tl.to(item.element, 0.6, {
			onStart: function() {

				body.classList.add('prevent-scroll-2');
				body.addEventListener('touchmove', _preventScroll);

				if (activeImg && imgs.hasOwnProperty(activeImg)) {
					imgs[activeImg].element.classList.remove('active');
				}
				activeImg = item.id;
				if (activeImg && imgs.hasOwnProperty(activeImg)) {
					imgs[activeImg].element.classList.add('active');
				}
				if (breakpointStore.getData().breakpoint.name === 'mobile') {
					dispatcher.dispatch({
						type:    'scroll-to',
						element: arrow,
						speed:   0.5
					});
				} else {
					dispatcher.dispatch({
						type:    'scroll-to',
						element: item.element,
						speed:   0.5
					});
				}

				item.element.classList.add('project-loading');
			}
		});
		tl.to(projectOverlay, 0.6, {
			onStart: function() {
				pw.classList.remove('transition-animation-complete');
				projectOverlay.style.display = 'block';
			},
			onComplete: function() {
				dispatcher.dispatch({
					type: 'transition-step-1',
					animation: 'project'
				});
			},
			
		});
	}

	var _animateStep2 = function() {
		var tl;
		var pw = document.getElementsByClassName('page-wrapper')[0];

		if (animation !== 'project') return;

		tl = new TimelineLite();

		tl.to(projectOverlay, 1.2, {
			onStart: function() {
				if (breakpointStore.getData().breakpoint.name === 'mobile' && 
					imgContainer.getAttribute('id') === 'project-preloader-img-serv') {

					TweenMax.to(imgContainer, 0.6, {top: "80px", y: "0"});
				} else if (breakpointStore.getData().breakpoint.name === 'tablet' && 
					imgContainer.getAttribute('id') === 'project-preloader-img-serv' ||
					breakpointStore.getData().breakpoint.name === 'desktop' && 
					imgContainer.getAttribute('id') === 'project-preloader-img-serv') {

					TweenMax.to(imgContainer, 0.6, {top: "120px", y: "0"});
				} else if (imgContainer.getAttribute('id') === 'project-preloader-img-blog' ||
						   imgContainer.getAttribute('id') === 'project-preloader-img-case') {
					
					TweenMax.to(imgContainer, 0.6, {top: "0", y: "0"});
				}
				
				imgContainer.classList.add('move');
			},
			onComplete: function() {
				if (items.hasOwnProperty(id)) {
					items[id].element.classList.remove('project-loading');
				}
				dispatcher.dispatch({
					type: 'transition-step-2',
					animation: 'project'
				});
			}
		});
	}

	var _animateStep3 = function() {
		var tl;
		var storeData = store.getData();
		var pw = document.getElementsByClassName('page-wrapper')[0];

		if (animation !== 'project') return;

		tl = new TimelineLite();

		tl.to(projectOverlay, 0.6, {
			
			onStart: function() {
				pw.classList.add('transition-animation-complete');
			},
			onComplete: function() {
				imgContainer.classList.remove('move');
				projectOverlay.style.display = 'none';
				body.classList.remove('prevent-scroll-2');
				body.removeEventListener('touchmove', _preventScroll);

				if (activeImg && imgs.hasOwnProperty(activeImg)) {
					imgs[activeImg].element.classList.remove('active');
					activeImg = false;
				}

				animation = false;
				dispatcher.dispatch({
					type: 'transition-step-reset',
					animation: false
				});
			}
		});
	}


	var _add = function(items, element) {
		var id    = element.getAttribute('data-id');

		if (!id) {
			id = idName + idNum;
			idNum++;
		}

		items[id] = {
			id: id,
			element: element
		}
	}

	var _remove = function(items, item) {
		delete items[item.id];
	}

	var _handleMutate = function() {
		var elements;
		var imgElements;

		var check = function(items, element) {
			var found = false;
			for (var id in items) {
				if (items.hasOwnProperty(id)) {
					if (items[id].element === element) {
						found = true;
						break;
					}
				}
			}
			if (!found) {
				_add(items, element);
			}
		}

		var backCheck = function(items, elements, item) {
			var element = item.element;
			var found   = false;

			for (var i = 0; i < elements.length; i++) {
				if (elements[i] === item.element) {
					found = true;
					break;
				}
			}

			if (!found) {
				_remove(items, item);
			}
		}
		var replaceable = document.getElementsByClassName('replaceable')[0];
		if (replaceable.getAttribute("data-page") === 'service') {
			imgContainer   = document.getElementById('project-preloader-img-serv');
		} else if (replaceable.getAttribute("data-page") === 'blog') {
			imgContainer   = document.getElementById('project-preloader-img-blog');
		} else if (replaceable.getAttribute("data-page") === 'case') {
			imgContainer   = document.getElementById('project-preloader-img-case');
		}

		projectOverlay = document.getElementById('project-preloader');

		if (!projectOverlay) {
			console.warn('project-overlay element is missing!');
			return;
		}
		if (!imgContainer) {
			console.warn('project-preloader-img is missing');
			return;
		}

		elements = document.getElementsByClassName('project-preview');
		for (var i = 0; i < elements.length; i++) {
			check(items, elements[i]);
		}
		for (var id in items) {
			if (items.hasOwnProperty(id)) {
				backCheck(items, elements, items[id]);
			}
		}

		imgElements = document.getElementsByClassName('project-preload-img');
		for (var i = 0; i < imgElements.length; i++) {
			check(imgs, imgElements[i]);
		}
		for (var id in imgs) {
			if (imgs.hasOwnProperty(id)) {
				backCheck(imgs, imgElements, imgs[id]);
			}
		}
	}

	var _handle = function() {
		var storeData = store.getData();
		if (storeData.step1ready === true && storeData.step2ready === false) {
			_animateStep2();
		}
		if (storeData.step1ready === true && storeData.step2ready === true) {
			_animateStep3();
		}
	}

	var init = function() {
		_handleMutate();

		body = document.getElementsByTagName('body')[0];

		transitionDelay = Modernizr.prefixed('transition-delay');

		_handle();
		store.eventEmitter.subscribe(_handle);


		dispatcher.subscribe(function(e) {
			if (e.type === 'mutate') {
				_handleMutate();
			}

			if (e.type === 'link-animation-start') {
				_animateStep1(e);
			}
		});
	}

	return {
		init: init
	}
});