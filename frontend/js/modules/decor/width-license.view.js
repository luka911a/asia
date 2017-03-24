define(['../dispatcher', '../resize/breakpoint.store'], function(dispatcher, store) {

	"use strict";

	var items = {}

	//!!!replace if setting data-attribute!
	var idName = 'new-id-';
	var idNum  = 1;


	var _handleChange = function() {
		var storeData = store.getData().breakpoint.name;
		for (var key in items) {
			if (storeData === "mobile") {
				var width = 0;
				var item = items[key].element.getElementsByClassName('item');
				for (var i = 0; i < item.length; i++) {
					if (i === 0) {
						width += item[i].offsetWidth;
					} else {
						width += item[i].offsetWidth + 30;
					}
				}
				items[key].element.style.width = width + "px";
			} else {
				items[key].element.style.width = "";
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
		var license = document.getElementsByClassName('license')[0];
		if (!license) {
			return
		}
		elements = license.getElementsByClassName('container');
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


