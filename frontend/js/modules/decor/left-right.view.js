define(['../dispatcher', '../resize/resize.store', '../resize/breakpoint.store'], function(dispatcher, store, breakpoint) {

	"use strict";

	var items = {}

	//!!!replace if setting data-attribute!
	var idName = 'new-id-';
	var idNum  = 1;
	var point = "";


	var _handlePoint = function() {
		point = breakpoint.getData().breakpoint.name;
	}
	var _handleChange = function() {
		var storeData = store.getData();
		var wrapper = document.getElementsByClassName('wrapper')[0];
		var userText = document.getElementsByClassName('user-text')[0];
		if (wrapper && userText) {
			var wrapperW = wrapper.offsetWidth;
			var userTextW = userText.offsetWidth;
			var delta = (wrapperW - userTextW)/2;
		}
		
		for (var key in items) {
			if (items[key].element.parentNode.classList.contains('none-standart')) {
				continue;
			}
			if (point === "desktop") {
				items[key].element.style.width = wrapperW + "px";
				items[key].element.style.marginLeft = "-" + delta + "px";
			} else if (point === "tablet" || point === 'mobile') {
				items[key].element.style.width = "";
				items[key].element.style.marginLeft = "";
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
		var userText = document.getElementsByClassName('user-text')[0];
		if (!userText) {
			return
		}
		var left = userText.getElementsByClassName('block-left');
		var right = userText.getElementsByClassName('block-right');
		for (var m = 0; m < left.length; m++) {
			elements.push(left[m]);
		}
		for (var j = 0; j < right.length; j++) {
			elements.push(right[j]);
		}
		for (var u = 0; u < elements.length; u++) {
			check(items, elements[u]);
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
		_handlePoint();
		_handleChange();

		breakpoint.eventEmitter.subscribe(_handlePoint);
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