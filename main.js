(function ($) {
 var HEIGHT = 35,
 CLOSE = 'img/close.png',
 CLOSE_HOVER = 'img/close_hover.png',
 BUTTONBORDER = '1px solid #988f66',
 BUTTONBORDER_HOVER = '1px solid #4c4733',
 BUTTON = 'url(img/button_gradient.png)',
 BUTTON_CLICK = 'url(img/button_click.png)',
 errors = {
 	notVerified : "Installs can only be initiated by the Chrome Web Store item's verified site"
 },
 isChrome = function () {
	return navigator.userAgent.toLowerCase().indexOf('chrome') >= 0;
 }, isExtensionAlreadyInstalled = function () {
 	return chrome.app.isInstalled;
 }, getExtensionUrl = function (id) {
	 return "https://chrome.google.com/webstore/detail/" + id;
 }, addLink = function (id) {
 	$("head").append($("<link/>").attr({'rel' : 'chrome-webstore-item', 'href' : getExtensionUrl(id)}));
 }, animate = function (bar, height, open) {
	bar.animate({
		top: (open ? '+' : '-') + '=' + height
	});
 }, buildInfoBar = function (id, height, iconUrl, text, redirectIfInstallFails) {
	 var bar = $("<div/>").css({'background-image': 'url(img/gradient_bar.png)', 'font-family': 'Tahoma, sans-serif', 'font-size': 14, color: '#333', color: 'black', 'border-bottom': '1.5px solid #b6bac0', height: height, position: 'absolute', left: 0, top: -height, width: '100%'}),
	     icon = $("<img/>").attr('src', iconUrl).css({padding: 9, 'padding-left': 10, 'padding-top' : 8, float: 'left'}).attr({width: 20, height: 20}),
	     barText = $("<span/>").css({padding:10, 'padding-left': 4, 'padding-top': 9, float: 'left'}).html(text),
	     button = $("<button/>").css({'background-image': BUTTON, '-webkit-border-radius' : 4, border: BUTTONBORDER, float: 'right', margin: 6, padding: 3, 'padding-right': 8, 'padding-left': 9, width: 80}).html('Install'),
	     close = $("<img/>").attr('src', CLOSE).css({float: 'right', 'padding-right': 9, 'padding-top': 13, 'margin-left' : 10});

	 bar.append(icon);
	 bar.append(barText);
	 bar.append(close);
	 bar.append(button);

	 close.click(function () {
		 animate(bar, height);
	 });

	 close.hover(function () {
		 $(this).attr('src', CLOSE_HOVER);
	 },
	 function () {
		 $(this).attr('src', CLOSE);
	 });

	 button.click(function () {
		chrome.webstore.install(getExtensionUrl(id), function (m) {
			animate(bar, height);
		},
		function (m) {
			if (m === errors.notVerified && redirectIfInstallFails) {
				window.open(getExtensionUrl(id));
			}
		});
	 }).hover(function () {
		 $(this).css('border', BUTTONBORDER_HOVER);
	 },
	 function () {
		 $(this).css('border', BUTTONBORDER);
	 }).mousedown(function () {
		 $(this).css('background-image', BUTTON_CLICK);
	 }).mouseup(function () {
		 $(this).css('background-image', BUTTON);
	 }).mouseout(function () {
		 $(this).css('background-image', BUTTON);
	 });

	 return bar;
 };

 $.fn.extensionNotifier = function (opts) {
	if (!isChrome()) {
		return;
	}

	opts = $.extend({}, $.fn.extensionNotifier.defaults, opts);
	if (!opts.id) {
		console.log('No extension id');
		return;
	}

	$(function () {
		var infoBar = buildInfoBar(opts.id, HEIGHT, opts.icon, opts.message, opts.redirectIfInstallFails);

		addLink(opts.id);
		$("body").append(infoBar);
		animate(infoBar, HEIGHT, 1);
	});
 };

 $.fn.extensionNotifier.defaults = {
	icon: 'img/defaulticon.png',
	message: 'This website has a Google Chrome extension.  Press Install to install it now',
	redirectIfInstallFails: true
 };
}(jQuery));
