define(['../dispatcher', './infinite-load.store', '../utils'], function(dispatcher, store, utils) {

	"use strict";

	var items = {}

	var _handleChange = function() {
		var storeData = store.getData();
	}

	var _insertData = function(item, data) {
		var div = document.createElement('div');

		var addElement = function(element) {
			element.classList.add('hidden');
			item.element.appendChild(element);

			setTimeout(function() {
				element.classList.remove('hidden');
			}, 100);
		}

		div.innerHTML = data;

		for (var i = 0; i < div.childNodes.length; i++) {
			addElement(div.childNodes[i]);
		}

		dispatcher.dispatch({
			type: 'content-mutate',
			me: 'infinite-load.view'
		});
	}

	var _add = function(element) {
		var id = element.getAttribute('data-id');

		if (!id) {
			console.warn('data-id attribute is missing');
			return;
		}

		items[id] = {
			id: id,
			element: element
		}
	}

	var init = function() {
		var elements = document.querySelectorAll('.infinite-load-container');

		for (var i = 0; i < elements.length; i++) {
			_add(elements[i]);
		}

		dispatcher.subscribe(function(e) {
			if (e.type === 'infinite-load') {
				if (!items.hasOwnProperty(e.id)) return;

				_insertData(items[e.id], e.response);

				if (e.hasOwnProperty('done') && e.done) {
					dispatcher.dispatch({
						type: 'infinite-load-done',
						id: e.id
					});
				}
			}
		});

		_handleChange();
		store.eventEmitter.subscribe(_handleChange);
	}

	return {
		init: init
	}
});