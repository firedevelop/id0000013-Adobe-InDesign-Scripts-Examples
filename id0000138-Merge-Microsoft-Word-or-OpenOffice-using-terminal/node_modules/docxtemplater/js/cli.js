#!/usr/bin/env node


"use strict";

/* eslint-disable no-console */
// Because we are in the cli

var fs = require("fs");
var JSZip = require("jszip");
var DocUtils = require("./doc-utils");
var Docxtemplater = require("./docxtemplater");
var fileExts = ["pptx", "docx"];
var path = require("path");

function showHelp() {
	console.info("Usage: docxtemplater <configFilePath>");
	console.info("--- ConfigFile Format: json");
	console.info("--- Supports filetypes: " + fileExts.join(","));
	return console.info("--- see https://docxtemplater.readthedocs.io/en/latest/cli.html");
}

if (process.argv[2] === "--help" || process.argv[2] === "-h" || process.argv[2] == null) {
	showHelp();
	throw new Error("Nothing to do");
}

var res = fs.readFileSync(process.argv[2], "utf-8");
var jsonInput = JSON.parse(res);

DocUtils.config = {};

var currentPath = process.cwd() + path.sep;
DocUtils.pathConfig = { node: currentPath };

for (var key in jsonInput) {
	if (key.substr(0, 7) === "config.") {
		DocUtils.config[key.substr(7)] = jsonInput[key];
	}
}

var ImageModule = null;
var sizeOf = null;

if (DocUtils.config.modules && DocUtils.config.modules.indexOf("docxtemplater-image-module") !== -1) {
	ImageModule = require("docxtemplater-image-module");
	sizeOf = require("image-size");
}

var imageDir = path.resolve(process.cwd(), DocUtils.config.imageDir || "") + path.sep;
var inputFileName = DocUtils.config.inputFile;
var fileType = inputFileName.indexOf(".pptx") !== -1 ? "pptx" : "docx";
var jsonFileName = process.argv[2];
var outputFile = DocUtils.config.outputFile;
var debug = DocUtils.config.debug;
var debugBool = DocUtils.config.debugBool;
if (jsonFileName == null || jsonFileName === "--help" || jsonFileName === "-h" || inputFileName == null) {
	showHelp();
	throw new Error("Nothing to do");
}
if (debug === "-d" || debug === "--debug") {
	debugBool = true;
}

if (debugBool) {
	console.info(process.cwd());
	console.info(debug);
}
if (debugBool) {
	console.info("loading docx:" + inputFileName);
}

var content = fs.readFileSync(currentPath + inputFileName, "binary");
var zip = new JSZip(content);
var doc = new Docxtemplater();

if (ImageModule && sizeOf) {
	var opts = {};
	opts.centered = false;
	opts.fileType = fileType;

	opts.getImage = function (tagValue) {
		var filePath = path.resolve(imageDir, tagValue);

		if (filePath.indexOf(imageDir) !== 0) {
			throw new Error("Images must be stored under folder: " + imageDir);
		}

		return fs.readFileSync(filePath, "binary");
	};

	opts.getSize = function (img, tagValue) {
		var dimensions = sizeOf(tagValue);
		return [dimensions.width, dimensions.height];
	};

	var imageModule = new ImageModule(opts);
	doc.attachModule(imageModule);
}

doc.loadZip(zip);
doc.setData(jsonInput);
doc.render();
var output = doc.getZip().generate({ type: "nodebuffer", compression: "DEFLATE" });

fs.writeFileSync(currentPath + outputFile, output);