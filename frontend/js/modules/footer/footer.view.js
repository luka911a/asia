define(['../dispatcher', './footer.store'], function(dispatcher, store) {

	"use strict";

	var itemsYes = {};
	var itemsNo = {};

	//!!!replace if setting data-attribute!
	var idName = 'new-id-';
	var idNum  = 1;
	var top, bottom;
	var active = false;

	var _handleChange = function() {
		var storeData = store.getData();

		active = storeData.active;

		if (storeData.close === true) {
			itemsYes = {};
			itemsNo = {};
			_handleMutate();
			for (var key in itemsYes) {
				itemsYes[key].element.classList.remove('active');
				itemsYes[key].element.style.display = "none";
				itemsYes[key].element.style.opacity = '1';
			}
			itemsYes[active].element.classList.remove('active');
			itemsYes[active].element.style.display = "block";
			top.style.display = "block";
			bottom.style.display = "none";
			itemsNo.block.element.style.opacity = '1';
			setTimeout(function() {
				itemsNo.block.element.classList.remove('active');
			}, 1000/60);
			document.getElementsByClassName('thanks')[0].style.opacity = '0';
		}
		if (storeData.activeNo === true) {

			itemsYes[active].element.classList.add('active');
			top.style.display = "none";
			bottom.style.display = "block";
			setTimeout(function() {
				itemsNo.block.element.classList.add('active');
			}, 1000/60);
			
		}
		if (storeData.activeYes === true) {
			if (storeData.noneElem && storeData.last === false) {
				var id = storeData.noneElem;
				itemsYes[id].element.style.display = 'none';
				delete itemsYes[id];
				itemsYes[active].element.style.display = 'block';
			} else if (storeData.noneElem && storeData.last === true) {
				itemsYes[active].element.style.opacity = '0';
				itemsNo.block.element.style.opacity = '0';
				document.getElementsByClassName('thanks')[0].style.opacity = '1';
			}
		}
	}

	var _add = function(itemsYes, itemsNo, element) {
		var id = element.getAttribute('data-id');

		if (!id) {
			id = idName + idNum;
			idNum++;

			//setAttribute('data-id', id);
		}
		if (id.indexOf('circle') !== -1) {
			itemsYes[id] = {
				id: id,
				element: element
			}
			dispatcher.dispatch({
				type: 'items-add',
				items: itemsYes
			});
		} else {
			itemsNo[id] = {
				id: id,
				element: element
			}
		}
		
	}

	var _remove = function(itemsYes, itemsNo, item) {
		delete items[item.id];
	}

	var _handleMutate = function() {
		var elements;

		var check = function(itemsYes, itemsNo, element) {
			var found = false;
			for (var id in itemsYes) {
				if (itemsYes.hasOwnProperty(id)) {
					if (itemsYes[id].element === element) {
						found = true;
						break;
					}
				}
			}
			for (var id in itemsNo) {
				if (itemsNo.hasOwnProperty(id)) {
					if (itemsNo[id].element === element) {
						found = true;
						break;
					}
				}
			}
			if (!found) {
				_add(itemsYes, itemsNo, element);
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
		elements = document.getElementsByClassName('amend');
		for (var i = 0; i < elements.length; i++) {
			check(itemsYes, itemsNo, elements[i]);
		}
		for (var id in itemsYes) {
			if (itemsYes.hasOwnProperty(id)) {
				backCheck(itemsYes, elements, itemsYes[id]);
			}
		}
		for (var id in itemsNo) {
			if (itemsNo.hasOwnProperty(id)) {
				backCheck(itemsNo, elements, itemsNo[id]);
			}
		}
		//-------
	}
	function isEmptyObject(obj) {
	    for (var i in obj) {
	        if (obj.hasOwnProperty(i)) {
	            return false;
	        }
	    }
	    return true;
	}

	var init = function() {
		_handleMutate();

		if (!isEmptyObject(itemsNo)) {
			top = itemsNo.block.element.getElementsByClassName('top')[0];
			bottom = itemsNo.block.element.getElementsByClassName('bottom')[0];
		}

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