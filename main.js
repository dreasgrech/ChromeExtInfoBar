(function ($) {
 var HEIGHT = 37,
 isChrome = function () {
	return navigator.userAgent.toLowerCase().indexOf('chrome') >= 0;
 }, isExtensionAlreadyInstalled = function () {
 	return chrome.app.isInstalled;
 }, getExtensionUrl = function (id) {
	 return "https://chrome.google.com/webstore/detail/" + id;
 }, buildInfoBar = function (height, iconUrl, text) {
	 var bar = $("<div/>").css({'background-image': 'url(img/gradient.png)', 'font-family': 'Tahoma, sans-serif', 'font-size': 14, color: '#333', 'border-bottom': '1px solid #CCC', height: height, position: 'absolute', left: 0, top: -height, width: '100%'}),
	     icon = $("<img/>").attr('src', iconUrl).css({padding: 6, float: 'left'}),
	     barText = $("<span/>").css({padding:10, float: 'left'}).html(text),
	     button = $("<button/>").css({float: 'right', margin: 6, padding: 3, 'padding-right': 8, 'padding-left': 8}).html('Install'),
	     close = $("<img/>").attr('src','img/close.png').css({float: 'right', 'padding-right': 10, 'padding-top': 15, 'margin-left' : 10});

	 bar.append(icon);
	 bar.append(barText);
	 bar.append(close);
	 bar.append(button);

	 close.click(function () {
		bar.animate({
			top: '-=' + height
		});
	 });

	 return bar;
 };

 $.fn.extensionNotifier = function (opts) {
	if (!isChrome()) {
		console.log('Not chrome');
		return;
	}

	opts = $.extend({}, $.fn.extensionNotifier.defaults, opts);
	if (!opts.id) {
		console.log('No extension id');
		return;
	}

	var infoBar = buildInfoBar(HEIGHT, opts.icon, opts.message);
	$("body").append(infoBar);
	infoBar.animate({
		top: '+=' + HEIGHT
	});
 };

 $.fn.extensionNotifier.defaults = {
	icon: 'img/defaulticon.png',
	message: 'This website has a Google Chrome extension.  Press Install to install it now',
	redirectIfInstallFails: true
 };
}(jQuery));
