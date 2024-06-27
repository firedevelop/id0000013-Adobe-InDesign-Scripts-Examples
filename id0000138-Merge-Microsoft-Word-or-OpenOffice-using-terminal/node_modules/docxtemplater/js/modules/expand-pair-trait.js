"use strict";

var traitName = "expandPair";
var mergeSort = require("../mergesort");
var DocUtils = require("../doc-utils");
var wrapper = require("../module-wrapper");

var _require = require("../traits"),
    getExpandToDefault = _require.getExpandToDefault;

var Errors = require("../errors");

function throwUnmatchedLoopException(options) {
	var location = options.location;
	var t = location === "start" ? "unclosed" : "unopened";
	var T = location === "start" ? "Unclosed" : "Unopened";

	var err = new Errors.XTTemplateError(T + " loop");
	var tag = options.part.value;
	err.properties = {
		id: t + "_loop",
		explanation: "The loop with tag " + tag + " is " + t,
		xtag: tag
	};
	throw err;
}

function throwClosingTagNotMatchOpeningTag(options) {
	var tags = options.tags;

	var err = new Errors.XTTemplateError("Closing tag does not match opening tag");
	err.properties = {
		id: "closing_tag_does_not_match_opening_tag",
		explanation: "The tag \"" + tags[0].value + "\" is closed by the tag \"" + tags[1].value + "\"",
		openingtag: tags[0].value,
		closingtag: tags[1].value
	};
	throw err;
}

function getOpenCountChange(part) {
	switch (part.location) {
		case "start":
			return 1;
		case "end":
			return -1;
		default:
			throw new Error("Location should be one of 'start' or 'end' (given : " + part.location + ")");
	}
}

function getPairs(traits) {
	if (traits.length === 0) {
		return [];
	}
	var countOpen = 1;
	var firstTrait = traits[0];
	for (var i = 1; i < traits.length; i++) {
		var currentTrait = traits[i];
		countOpen += getOpenCountChange(currentTrait.part);
		if (countOpen === 0) {
			if (currentTrait.part.value !== firstTrait.part.value && currentTrait.part.value !== "") {
				throwClosingTagNotMatchOpeningTag({ tags: [firstTrait.part, currentTrait.part] });
			}
			var outer = getPairs(traits.slice(i + 1));
			return [[firstTrait, currentTrait]].concat(outer);
		}
	}
	var part = firstTrait.part;
	throwUnmatchedLoopException({ part: part, location: part.location });
}

var expandPairTrait = {
	name: "ExpandPairTrait",
	postparse: function postparse(parsed, _ref) {
		var getTraits = _ref.getTraits,
		    _postparse = _ref.postparse;

		var traits = getTraits(traitName, parsed);
		traits = traits.map(function (trait) {
			return trait || [];
		});
		traits = mergeSort(traits);
		var pairs = getPairs(traits);
		var expandedPairs = pairs.map(function (pair) {
			var expandTo = pair[0].part.expandTo;
			if (expandTo === "auto") {
				expandTo = getExpandToDefault(parsed.slice(pair[0].offset, pair[1].offset));
			}
			if (!expandTo) {
				return [pair[0].offset, pair[1].offset];
			}
			var left = DocUtils.getLeft(parsed, expandTo, pair[0].offset);
			var right = DocUtils.getRight(parsed, expandTo, pair[1].offset);
			return [left, right];
		});

		var currentPairIndex = 0;
		var innerParts = void 0;
		return parsed.reduce(function (newParsed, part, i) {
			var inPair = currentPairIndex < pairs.length && expandedPairs[currentPairIndex][0] <= i;
			var pair = pairs[currentPairIndex];
			var expandedPair = expandedPairs[currentPairIndex];
			if (!inPair) {
				newParsed.push(part);
				return newParsed;
			}
			if (expandedPair[0] === i) {
				innerParts = [];
			}
			if (pair[0].offset !== i && pair[1].offset !== i) {
				innerParts.push(part);
			}
			if (expandedPair[1] === i) {
				var basePart = parsed[pair[0].offset];
				delete basePart.location;
				delete basePart.expandTo;
				basePart.subparsed = _postparse(innerParts);
				newParsed.push(basePart);
				currentPairIndex++;
			}
			return newParsed;
		}, []);
	}
};

module.exports = function () {
	return wrapper(expandPairTrait);
};