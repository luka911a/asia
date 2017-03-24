define(['../dispatcher', '../scroll/scroll.store', '../resize/resize.store'], function(dispatcher, scrollStore, resizeStore) {

	"use strict";

	var items = {}

	//!!!replace if setting data-attribute!
	var idName = 'new-id-';
	var idNum  = 1;
	var scrollHeight;
	var active = false;
	var timer;

	var _handleChange = function() {
		if (Object.keys(items).length == 0) {
			return
		}
		var storeData = scrollStore.getData().top;
		
		for (var key in items) {
           var el = items[key].element;
        }

		if (storeData === scrollHeight - window.innerHeight && active === false) {
			TweenMax.to(el, 5, {
				strokeDashoffset: 0,
				ease:Linear.easeNone
			});
			active = true;
			timer = setTimeout(function() {
				document.getElementsByClassName('project-preview')[0].click();
			}, 4500);
		} else if (storeData !== scrollHeight - window.innerHeight && active === true) {
			clearTimeout(timer);
			TweenMax.to(el, 0.3, {
				strokeDashoffset: '360%',
				ease:Linear.easeNone
			});
			active = false;
		}
	}
	var _handleResize = function() {
		scrollHeight = Math.max(
			document.body.scrollHeight, document.documentElement.scrollHeight,
			document.body.offsetHeight, document.documentElement.offsetHeight,
			document.body.clientHeight, document.documentElement.clientHeight
		);
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
		elements = document.getElementsByClassName('progress');
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
		_handleResize();
		_handleChange();

		resizeStore.eventEmitter.subscribe(_handleResize);
		scrollStore.eventEmitter.subscribe(_handleChange);

		dispatcher.subscribe(function(e) {
			if (e.type === 'mutate') {
				_handleMutate();
				_handleResize();
				_handleChange();
			}
		});
	}

	return {
		init: init
	}
});