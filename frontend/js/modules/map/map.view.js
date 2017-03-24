define(['../dispatcher'], function(dispatcher) {

	"use strict";

	var container;
	var apiLoaded = false;
	var lang;

	var _build = function(container) {
		var lat, lng, zoom;
		var id;
		var config, styles;
		var map;

		id   = container.id;
		lat  = container.getAttribute('data-lat')  || 0;
		lng  = container.getAttribute('data-lng')  || 0;
		zoom = parseInt(container.getAttribute('data-zoom')) || 2;

		styles = [{"featureType":"landscape","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"stylers":[{"hue":"#00aaff"},{"saturation":-100},{"gamma":2.15},{"lightness":12}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"visibility":"on"},{"lightness":24}]},{"featureType":"road","elementType":"geometry","stylers":[{"lightness":57}]}];
		
		config = {
			zoom: zoom,
			scrollwheel: false,
			disableDefaultUI: true,
			center: new google.maps.LatLng(lat, lng)
		}

		map = new google.maps.Map(container, config);

		map.setOptions({styles: styles});

		container.style.background = 'rgba(1, 3, 6, 1)';

		dispatcher.dispatch({
			type: 'map-initialized',
			map: map
		});
	}

	var _add = function(element) {
		var id = element.getAttribute('data-id');

		if (!id) {
			id = idName + idNum;
			idNum++;
			// element.setAttribute('data-id', id);
		}
	}

	var _handleMutate = function() {
		var html = document.getElementsByTagName('html')[0];
		var loadMaps = function() {
			var script;

			if (apiLoaded) {
				_build(container);
				return;
			}

			apiLoaded = true;

			script = document.createElement('script');
			script.type = 'text/javascript';
			script.src = 'https://www.google.com/jsapi?key=AIzaSyCIuYnYUScrpSJwCMtCUKM-9yVn8wT_QoM&callback=initLoader';
			script.setAttribute('async', '');
			document.body.appendChild(script);
		}

		lang = html.getAttribute('lang');

		if (!lang) lang = 'ru';

		container = document.getElementsByClassName('map-view')[0];
		if (!container) return;

		loadMaps();
	}

	var _initMaps = function() {
		_build(container);
	}

	var init = function() {
		_handleMutate();

		dispatcher.subscribe(function(e) {
			if (e.type === 'mutate') {
				_handleMutate();
			}
		});
	}

	window.initLoader = function() {
		google.load("maps", "3.x", {"callback" : _initMaps, "other_params": "sensor=false&language=" + lang});
	}

	return {
		init: init
	}
});