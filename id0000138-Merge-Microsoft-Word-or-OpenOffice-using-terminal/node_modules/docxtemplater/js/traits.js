"use strict";

var DocUtils = require("./doc-utils");
var Errors = require("./errors");

function throwRawTagNotInParagraph(options) {
	var err = new Errors.XTTemplateError("Raw tag not in paragraph");
	var tag = options.part.value;
	err.properties = {
		id: "raw_tag_outerxml_invalid",
		explanation: "The tag \"" + tag + "\"",
		rootError: options.rootError,
		xtag: tag,
		postparsed: options.postparsed,
		expandTo: options.expandTo,
		index: options.index
	};
	throw err;
}

function lastTagIsOpenTag(array, tag) {
	if (array.length === 0) {
		return false;
	}
	var lastTag = array[array.length - 1];
	var innerLastTag = lastTag.tag.substr(1);
	var innerCurrentTag = tag.substr(2, tag.length - 3);
	return innerLastTag.indexOf(innerCurrentTag) === 0;
}

function addTag(array, tag) {
	array.push({ tag: tag });
	return array;
}

function getListXmlElements(parts) {
	/*
 get the different closing and opening tags between two texts (doesn't take into account tags that are opened then closed (those that are closed then opened are returned)):
 returns:[{"tag":"</w:r>","offset":13},{"tag":"</w:p>","offset":265},{"tag":"</w:tc>","offset":271},{"tag":"<w:tc>","offset":828},{"tag":"<w:p>","offset":883},{"tag":"<w:r>","offset":1483}]
 */
	var tags = parts.filter(function (part) {
		return part.type === "tag";
	}).map(function (part) {
		return part.value;
	});

	var result = [];

	for (var i = 0, tag; i < tags.length; i++) {
		tag = tags[i];
		// closing tag
		if (tag[1] === "/") {
			if (lastTagIsOpenTag(result, tag)) {
				result.pop();
			} else {
				result = addTag(result, tag);
			}
		} else if (tag[tag.length - 1] !== "/") {
			result = addTag(result, tag);
		}
	}
	return result;
}

function getExpandToDefault(parts) {
	var xmlElements = getListXmlElements(parts);
	for (var i = 0; i < xmlElements.length; i++) {
		var xmlElement = xmlElements[i];
		if (xmlElement.tag.indexOf("<w:tc") === 0) {
			return "w:tr";
		}
		if (xmlElement.tag.indexOf("<a:tc") === 0) {
			return "a:tr";
		}
	}
	return false;
}

function expandOne(part, postparsed, options) {
	var expandTo = part.expandTo || options.expandTo;
	var index = postparsed.indexOf(part);
	if (!expandTo) {
		return postparsed;
	}
	var right = void 0,
	    left = void 0;
	try {
		right = DocUtils.getRight(postparsed, expandTo, index);
		left = DocUtils.getLeft(postparsed, expandTo, index);
	} catch (rootError) {
		if (rootError instanceof Errors.XTTemplateError) {
			throwRawTagNotInParagraph({ part: part, rootError: rootError, postparsed: postparsed, expandTo: expandTo, index: index });
		}
		throw rootError;
	}
	var leftParts = postparsed.slice(left, index);
	var rightParts = postparsed.slice(index + 1, right + 1);
	var inner = options.getInner({ index: index, part: part, leftParts: leftParts, rightParts: rightParts, left: left, right: right, postparsed: postparsed });
	if (!inner.length) {
		inner.expanded = [leftParts, rightParts];
		inner = [inner];
	}
	return DocUtils.concatArrays([postparsed.slice(0, left), inner, postparsed.slice(right + 1)]);
}

function expandToOne(postparsed, options) {
	var expandToElements = postparsed.reduce(function (elements, part) {
		if (part.type === "placeholder" && part.module === options.moduleName) {
			elements.push(part);
		}
		return elements;
	}, []);

	expandToElements.forEach(function (part) {
		postparsed = expandOne(part, postparsed, options);
	});
	return postparsed;
}

module.exports = {
	expandToOne: expandToOne,
	getExpandToDefault: getExpandToDefault
};