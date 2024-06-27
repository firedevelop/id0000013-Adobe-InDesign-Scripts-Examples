"use strict";

var Errors = require("./errors");
var DocUtils = require("./doc-utils");

function inRange(range, match) {
	return range[0] <= match.offset && match.offset < range[1];
}

function updateInTextTag(part, inTextTag) {
	if (part.type === "tag" && part.position === "start" && part.text) {
		if (inTextTag) {
			throw new Error("Malformed xml : Already in text tag");
		}
		return true;
	}
	if (part.type === "tag" && part.position === "end" && part.text) {
		if (!inTextTag) {
			throw new Error("Malformed xml : Already not in text tag");
		}
		return false;
	}
	return inTextTag;
}

function offsetSort(a, b) {
	return a.offset - b.offset;
}

function getTag(tag) {
	var start = 1;
	if (tag[1] === "/") {
		start = 2;
	}
	var index = tag.indexOf(" ");
	var end = index === -1 ? tag.length - 1 : index;
	return {
		tag: tag.slice(start, end),
		position: start === 1 ? "start" : "end"
	};
}

function tagMatcher(content, textMatchArray, othersMatchArray) {
	var cursor = 0;
	var contentLength = content.length;
	var allMatches = DocUtils.concatArrays([textMatchArray.map(function (tag) {
		return { tag: tag, text: true };
	}), othersMatchArray.map(function (tag) {
		return { tag: tag, text: false };
	})]).reduce(function (allMatches, t) {
		allMatches[t.tag] = t.text;
		return allMatches;
	}, {});
	var totalMatches = [];

	while (cursor < contentLength) {
		cursor = content.indexOf("<", cursor);
		if (cursor === -1) {
			break;
		}
		var offset = cursor;
		cursor = content.indexOf(">", cursor);
		var tagText = content.slice(offset, cursor + 1);

		var _getTag = getTag(tagText),
		    tag = _getTag.tag,
		    position = _getTag.position;

		var text = allMatches[tag];
		if (text == null) {
			continue;
		}
		totalMatches.push({ type: "tag", position: position, text: text, offset: offset, value: tagText });
	}

	return totalMatches;
}

function throwUnopenedTagException(options) {
	var err = new Errors.XTTemplateError("Unopened tag");
	err.properties = {
		xtag: options.xtag.split(" ")[0],
		id: "unopened_tag",
		context: options.xtag,
		explanation: "The tag beginning with '" + options.xtag.substr(0, 10) + "' is unclosed"
	};
	throw err;
}

function throwUnclosedTagException(options) {
	var err = new Errors.XTTemplateError("Unclosed tag");
	err.properties = {
		xtag: options.xtag.split(" ")[0].substr(1),
		id: "unclosed_tag",
		context: options.xtag,
		explanation: "The tag beginning with '" + options.xtag.substr(0, 10) + "' is unclosed"
	};
	throw err;
}

function assertDelimiterOrdered(delimiterMatches, fullText) {
	var inDelimiter = false;
	var lastDelimiterMatch = { offset: 0 };
	var xtag = void 0;
	delimiterMatches.forEach(function (delimiterMatch) {
		xtag = fullText.substr(lastDelimiterMatch.offset, delimiterMatch.offset - lastDelimiterMatch.offset);
		if (delimiterMatch.position === "start" && inDelimiter || delimiterMatch.position === "end" && !inDelimiter) {
			if (delimiterMatch.position === "start") {
				throwUnclosedTagException({ xtag: xtag });
			} else {
				throwUnopenedTagException({ xtag: xtag });
			}
		}
		inDelimiter = !inDelimiter;
		lastDelimiterMatch = delimiterMatch;
	});
	var delimiterMatch = { offset: fullText.length };
	xtag = fullText.substr(lastDelimiterMatch.offset, delimiterMatch.offset - lastDelimiterMatch.offset);
	if (inDelimiter) {
		throwUnclosedTagException({ xtag: xtag });
	}
}

function getAllIndexes(arr, val, position) {
	var indexes = [];
	var offset = -1;
	do {
		offset = arr.indexOf(val, offset + 1);
		if (offset !== -1) {
			indexes.push({ offset: offset, position: position });
		}
	} while (offset !== -1);
	return indexes;
}

function Reader(innerContentParts) {
	var _this = this;

	this.innerContentParts = innerContentParts;
	this.full = "";
	this.parseDelimiters = function (delimiters) {
		_this.full = _this.innerContentParts.join("");
		var offset = 0;
		_this.ranges = _this.innerContentParts.map(function (part) {
			offset += part.length;
			return offset - part.length;
		});

		var delimiterMatches = DocUtils.concatArrays([getAllIndexes(_this.full, delimiters.start, "start"), getAllIndexes(_this.full, delimiters.end, "end")]).sort(offsetSort);
		assertDelimiterOrdered(delimiterMatches, _this.full);
		var delimiterLength = { start: delimiters.start.length, end: delimiters.end.length };
		var cutNext = 0;
		var delimiterIndex = 0;

		_this.parsed = _this.ranges.map(function (offset, i) {
			var range = [offset, offset + this.innerContentParts[i].length];
			var partContent = this.innerContentParts[i];
			var delimitersInOffset = [];
			while (delimiterIndex < delimiterMatches.length && inRange(range, delimiterMatches[delimiterIndex])) {
				delimitersInOffset.push(delimiterMatches[delimiterIndex]);
				delimiterIndex++;
			}
			var parts = [];
			var cursor = 0;
			if (cutNext > 0) {
				cursor = cutNext;
				cutNext = 0;
			}
			delimitersInOffset.forEach(function (delimiterInOffset) {
				var value = partContent.substr(cursor, delimiterInOffset.offset - offset - cursor);
				if (value.length > 0) {
					parts.push({ type: "content", value: value });
				}
				parts.push({ type: "delimiter", position: delimiterInOffset.position });
				cursor = delimiterInOffset.offset - offset + delimiterLength[delimiterInOffset.position];
			});
			cutNext = cursor - partContent.length;
			var value = partContent.substr(cursor);
			if (value.length > 0) {
				parts.push({ type: "content", value: value });
			}
			return parts;
		}, _this);
	};
}

module.exports = {
	parse: function parse(xmlparsed, delimiters) {
		var inTextTag = false;
		var innerContentParts = [];
		xmlparsed.forEach(function (part) {
			inTextTag = updateInTextTag(part, inTextTag);
			if (inTextTag && part.type === "content") {
				innerContentParts.push(part.value);
			}
		});
		var reader = new Reader(innerContentParts);
		reader.parseDelimiters(delimiters);

		var newArray = [];
		var index = 0;
		xmlparsed.forEach(function (part) {
			inTextTag = updateInTextTag(part, inTextTag);
			if (part.type === "content") {
				part.position = inTextTag ? "insidetag" : "outsidetag";
			}
			if (inTextTag && part.type === "content") {
				Array.prototype.push.apply(newArray, reader.parsed[index].map(function (p) {
					if (p.type === "content") {
						p.position = "insidetag";
					}
					return p;
				}));
				index++;
			} else {
				newArray.push(part);
			}
		});
		return newArray;
	},
	xmlparse: function xmlparse(content, xmltags) {
		var matches = tagMatcher(content, xmltags.text, xmltags.other);
		var cursor = 0;
		var parsed = matches.reduce(function (parsed, match) {
			var value = content.substr(cursor, match.offset - cursor);
			if (value.length > 0) {
				parsed.push({ type: "content", value: value });
			}
			cursor = match.offset + match.value.length;
			delete match.offset;
			if (match.value.length > 0) {
				parsed.push(match);
			}
			return parsed;
		}, []);
		var value = content.substr(cursor);
		if (value.length > 0) {
			parsed.push({ type: "content", value: value });
		}
		return parsed;
	}
};