define(['../dispatcher'], function(dispatcher) {

	"use strict";

	var items = {}
	var initialized = false;

	var _handleEvent = function(e) {
		if (e.type === 'infinite-load') {;

			if (e.hasOwnProperty('done') && e.done && items.hasOwnProperty(e.id)) {
				items[e.id].done = true;

				eventEmitter.dispatch({
					type: 'change'
				});
			} 
		}
	}

	var _add = function(element) {
		var id  = element.getAttribute('data-id');
		var isDoneAttribute = element.getAttribute('data-done');
		var isDone = false;

		if (isDoneAttribute && isDoneAttribute === 'true') {
			isDone = true;
		}

		if (!id) {
			console.warn('data-id attribute is missing');
			return;
		}

		items[id] = {
			id: id,
			done: isDone
		}
	}

	var _init = function() {
		var elements;

		if (initialized) return;
		initialized = true;

		elements = document.querySelectorAll('.infinite-load-container');
		for (var i = 0; i < elements.length; i++) {
			_add(elements[i]);
		}

		dispatcher.subscribe(_handleEvent);
	}

	var eventEmitter = function() {
		var _handlers = [];

		var dispatch = function(event) {
			for (var i = _handlers.length - 1; i >= 0; i--) {
				_handlers[i](event);
			}
		}
		var subscribe = function(handler) {
			_handlers.push(handler);
		}
		var unsubscribe = function(handler) {
			for (var i = 0; i <= _handlers.length - 1; i++) {
				if (_handlers[i] == handler) {
					_handlers.splice(i--, 1);
				}
			}
		}

		return {
			dispatch: dispatch,
			subscribe: subscribe,
			unsubscribe: unsubscribe
		}
	}();

	var getData = function() {
		return {
			items: items
		}
	}

	if (!initialized) {
		_init();
	}

	return {
		eventEmitter: eventEmitter,
		getData: getData
	}
});