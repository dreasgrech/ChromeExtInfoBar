/*
 * ExtInfoBar v1.1 - A jQuery plugin
 * 
 *  Copyright (c) 2012 Andreas Grech
 *
 *  Dual licensed under the MIT and GPL licenses:
 *    http://www.opensource.org/licenses/mit-license.php
 *    http://www.gnu.org/licenses/gpl.html
 *
 * http://dreasgrech.com
 */

(function ($) {
 var HEIGHT = 35,
 IMAGES_FOLDER = 'img/',
 CLOSE = IMAGES_FOLDER + 'close.png',
 CLOSE_HOVER = IMAGES_FOLDER + 'close_hover.png',
 BUTTONBORDER = '1px solid #988f66',
 BUTTONBORDER_HOVER = '1px solid #4c4733',
 BUTTON = 'url(' + IMAGES_FOLDER + 'button_gradient.png)',
 BUTTON_CLICK = 'url(' + IMAGES_FOLDER + 'button_click.png)',
 errors = {
 	notVerified : "Installs can only be initiated by the Chrome Web Store item's verified site"
 },
 isChrome = function () {
	return navigator.userAgent.toLowerCase().indexOf('chrome') >= 0;
 }, getExtensionUrl = function (id) {
	 return "https://chrome.google.com/webstore/detail/" + id;
 }, addLink = function (id) {
 	$("head").append($("<link/>").attr({'rel' : 'chrome-webstore-item', 'href' : getExtensionUrl(id)}));
 }, saveAction = function (action) {
 	localStorage['action'] = action;
 }, getAction = function () {
 	return localStorage['action'];
 }, animate = function (bar, height, open) {
 	if (open)
		bar.slideDown('fast');
	else
		bar.slideUp('fast');
 }, buildInfoBar = function (opts, height) {
	 var bar = $("<div/>").css({'background-image': 'url(' + IMAGES_FOLDER + 'gradient_bar.png)', 'font-family': 'Tahoma, sans-serif', 'display': 'none', 'overflow': 'hidden', 'font-size': 14, color: '#333', color: 'black', 'border-bottom': '1.5px solid #b6bac0', height: height, left: 0, top: -height, width: '100%', 'z-index': '200000000'}),
	     icon = $("<img/>").attr('src', opts.icon).css({padding: 9, 'padding-left': 10, 'padding-top' : 8, float: 'left'}).attr({width: 20, height: 20}),
	     barText = $("<span/>").css({padding:10, 'padding-left': 4, 'padding-top': 9, float: 'left'}).html(opts.message),
	     button = $("<button/>").css({'background-image': BUTTON, '-webkit-border-radius' : 4, border: BUTTONBORDER, float: 'right', margin: 6, padding: 3, 'padding-right': 8, 'padding-left': 9, width: 80}).html('Install'),
	     close = $("<img/>").attr('src', CLOSE).css({float: 'right', 'padding-right': 9, 'padding-top': 13, 'margin-left' : 10});

	 bar.append(icon);
	 bar.append(barText);
	 bar.append(close);
	 bar.append(button);

	 close.click(function () {
		animate(bar, height);
		opts.rememberClose && saveAction(1);
	 }).hover(function () {
		 $(this).attr('src', CLOSE_HOVER);
	 },
	 function () {
		 $(this).attr('src', CLOSE);
	 });

	 button.click(function () {
		chrome.webstore.install(getExtensionUrl(opts.id), function () {
			animate(bar, height);
			saveAction(1);
		},
		function (error) {
			if (error === errors.notVerified && opts.redirectIfInstallFails) {
				window.open(getExtensionUrl(opts.id));
				opts.rememberRedirect && saveAction(1);
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

 $.fn.extInfobar = function (opts) {
	if (!isChrome() || getAction()) {
		return;
	}

	opts = $.extend({}, $.fn.extInfobar.defaults, opts);
	if (!opts.id) {
		console.log('This plugin will do nothing unless you provide the ID for your extension.');
		return;
	}

	$(function () {
		var infoBar = buildInfoBar(opts, HEIGHT);

		addLink(opts.id);
		$("body").prepend(infoBar);
		animate(infoBar, HEIGHT, 1);
	});
 };

 $.fn.extInfobar.defaults = {
	icon: IMAGES_FOLDER + 'defaulticon.png',
	message: 'This website has a Google Chrome extension.  Press Install to get it now.',
	redirectIfInstallFails: true,
	rememberClose: true,
	rememberRedirect: true
 };
}(jQuery));

