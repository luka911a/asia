define(['../dispatcher', '../resize/breakpoint.store', '../resize/resize.store'], function(dispatcher, store, resizeStore) {

	"use strict";

	var items = {}

	//!!!replace if setting data-attribute!
	var idName = 'new-id-';
	var idNum  = 1;
	var minText = {};
	var active = false;


	var _handleChange = function() {
		var storeData = store.getData();

		if (storeData.breakpoint.name === "desktop") {
			for (var key in items) {
				if (items[key].element.classList.contains('none-standart')) {
					continue;
				}
				var img = items[key].element.getElementsByTagName('img');
				if (img.length === 0) {
					items[key].element.style.padding = "0 18%";
					active = true;
				}
				minText[key] = {
					id: key,
					active: active
				}
				dispatcher.dispatch({
					type: 'user-text',
					minText: minText
				});
			}
		} else {
			for (var key in items) {
				if (items[key].element.classList.contains('none-standart')) {
					continue;
				}
				var img = items[key].element.getElementsByTagName('img');
				if (img.length === 0) {
					items[key].element.style.padding = "0";
				}
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
		elements = document.getElementsByClassName('user-text');
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

		resizeStore.eventEmitter.subscribe(_handleChange);
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