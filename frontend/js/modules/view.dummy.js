define(['dispatcher', 'store'], function(dispatcher, store) {

	"use strict";

	var _handleChange = function() {
		var storeData = store.getData();
	}

	var _handleMutate = function() {

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