"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var wrapper = require("../module-wrapper");

var Render = function () {
	function Render() {
		_classCallCheck(this, Render);

		this.name = "Render";
	}

	_createClass(Render, [{
		key: "set",
		value: function set(obj) {
			if (obj.compiled) {
				this.compiled = obj.compiled;
			}
			if (obj.data != null) {
				this.data = obj.data;
			}
		}
	}, {
		key: "getRenderedMap",
		value: function getRenderedMap(mapper) {
			var _this = this;

			return Object.keys(this.compiled).reduce(function (mapper, from) {
				mapper[from] = { from: from, data: _this.data };
				return mapper;
			}, mapper);
		}
	}]);

	return Render;
}();

module.exports = function () {
	return wrapper(new Render());
};