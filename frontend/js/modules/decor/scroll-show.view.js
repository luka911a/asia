define(['../dispatcher', '../resize/resize.store', '../scroll/scroll.store', '../utils'], function(dispatcher, resizeStore, scrollStore, utils) {

	"use strict";

	var items = {}

	//!!!replace if setting data-attribute!
	var idName = 'new-id-';
	var idNum  = 1;
	var block,
		height,
		width,
		scrollTop;


	var _handleChange = function() {
			var show = function (el) {
				if (scrollTop >= utils.offset(el.element).top - height/1.2) {
					el.element.classList.add('show');
				}
				if (utils.offset(el.element).top <= height) {
					el.element.classList.add('show');
				}
				if (el.element.classList.contains('next-service') ||
					el.element.classList.contains('next-blog') ||
					el.element.classList.contains('next-case')) {
						if (scrollTop >= utils.offset(el.element).top - height/1.2) {
							el.element.classList.add('show');
						}
				}
			}
			for (var id in items) {
				show(items[id]);
			}
	}

	var _scroll = function () {
		var storeData = scrollStore.getData();
		scrollTop = storeData.top;
	}

	var _resize = function () {
		var storeData = resizeStore.getData();
		height = storeData.height;
		width = storeData.width;
	}

	var _add = function(items, element) {
		var id = element.getAttribute('data-ide');

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
		elements = document.getElementsByClassName('scroll-block');
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
		_resize();
		_scroll();
		_handleChange();

		resizeStore.eventEmitter.subscribe(_resize);
		scrollStore.eventEmitter.subscribe(_scroll);
		resizeStore.eventEmitter.subscribe(_handleChange);
		scrollStore.eventEmitter.subscribe(_handleChange);

		dispatcher.subscribe(function(e) {
			if (e.type === 'mutate') {
				_handleMutate();
				_resize();
				_scroll();
				_handleChange();
			}
		});
	}

	return {
		init: init
	}
});