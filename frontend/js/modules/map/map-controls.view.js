define(['../dispatcher', './map.store'], function(dispatcher, store) {

	"use strict";

	var items = {}

	//!!!replace if setting data-attribute!
	var idName = 'new-id-';
	var idNum  = 1;

	var map = false;
	var controls;
	var geolocated = false;

	var _handleChange = function(e) {
		map = store.getData().map;

		e.stopPropagation();
		var el = e.currentTarget;

		var lat  = el.getAttribute('data-lat');
		var lng  = el.getAttribute('data-lng');
		var zoom = el.getAttribute('data-zoom');
		var latLng;

		zoom = parseInt(zoom);

		if (!lat || !lng) {
			console.warn('map-control coordinates are not specified');
			return;
		}

		if (!map) {
			console.log('map is not ready');
			return;
		}
		// var id = el.getAttribute("data-map");
		// if (id !== active) {
		// 	ctrl[id].classList.add("active");
		// 	ctrl[active].classList.remove("active");

		// 	active = id;
		// }

		latLng = new google.maps.LatLng(lat, lng);

		map.setCenter(latLng);

		if (zoom) {
			map.setZoom(zoom);
		}
		// map.panBy(-100, 140);
	}

	var _add = function(items, element) {
		var id = element.getAttribute('data-map');

		if (!id) {
			id = idName + idNum;
			idNum++;

			//setAttribute('data-id', id);
		}

		element.addEventListener('click', _handleChange);

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
		elements = document.getElementsByClassName('view-map-control');
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