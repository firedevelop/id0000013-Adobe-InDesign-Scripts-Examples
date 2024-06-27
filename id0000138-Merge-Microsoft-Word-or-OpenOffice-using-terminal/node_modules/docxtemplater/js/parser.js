"use strict";

var DocUtils = require("./doc-utils");

var parser = {
	postparse: function postparse(parsed, modules) {
		function getTraits(traitName, parsed) {
			return modules.map(function (module) {
				return module.getTraits(traitName, parsed);
			});
		}
		function postparse(parsed) {
			return modules.reduce(function (parsed, module) {
				return module.postparse(parsed, { postparse: postparse, getTraits: getTraits });
			}, parsed);
		}
		return postparse(parsed);
	},
	parse: function parse(lexed, modules) {
		function moduleParse(placeHolderContent, parsed) {
			var moduleParsed = void 0;
			for (var i = 0, l = modules.length; i < l; i++) {
				var _module = modules[i];
				moduleParsed = _module.parse(placeHolderContent);
				if (moduleParsed) {
					parsed.push(moduleParsed);
					return moduleParsed;
				}
			}
			return null;
		}

		var inPlaceHolder = false;
		var placeHolderContent = void 0;
		var tailParts = [];
		return lexed.reduce(function (parsed, token) {
			if (token.type === "delimiter") {
				inPlaceHolder = token.position === "start";
				if (token.position === "end") {
					placeHolderContent = DocUtils.wordToUtf8(placeHolderContent);
					if (!moduleParse(placeHolderContent, parsed)) {
						parsed.push({ type: "placeholder", value: placeHolderContent });
					}
					Array.prototype.push.apply(parsed, tailParts);
					tailParts = [];
					return parsed;
				}
				placeHolderContent = "";
				return parsed;
			}
			if (inPlaceHolder) {
				if (token.type === "content" && token.position === "insidetag") {
					placeHolderContent += token.value;
				} else {
					tailParts.push(token);
				}
				return parsed;
			}
			parsed.push(token);
			return parsed;
		}, []);
	}
};

module.exports = parser;