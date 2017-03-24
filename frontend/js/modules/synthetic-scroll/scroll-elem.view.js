define(['../dispatcher'], function(dispatcher) {

	"use strict";

	var items = {}

	//!!!replace if setting data-attribute!
	var idName = 'new-id-';
	var idNum  = 1;


	var _handleChange = function(e) {
		var el = e.currentTarget;
		var id = el.getAttribute("data-id");
			dispatcher.dispatch({
				element: items[id].element,
				type: 'scroll-to'
			});
	}

	var _add = function(items, element) {
		var id = element.getAttribute('data-id');

		if (!id) {
			id = idName + idNum;
			idNum++;

			//setAttribute('data-id', id);
		}
		if (element.classList.contains("anchor-but")) {
			element.addEventListener("click", _handleChange);
		} else {
			items[id] = {
				id: id,
				element: element
			}
		}
	}

	var _remove = function(items, item) {
		delete items[item.id];
	}

	var _handleMutate = function() {
		var elements = [];

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
		var anchors = document.getElementsByClassName('anchor');
		var buttons = document.getElementsByClassName('anchor-but');
		for (var j = 0; j < anchors.length; j++) {
			elements.push(anchors[j]);
		}
		for (var s = 0; s < buttons.length; s++) {
			elements.push(buttons[s]);
		}
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

		dispatcher.subscribe(function(e) {
			if (e.type === 'mutate') {
				_handleMutate();
			}
		});
	}

	return {
		init: init
	}
});