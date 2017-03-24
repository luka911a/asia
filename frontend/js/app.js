
// modules 
let domReady = require('./modules/domReady');
let header = require('./modules/decor/header.view');
let vhUnitsView = require('./modules/resize/vhUnits.view');
let file = require('./modules/form/file.view');
let formView = require('./modules/form/form.view');
let formFocusView = require('./modules/form/form-focus.view');
let formResponceView = require('./modules/form/form-responce.view');
let popupView = require('./modules/popup/popup.view');
let popupControlsView = require('./modules/popup/popup-controls.view');
let popupCloseView = require('./modules/popup/popup-close.view');
let widthLicenseView = require('./modules/decor/width-license.view');
let mapView = require('./modules/map/map.view');
let mapMarkersView = require('./modules/map/map-markers.view');
let mapControlsView = require('./modules/map/map-controls.view');
let mapChoiceView = require('./modules/map/map-choice.view');
let imagesView = require('./modules/images/images.view');
let linksView = require('./modules/router/links.view');
let historyView = require('./modules/router/history.view');
let fetchView = require('./modules/router/fetch.view');
let simpleTransitionView = require('./modules/page-transition/simple-transition.view');
let projectTransitionView = require('./modules/page-transition/project-transition.view');
let preloadView = require('./modules/preload/preload.view');
let projectHoverView = require('./modules/decor/project-hover.view');
let footerCtrlView = require('./modules/footer/footer-ctrl.view');
let footerView = require('./modules/footer/footer.view');
let syntheticScrollView = require('./modules/synthetic-scroll/synthetic-scroll.view');
let scrollElemView = require('./modules/synthetic-scroll/scroll-elem.view');
let infiniteLoadControlsView = require('./modules/infinite-load/infinite-load-controls.view');
let infiniteLoadView = require('./modules/infinite-load/infinite-load.view');
let imgCenterView = require('./modules/decor/img-center.view');
let sliderView = require('./modules/slider/slider.view');
let shareView = require('./modules/share/share.view');
let leftRightView = require('./modules/decor/left-right.view');
let countryView = require('./modules/decor/country.view');
let tabView = require('./modules/decor/tab.view');
let uncoverView = require('./modules/decor/uncover.view');
let addClassScrollView = require('./modules/decor/add-class-scroll.view');
let scrollShowView = require('./modules/decor/scroll-show.view');
let footerCloseView = require('./modules/footer/footer-close.view');
let autoRout = require('./modules/router/auto-rout.view');

domReady(function () {
	vhUnitsView.init();
	objectFitVideos();
	header.init();
	file.init();
	formView.init();
	formFocusView.init();
	formResponceView.init();
	popupView.init();
	popupControlsView.init();
	popupCloseView.init();
	widthLicenseView.init();
	mapView.init();
	mapMarkersView.init();
	mapControlsView.init();
	mapChoiceView.init();
	imagesView.init();
	linksView.init();
	historyView.init();
	fetchView.init();
	simpleTransitionView.init();
	projectTransitionView.init();
	preloadView.init();	
	projectHoverView.init();
	footerCtrlView.init();
	footerView.init();
	syntheticScrollView.init();
	scrollElemView.init();
	infiniteLoadControlsView.init();
	infiniteLoadView.init();
	imgCenterView.init();
	sliderView.init();
	shareView.init();
	leftRightView.init();
	countryView.init();
	tabView.init();
	uncoverView.init();
	addClassScrollView.init();
	scrollShowView.init();
	footerCloseView.init();
	autoRout.init();
	
});