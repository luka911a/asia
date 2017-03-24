define(['../dispatcher', './popup.store', '../resize/breakpoint.store'], function(dispatcher, store, breakpointStore) {

	"use strict";

	var items = {}

	var idName = 'popup-id-';
	var idNum  = 1;
	var pw;
	var body;
	var active = false;

	var _preventTouchScroll = function(e) {
		//e.preventDefault();
		e.stopPropagation();
	}

	var _handleChange = function(storeData) {
		var storeData = store.getData();

		var ww1 = document.documentElement.clientWidth;
		var ww2;
		var diff = 0;
		var overflow = false;

		if (active === storeData.active) return;

		if (items.hasOwnProperty(storeData.active)) {
			overflow = items[storeData.active].element.getElementsByClassName('popup-overflow')[0];
		}

		if (active) {
			if (storeData.active === "call" && breakpointStore.getData().breakpoint.name === "desktop") {
				body.classList.remove('prevent-scroll-1');
				body.classList.add('prevent-scroll-2');
			}
			if (storeData.active === "menu" || storeData.active === "job-popup") {
				body.classList.add('prevent-scroll-1');
			}
			
			if (items[active]) items[active].element.classList.remove('active');
			if (items[active] && items[active].inner) {
				items[active].inner.style.paddingRight = '0px';
			}
		} else {
			dispatcher.dispatch({
				type: 'overlay-show'
			});
			if (overflow) {
				overflow.addEventListener('touchmove', _preventTouchScroll);
			}
			// body.addEventListener('touchmove', _preventTouchScroll);

			if (storeData.active === "menu") {
				body.classList.add('prevent-scroll-1');
			} else if (storeData.active === "ask" || storeData.active === "job-popup") {
				body.classList.add('prevent-scroll-2');
			} else {
				body.classList.add('prevent-scroll');
			}
			
			ww2 = document.documentElement.clientWidth;
			diff = ww2 - ww1;
			if (diff < 0) diff = 0;
		}

		active = storeData.active;

		if (active) {
			if (items[active]) items[active].element.classList.add('active');
			if (items[active] && items[active].inner) {
				items[active].inner.style.paddingRight = diff + 'px';
			}
		} else {
			dispatcher.dispatch({
				type: 'overlay-hide'
			});

			if (overflow) {
				overflow.removeEventListener('touchmove', _preventTouchScroll);
			}
			// body.removeEventListener('touchmove', _preventTouchScroll);
			body.classList.remove('prevent-scroll');
			body.classList.remove('prevent-scroll-1');
			body.classList.remove('prevent-scroll-2');
		}

		if (pw) {
			pw.style.marginRight = diff + 'px';
		}
	}

	var _add = function(items, element) {
		var id = element.getAttribute('data-id');
		var inner = element.getElementsByClassName('overlay')[0];

		if (!id) {
			id = idName + idNum;
			idNum++;
		}

		items[id] = {
			id: id,
			element: element,
			inner: inner
		}

		dispatcher.dispatch({
			type: 'popup-add',
			id: id
		});

		if (element.classList.contains('active')) {
			active = id;
			dispatcher.dispatch({
				type: 'popup-open',
				id: id
			});
		}
	}

	var _remove = function(items, item) {
		dispatcher.dispatch({
			type: 'popup-remove',
			id: id
		});

		delete items[item.id];
	}

	var _handleMutate = function() {
		var elements;

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

		pw = document.getElementsByClassName('page-wrapper')[0];
		body = document.getElementsByTagName('body')[0];

		if (!pw) {
			console.warn('page-wrapper element is missing');
		}

		elements = document.getElementsByClassName('view-popup');
		for (var i = 0; i < elements.length; i++) {
			check(items, elements[i]);
		}
		for (var id in items) {
			if (items.hasOwnProperty(id)) {
				backCheck(items, elements, items[id]);
			}
		}
	}

	var init = function() {
		_handleMutate();
		_handleChange();

		store.eventEmitter.subscribe(_handleChange);

		dispatcher.subscribe(function(e) {
			if (e.type === 'mutate') {
				_handleMutate();
				_handleChange();
			}
		});
	}

	return {
		init: init
	}
});