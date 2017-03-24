define(['../dispatcher', '../resize/resize.store', '../resize/breakpoint.store', './user-text.store'], function(dispatcher, store, breakpoint, userTextStore) {

	"use strict";

	var items = {}

	//!!!replace if setting data-attribute!
	var idName = 'new-id-';
	var idNum  = 1;
	var point = "";


	var _handlePoint = function() {
		point = breakpoint.getData().breakpoint.name;
	}
	var _handleChange = function() {
		var storeData = userTextStore.getData();

		var wrapper = document.getElementsByClassName('wrapper')[0];
		var wrapperW = wrapper.offsetWidth;

		for (var key in items) {
			if (items[key].element.parentNode.parentNode.classList.contains('none-standart')) {
				continue;
			}
			if (point === "desktop" && storeData.minText === false) {
				items[key].element.style.width = (wrapper.offsetWidth * 0.81) + "px";
			} else if (point === "desktop" && storeData.minText === true) {;
				items[key].element.style.width = (wrapper.offsetWidth * 0.81) + "px";
				items[key].element.style.marginLeft = "-13%";
			}

		}
	}

	var _add = function(items, element) {
		var id = element.getAttribute('data-id');

		if (!id) {
			id = idName + idNum;
			idNum++;

			//setAttribute('data-id', id);
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

		//-------
		elements = document.getElementsByTagName('blockquote');
		for (var i = 0; i < elements.length; i++) {
			check(items, elements[i]);
		}
		for (var id in items) {
			if (items.hasOwnProperty(id)) {
				backCheck(items, elements, items[id]);
			}
		}
		//-------
	}

	var init = function() {
		_handleMutate();
		_handlePoint();
		_handleChange();

		userTextStore.eventEmitter.subscribe(_handleChange);
		breakpoint.eventEmitter.subscribe(_handlePoint);
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