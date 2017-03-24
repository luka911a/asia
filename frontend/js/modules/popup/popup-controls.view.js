define(['../dispatcher', './popup.store', '../resize/resize.store', '../utils'], function(dispatcher, store, resizeStore, utils) {

	"use strict";

	var items = {}

	var idName = 'popup-control-id-';
	var idNum  = 1;
	var active = false;
	var inner;

	var circle = false;

	var _handleChange = function() {

		var storeData = store.getData();

		if (active === storeData.active) return;

		if (active && items.hasOwnProperty(active)) {
			items[active].element.classList.remove('active');
		}
		active = storeData.active;
		if (active && items.hasOwnProperty(active)) {
			items[active].element.classList.add('active');
			if (items[active].id === 'help' || items[active].id === 'calc' || items[active].id === 'letter') {
				animateUncover();
			}
		}
		if (storeData.active === false || items[active].id === 'menu') {
			animateCover();
		}
	}
	function animateUncover() {
		if (!circle) {
			circle = document.createElement('div');
			circle.classList.add('circle');
			
			circle.style.cssText = 'background: #ffffff; width: 0px; height: 0px; border-radius: 50%; position: fixed; right: -100px; bottom: -100px; z-index: 1000; transition: opacity 0.3s ease 0s;';
			inner.appendChild(circle);
		}
		
		var width = resizeStore.getData().width;
		var height = resizeStore.getData().height;
		var calc;
		if (width>height) {
			calc=width*2.5;
		} else {
			calc=height*2.5;
		}
		TweenMax.to(circle, 0.5, {width:calc, height:calc, x:"50%", y:"50%"});

		setTimeout(function del() {
			circle.style.opacity = "0";
		}, 500);
	}
	function animateCover() {
		if (!circle) {
			return;
		}
		circle.style.opacity = "1";
		TweenMax.to(circle, 0.3, {width:0, height:0, x:"50%", y:"50%"});

		setTimeout(function del() {
			circle.style.opacity = "0";
			circle.remove();
			circle = false;
		}, 300);
	}
	var _add = function(items, element) {
		var id = element.getAttribute('data-id');

		if (!id) {
			id = idName + idNum;
			idNum++;
		}

		element.addEventListener('click', _click);

		items[id] = {
			id: id,
			element: element
		}
	}
	function _click(e) {
		var id = e.currentTarget.getAttribute('data-id');
		if (id === 'call') {
			dispatcher.dispatch({
				type: 'popup-open',
				id: id
			});
		} else {
			dispatcher.dispatch({
				type: 'popup-toggle',
				id: id
			});
		}
	}

	var _remove = function(items, item) {
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


		elements = document.getElementsByClassName('view-popup-toggle');
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
		inner = document.getElementsByClassName('page-wrapper')[0];
		
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