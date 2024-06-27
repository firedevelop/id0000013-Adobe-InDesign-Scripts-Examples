"use strict";

function memoize(func) {
	var stringifyJson = JSON.stringify,
	    cache = {};
	function cachedfun() {
		var hash = stringifyJson(arguments);
		return hash in cache ? cache[hash] : cache[hash] = func.apply(this, arguments);
	}
	return cachedfun;
}

module.exports = memoize;