define(['../dispatcher', '../resize/resize.store', '../scroll/scroll.store', '../utils'], function(dispatcher, resizeStore, scrollStore, utils) {

	"use strict";

	var items = {}

	var idName = 'project-hover-';
	var idNum  = 1;
	var number = 5;
	var transform;
	var transform;
	var shown = false;
	var x = 0;
	var y = 0;
	var x1 = 0;
	var y1 = 0;
	var sc = 0;
	var butHid = {};

	var _hadleScroll = function() {
		sc = scrollStore.getData().top;
		for (var key in items) {
			if (items[key].active === true) {
				_scroll(items[key]);
			}
		}
	}
	
	var _draw = function(item) {
		function _animate() {
			if (Math.abs(x - x1) < 0.1) {
				x1 = x;
				return
			} else {
				x1 = x1 + (x - x1)/200;
			}

			if (Math.abs(y - y1) < 0.1) {
				y1 = y;
				return
			} else {
				y1 = y1 + (y - y1)/200;
			}
			if (item.cursor.tagName === "circle") {
				item.cursor.setAttribute("cx", x1);
				item.cursor.setAttribute("cy", (y1));
			} else {
				item.cursor.style[transform] = 'translateX(' + x1 + 'px) translateY(' + (y1) + 'px) translateZ(0px)';	
			}
			requestAnimationFrame(_animate);
		}
		_animate();
	}
	
	var _show = function(item, e, el) {
		var wh = resizeStore.getData().height;

		shown = true;
		item.cursor.classList.add('show');
		item.cursor.classList.remove('hidden');
		var height = item.element.offsetHeight;
		var top = utils.offset(el).top;

		x = e.clientX - utils.offset(el).left;
		x1 = e.clientX - utils.offset(el).left;
		y = e.pageY - top;
		y1 = e.pageY - top;

		_draw(item);
	}
	var _move = function(item, e, el) {
		var wh = resizeStore.getData().height;

		if (!shown) return;

		item.cursor.classList.add('show');
		item.cursor.classList.remove('hidden');
		var height = item.element.offsetHeight;
		var top = utils.offset(el).top;

		x = e.clientX - utils.offset(el).left;
		y = e.pageY - top;

		_draw(item);
	}
	var _scroll = function(item) {
		item.cursor.classList.remove('show');
		item.cursor.classList.add('hidden');
	}
	var _hide = function(item, e, el) {
		var wh = resizeStore.getData().height;

		shown = false;

		item.cursor.classList.remove('show');
		item.cursor.classList.add('hidden');

		if (!e) return;

		var height = item.element.offsetHeight;
		var top = utils.offset(el).top;

		x = e.clientX - utils.offset(el).left;
		x1 = e.clientX - utils.offset(el).left;
		y = e.pageY - top;
		y1 = e.pageY - top;

		_draw(item);
	}

	function _handleChange() {
		
	}

	var _add = function(items, element) {
		var linkEditor = element.getElementsByClassName('link-editor');
		var id = element.getAttribute('data-id');
		var cursor = element.getElementsByClassName('cursor')[0];
		if (!cursor) {
			cursor = element.getElementsByTagName('circle')[0];
		}
		cursor.classList.add("hidden");
		var active = false;

		var _linkEditorList = function(el) {
			el.addEventListener('mouseenter', function(e) {
				items[id].active = true;
				_show(items[id], e, el);
			});
			el.addEventListener('mousemove', function(e) {
				items[id].active = true;
				_move(items[id], e, el);
			});
			el.addEventListener('mouseleave', function(e) {
				items[id].active = false;
				_hide(items[id], e, el);
			});
		}

		if (linkEditor) {
			for (var i = 0; i < linkEditor.length; i++) {
				_linkEditorList(linkEditor[i]);
			}
		}
		

		if (!id) {
			id = idName + idNum;
			idNum++;
		}

		items[id] = {
			id: id,
			cursor: cursor,
			element: element,
			active: active
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


		elements = document.getElementsByClassName('project-preview');
		for (var i = 0; i < elements.length; i++) {
			check(items, elements[i]);
		}
		for (var id in items) {
			if (items.hasOwnProperty(id)) {
				backCheck(items, elements, items[id]);
			}
		}
	}

	var init = function() {
		transform = Modernizr.prefixed('transform');

		_handleMutate();
		_hadleScroll();

		scrollStore.eventEmitter.subscribe(_hadleScroll);

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