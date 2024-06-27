"use strict";

var loopModule = require("./modules/loop");
var spacePreserveModule = require("./modules/space-preserve");
var rawXmlModule = require("./modules/rawxml");
var expandPairTrait = require("./modules/expand-pair-trait");
var render = require("./modules/render");

var PptXFileTypeConfig = {
	getTemplatedFiles: function getTemplatedFiles(zip) {
		var slideTemplates = zip.file(/ppt\/(slides|slideMasters)\/(slide|slideMaster)\d+\.xml/).map(function (file) {
			return file.name;
		});
		return slideTemplates.concat(["ppt/presentation.xml"]);
	},

	textPath: "ppt/slides/slide1.xml",
	tagsXmlTextArray: ["a:t", "m:t"],
	tagsXmlLexedArray: ["p:sp", "a:tc", "a:tr", "a:table", "a:p", "a:r"],
	tagRawXml: "p:sp",
	tagTextXml: "a:t",
	baseModules: [render, expandPairTrait, rawXmlModule, loopModule]
};

var DocXFileTypeConfig = {
	getTemplatedFiles: function getTemplatedFiles(zip) {
		var slideTemplates = zip.file(/word\/(header|footer)\d+\.xml/).map(function (file) {
			return file.name;
		});
		return slideTemplates.concat(["word/document.xml"]);
	},

	textPath: "word/document.xml",
	tagsXmlTextArray: ["w:t", "m:t"],
	tagsXmlLexedArray: ["w:tc", "w:tr", "w:table", "w:p", "w:r"],
	tagRawXml: "w:p",
	tagTextXml: "w:t",
	baseModules: [render, spacePreserveModule, expandPairTrait, rawXmlModule, loopModule]
};

module.exports = {
	docx: DocXFileTypeConfig,
	pptx: PptXFileTypeConfig
};