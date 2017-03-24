define(['../dispatcher'], function(dispatcher) {

	"use strict";

	var items = {}

	//!!!replace if setting data-attribute!
	var idName = 'new-id-';
	var idNum  = 1;


	var _handleChange = function() {
		var container = document.getElementsByClassName('upload-done')[0];
		var name = document.getElementsByClassName('upload-done')[0].getElementsByTagName('span')[0];

		if (items["file-add"].element.files.length !== 0) {
			name.innerHTML = items["file-add"].element.files[0].name;
			container.classList.add('added');
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

		element.addEventListener("change", _handleChange);
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
		elements = document.getElementsByClassName('file-add');
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