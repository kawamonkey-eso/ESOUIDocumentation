(function($) {
	"use strict"

	Toc.init({
		$nav: $('#toc')
	})
	$('body').scrollspy({
		target: '#toc',
	})
})
