"use strict";

var ScopeManager = require("./scope-manager");
var DocUtils = require("./doc-utils");

function moduleRender(part, options) {
	var moduleRendered = void 0;
	for (var i = 0, l = options.modules.length; i < l; i++) {
		var _module = options.modules[i];
		moduleRendered = _module.render(part, options);
		if (moduleRendered) {
			return moduleRendered;
		}
	}
	return false;
}

function render(options) {
	options.render = render;
	options.modules = options.modules;
	if (!options.scopeManager) {
		options.scopeManager = ScopeManager.createBaseScopeManager(options);
	}
	return options.compiled.map(function (part) {
		var moduleRendered = moduleRender(part, options);
		if (moduleRendered) {
			return moduleRendered.value;
		}
		if (part.type === "placeholder") {
			var value = options.scopeManager.getValue(part.value);
			if (value == null) {
				value = options.nullGetter(part);
			}
			return DocUtils.utf8ToWord(value);
		}
		if (part.type === "content" || part.type === "tag") {
			return part.value;
		}
		throw new Error("Unimplemented tag type \"" + part.type + "\"");
	}).join("");
}

module.exports = render;