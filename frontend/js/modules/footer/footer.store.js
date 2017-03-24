define(['../dispatcher'], function(dispatcher) {

	"use strict";

	var initialized = false;
	var activeYes = false;
	var active = 'circle-1';
	var activeNo = false;
	var itemsYes = {};
	var counter = 0;
	var count = 0;
	var noneElem = false;
	var last = false;
	var close = false;

	var _handleEvent = function(e) {

		if (e.type === 'btn-control') {
			close = false;
			
			if (e.id === "yes") {
				activeYes = true;
				
				for (var id in itemsYes) {
					if (count < (counter-1) && id !== active) {
						active = id;
						count++
						break;
					} else if (count < (counter-1) && id === active) {
						noneElem = id;
					} else if (count === (counter-1) && id === active) {
						last = true;
					}
				}
				
			} else if (e.id === "no") {
				activeYes = false;
				activeNo = true;
			}

			eventEmitter.dispatch({
				type: 'change'
			});
		}
		if (e.type === 'footer-close') {
			close = true;
			activeYes = false;
			active = 'circle-1';
			activeNo = false;
			counter = 0;
			count = 0;
			noneElem = false;
			last = false;

			eventEmitter.dispatch({
				type: 'change'
			});
		}
		if (e.type === 'items-add') {

			itemsYes = e.items;

			counter++
		}
	}

	var _init = function() {
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
			activeYes: activeYes,
			active: active,
			activeNo: activeNo,
			noneElem: noneElem,
			last: last,
			close: close
		}
	}

	if (!initialized) {
		initialized = true;
		_init();
	}

	return {
		eventEmitter: eventEmitter,
		getData: getData
	}
});