define(['../dispatcher', './infinite-load.store', '../utils'], function(dispatcher, store, utils) {

	"use strict";

	var items = {}

	var _handleChange = function() {
		var storeData = store.getData();

		var checkItem = function(item) {
			var id = item.id;
			if (!storeData.items.hasOwnProperty(id)) return;

			if (item.done === storeData.items[id].done) return;

			item.done = storeData.items[id].done;

			if (item.done) {
				item.element.classList.add('hidden');
			}
		}

		for (var id in items) {
			if (items.hasOwnProperty(id)) {
				checkItem(items[id]);
			}
		}
	}

	var _add = function(element) {
		var id = element.getAttribute('data-id');
		var action = element.getAttribute('data-action');

		if (!id) {
			console.warn('data-id attribute is missing');
			return;
		}
		if (!action) {
			console.warn('data-action attribute is missing');
			return;
		}

		element.addEventListener('click', function(e) {
			e.preventDefault();
			var data = {}
			var fd = new FormData();

			items[id].page++;

			data.page = items[id].page;
			data.id = id;

			dispatcher.dispatch({
				type: 'infinite-load-send'
			});

			for ( var key in data ) {
			   fd.append(key, data[key]);
			}

			utils.ajax.post(action, fd, function(e) {
				var response = JSON.parse(e);
				var done = (response.hasOwnProperty('done') && (response.done === 'true' || response.done === true));

				if (!response.hasOwnProperty('status') || response.status === 'error') {
					items[id].page--;
				} else if (response.status === 'success') {
					dispatcher.dispatch({
						type: 'infinite-load',
						id: id,
						response: response.response,
						done: done
					});
				}
			}, true);

			//временная заглушка для клиента-----------------------
			// var testObj = {
			// 	status: 'success',
			// 	response: '<div class="item view-popup-toggle" data-popup="feed-popup"><img src="tmp/checkin.jpg" alt=""></div> <div class="item view-popup-toggle" data-popup="feed-popup"><img src="tmp/checkin.jpg" alt=""></div> <div class="item view-popup-toggle" data-popup="feed-popup"><img src="tmp/checkin.jpg" alt=""></div> <div class="item view-popup-toggle" data-popup="feed-popup"><img src="tmp/checkin.jpg" alt=""></div>',
			// 	done: false
			// }

			// var testJSON = JSON.stringify(testObj);

			// setTimeout(function() {
			// 	if (testObj.status === 'success') {
			// 		dispatcher.dispatch({
			// 			type: 'infinite-load',
			// 			id: id,
			// 			response: testObj.response,
			// 			done: testObj.done
			// 		});
			// 	}

			// 	if (testObj.status === 'error') {
			// 		items[id].page--;
			// 	}
			// }, 2000);
			//----------------------------------------------------

		}, false);

		items[id] = {
			id: id,
			element: element,
			page: 0,
			done: false,
			action: action
		}
	}

	var init = function() {
		var elements = document.querySelectorAll('.infinite-load-control');

		for (var i = 0; i < elements.length; i++) {
			_add(elements[i]);
		}

		_handleChange();
		store.eventEmitter.subscribe(_handleChange);
	}

	return {
		init: init
	}
});