define(['../dispatcher', './form.store', '../utils'], function(dispatcher, store, utils) {

	"use strict";

	var items = {};

	var idName = 'form-id-';
	var idNum  = 1;


	var _handleChange = function() {
		var storeData = store.getData();

		var checkItem = function(item) {
			var id = item.id;

			if (!storeData.items.hasOwnProperty(id)) return;
			if (storeData.items[id].status === items[id].status) return;

			items[id].status = storeData.items[id].status;
			item.element.classList.remove('waiting');
			item.element.classList.remove('sending');
			item.element.classList.remove('submitted');
			item.element.classList.add(items[id].status);
		};

		for (var id in items) {
			if (items.hasOwnProperty(id)) {
				checkItem(items[id]);
			}
		}
	};

	var _handle = function(item) {
		var form  = item.element;
		var inputs = form.getElementsByTagName('input');
		var textareas = form.getElementsByTagName('textarea');
		var selects = form.getElementsByTagName('select');
		var elements = form.elements;

		var validate = function(form) {
			var result = true;
			var bindedData = false;

			var checkField = function(field) {
				if (!field.getAttribute('data-required')) return;

				if (field.type === 'checkbox' && !field.checked) {
					field.parentNode.classList.add('error');

					// setTimeout(function() {
					// 	field.parentNode.classList.remove('error');
					// }, 500);
					result = false;
				} if (field.type !== 'checkbox' && !field.value || field.value === '') {
					field.parentNode.classList.add('error');

					// setTimeout(function() {
					// 	field.parentNode.classList.remove('error');
					// }, 500);
					result = false;
				}

				if (field.parentNode.classList.contains('error')) {
					field.addEventListener('change', function () {
						field.parentNode.classList.remove('error');
					});
				}
			};

			var checkSelect = function(select) {
				if (!select.getAttribute('data-required') || select.type !== 'select-one') return;

				if (select.selectedIndex === 0) {
					select.parentNode.classList.add('error');

					// setTimeout(function() {
					// 	select.parentNode.classList.remove('error');
					// }, 500);
					result = false;
				}

				if (select.parentNode.classList.contains('error')) {
					select.addEventListener('change', function () {
						select.parentNode.classList.remove('error');
					});
				}
			};

			var checkBinded = function(input) {
				if (!input.getAttribute('data-binded')) return;
				if (!input.value || input.value === '') return;
				if (!bindedData) {
					bindedData = input.value;
				} else {
					if (input.value !== bindedData) {
						input.parentNode.classList.add('error');
						result = false;
					}
				}
			};

			for (var i = 0; i < inputs.length; i++) {
				checkField(inputs[i]);
				checkBinded(inputs[i]);
			}
			for (var j = 0; j < textareas.length; j++) {
				checkField(textareas[j]);
				checkBinded(textareas[j]);
			}
			for (var l = 0; l < selects.length; l++) {
				checkSelect(selects[l]);
			}

			return result;
		};

		item.element.addEventListener('submit', function(e) {
			var action = form.action;
			var validated;
			var data = new FormData();
			var ajaxForm = this.getAttribute('data-ajax') || false;

			validated = validate(form);

			if (!validated || item.status !== 'waiting') {
				e.preventDefault();
				return;
			}

			if (!ajaxForm) return;

			e.preventDefault();
	
			for (var i = elements.length - 1; i >= 0; i--) {
				console.dir(elements[i]);
				var fe = elements[i];
				if (fe.name && fe.name !== "file") {
					data.append(fe.name, fe.value);
				} else if(fe.name && fe.name === "file") {
					data.append(fe.name, fe.files[0]);
				}
			}

			dispatcher.dispatch({
				type: 'ajax-form-send',
				id: item.id
			});

			// the actual code-----------------------------------------
			utils.ajax.post(action, data,function(response) {
				var json = JSON.parse(response);
				dispatcher.dispatch({
					type: 'ajax-form-submit',
					id: item.id,
					response: json
				});
				dispatcher.dispatch({
					type: 'ajax-server-response',
					response: json
				});
				if (!json.hasOwnProperty('status') || json.status === 'error' || json.status === 'success-reset') {
					setTimeout(function() {
						dispatcher.dispatch({
							type: 'ajax-form-reset',
							id: item.id
						});
					}, 3000);
				}
			}, true);
			//-----------------------------------------------------

			
			// a temporary plug for the client-----------------------
			// var testObj = {
			// 	status:   'success',
			// 	response: 'Your message has been successfully send. We will write you soon.'
			// };
			
			// var testJSON = JSON.stringify(testObj);
			
			// console.log(testJSON);
			
			// setTimeout(function() {
			// 	// item.status = 'submitted';
			
			// 	dispatcher.dispatch({
			// 		type: 'ajax-form-submit',
			// 		id: item.id,
			// 		response: testObj
			// 	});
			// 	dispatcher.dispatch({
			// 		type: 'ajax-server-response',
			// 		response: testObj
			// 	});
			
			// 	if (!testObj.hasOwnProperty('status') || testObj.status === 'error' || testObj.status === 'success-reset') {
			// 		setTimeout(function() {
			// 			dispatcher.dispatch({
			// 				type: 'ajax-form-reset',
			// 				id: item.id
			// 			});
			// 		}, 3000);
			// 	}
			// }, 2000);
			//----------------------------------------------------


		}, false);
	};

	var _add = function(items, element) {
		var id = element.getAttribute('data-id');

		if (!id) {
			id = idName + idNum;
			idNum++;
		}

		dispatcher.dispatch({
			type: 'ajax-form-add',
			id: id
		});

		items[id] = {
			id: id,
			element: element,
			status: false
		}

		_handle(items[id]);
	}

	var _remove = function(items, item) {
		delete items[item.id];

		dispatcher.dispatch({
			type: 'ajax-form-remove',
			id: item.id
		});
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


		elements = document.getElementsByClassName('view-form');
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
