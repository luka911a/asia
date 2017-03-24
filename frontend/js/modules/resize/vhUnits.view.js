define(['../dispatcher', './resize.store'], function(dispatcher, store) {

	"use strict";

	var items = {}

	var idName = 'vh-units-id-';
	var idNum  = 1;


	var _handleChange = function() {
		var storeData = store.getData();
		var wh = storeData.height;
		var ww = storeData.width;

		// document.documentElement.style.height = (window.innerHeight) + 'px';

		var checkItem = function(item) {
			if (ww >= 1000) {
				item.element.style.height = (storeData.height - item.shift1000) + 'px';
			} else if (ww >= 640) {
				item.element.style.height = (storeData.height - item.shift640) + 'px';
			} else if (ww >= 0) {
				item.element.style.height = (storeData.height - item.shift0) + 'px';
			}
		}

		for (var id in items) {
			if (items.hasOwnProperty(id)) {
				checkItem(items[id]);
			}
		}

		// dispatcher.dispatch({
		// 	type: 'fire-resize',
		// 	me: 'vhUnits.view'
		// });
	}

	var _add = function(items, element) {
		var id = element.getAttribute('data-id');
		var shift1000 = element.getAttribute('data-shift1000') || false;
		var shift640  = element.getAttribute('data-shift640') || false;
		var shift0    = element.getAttribute('data-shift0') || false;

		if (shift0 === false) {
			shift0 = 0;
		}
		if (shift640 === false) {
			shift640 = shift0;
		}
		if (shift1000 === false) {
			shift1000 = shift640;
		}

		shift1000 = parseInt(shift1000);
		shift640  = parseInt(shift640);
		shift0    = parseInt(shift0);

		if (!id) {
			id = idName + idNum;
			idNum++;
		}

		items[id] = {
			id: id,
			shift1000: shift1000,
			shift640:  shift640,
			shift0:    shift0,
			element:   element
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


		elements = document.getElementsByClassName('vh-height');
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
		// if (Modernizr.cssvhunit) return;

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