define([
	'../dispatcher', 
	'./router.store', 
	'../page-transition/page-transition.store', 
	'../utils'
], function(
	dispatcher, 
	routerStore, 
	transitionsStore, 
	utils
) {
	"use strict";

	var idName = 'replaceable-id-';
	var idNum  = 1;

	var replaceable = {};
	var responce = false;
	var asia;
	var pw;
	var header;
	var footer;

	//step1
	var _handleRouteChange = function(storeData) {
		storeData = routerStore.getData();

		var data = new FormData();
		if (!storeData.href) return;

		utils.ajax.send(storeData.href, function(rs) {
			responce = rs;
			
			dispatcher.dispatch({
				type: 'transition-step-1'
			});
		}, 'GET', data, true);
	}

	//step2
	var _replace = function() {
		var div;
		var newContainers = [];
		var pageName;
		var shadow;
		var headerStyle;
		var footerStyle;
		var title, titleValue;
		var active;
		var menuDiv;
		var repls;
		var page;

		var _replaceContainer = function(newContainer) {
			window.scrollTo(0,0);
			var id = newContainer.getAttribute('data-id');
			if (!id) {
				console.warn('data-id attribute is missing');
				return;
			}

			if (!replaceable.hasOwnProperty(id)) {
				console.warn('container with id ' + id + ' is missing');
				return;
			}
			if (page) {
				replaceable[id].conatainer.setAttribute('data-page', page);
			} else {
				replaceable[id].conatainer.setAttribute('data-page', "");
			}
			
			replaceable[id].conatainer.innerHTML = newContainer.innerHTML;
		}

		if (!responce) return;;

		div = document.createElement('div');

		div.innerHTML = responce;
		newContainers = div.getElementsByClassName('replaceable');
		pageName  = div.getElementsByClassName('asia')[0];
		title      = div.getElementsByTagName('title')[0];
		titleValue = title.innerHTML;
		shadow = div.querySelector('page-wrapper shadow');
		headerStyle = div.getElementsByClassName('wh')[0];
		footerStyle = div.getElementsByTagName('footer')[0];
		repls = div.getElementsByClassName('replaceable')[0];
		page = repls.getAttribute('data-page');

		document.title = titleValue;

		if (!pageName) {
			console.warn('page-names elements are missing');
		}
		if (!title) {
			console.warn('title element is missing');
		}

		asia.innerHTML = pageName.innerHTML;
		if (shadow) {
			pw.classList.add('shadow');
		} else {
			pw.classList.remove('shadow');
		}
		if (headerStyle) {
			header.classList.add('wh');
		} else {
			header.classList.remove('wh');
		}
		if (!footerStyle.getAttribute("data-active")) {
			footer.style.display = "block";
		} else {
			footer.style.display = "none";
		}
		
		for (var i = 0; i < newContainers.length; i++) {
			_replaceContainer(newContainers[i]);
		}


		setTimeout(function() {
			dispatcher.dispatch({
				type: 'transition-step-2'
			});
			dispatcher.dispatch({
				type: 'mutate'
			})
		}, 20);
	}

	//step3
	var _reset = function() {
		responce = false;
	}

	var _add = function(conatainer) {
		var id = conatainer.getAttribute('data-id');

		if (!id) {
			id = idName + idNum;
			idNum++;
			conatainer.setAttribute('data-id', id);
		}

		replaceable[id] = {
			id: id,
			conatainer: conatainer
		}
	}

	var _handleSteps = function() {
		var storeData = transitionsStore.getData();
		if (storeData.step1ready === true && storeData.step2ready === false) {
			_replace();
		}
		if (storeData.step1ready === true && storeData.step2ready === true) {
			_reset();
		}
	}

	var _handleMutate = function() {
		var containers = document.getElementsByClassName('replaceable');
		for (var i = 0; i < containers.length; i++) {
			_add(containers[i]);
		}
	}

	var init = function() {
		asia = document.getElementsByClassName('asia')[0];
		pw = document.getElementsByClassName('page-wrapper')[0];
		header = document.getElementsByTagName('header')[0];
		footer = document.getElementsByTagName('footer')[0];

		_handleMutate();
		transitionsStore.eventEmitter.subscribe(_handleSteps);
		routerStore.eventEmitter.subscribe(_handleRouteChange);
	}

	return {
		init: init
	}
});