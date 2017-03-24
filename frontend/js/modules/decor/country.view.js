define(['../dispatcher', './country.store'], function(dispatcher, store) {

	"use strict";

	var items = {}

	//!!!replace if setting data-attribute!
	var idName = 'new-id-';
	var idNum  = 1;
	var container;

	var _handleChange = function() {
		var storeData = store.getData();
		var active = store.getData().active;
 
		if (container) {
			container.children[0].children[0].innerHTML = items[active].element.children[0].innerHTML;
		}
	}

	var _add = function(items, element) {
		var id = element.getAttribute('data-id');

		if (!id) {
			id = idName + idNum;
			idNum++;

			//setAttribute('data-id', id);
		}
		element.addEventListener('click', function () {
			dispatcher.dispatch({
				type: 'country-toggle',
				id: id
			});
			var map = document.getElementsByClassName("map-view")[0];
			dispatcher.dispatch({
				type:    'scroll-to',
				element: map,
				speed:   0.5
			});

		})
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
		container = document.getElementsByClassName('head-agcy')[0];
		elements = document.getElementsByClassName('item-agcy');
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