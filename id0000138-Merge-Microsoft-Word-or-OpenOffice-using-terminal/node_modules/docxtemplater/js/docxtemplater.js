"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DocUtils = require("./doc-utils");
DocUtils.traits = require("./traits");
DocUtils.moduleWrapper = require("./module-wrapper");
var wrapper = DocUtils.moduleWrapper;

var Docxtemplater = function () {
	function Docxtemplater() {
		_classCallCheck(this, Docxtemplater);

		if (arguments.length > 0) {
			throw new Error("The constructor with parameters have been removed in docxtemplater 3.0, please check the upgrade guide.");
		}
		this.compiled = {};
		this.modules = [];
		this.setOptions({});
	}

	_createClass(Docxtemplater, [{
		key: "attachModule",
		value: function attachModule(module) {
			this.modules.push(wrapper(module));
			return this;
		}
	}, {
		key: "setOptions",
		value: function setOptions(options) {
			var _this = this;

			this.options = options;
			Object.keys(DocUtils.defaults).forEach(function (key) {
				var defaultValue = DocUtils.defaults[key];
				_this[key] = _this.options[key] != null ? _this.options[key] : defaultValue;
			});
			if (this.zip) {
				this.updateFileTypeConfig();
			}
			return this;
		}
	}, {
		key: "loadZip",
		value: function loadZip(zip) {
			if (zip.loadAsync) {
				throw new Error("Docxtemplater doesn't handle JSZip version >=3, see changelog");
			}
			this.zip = zip;
			this.updateFileTypeConfig();
			return this;
		}
	}, {
		key: "compileFile",
		value: function compileFile(fileName) {
			var currentFile = this.createTemplateClass(fileName);
			currentFile.parse();
			this.compiled[fileName] = currentFile;
		}
	}, {
		key: "compile",
		value: function compile() {
			this.templatedFiles = this.fileTypeConfig.getTemplatedFiles(this.zip);
			return this;
		}
	}, {
		key: "updateFileTypeConfig",
		value: function updateFileTypeConfig() {
			this.fileType = this.zip.files["word/document.xml"] ? "docx" : "pptx";
			this.fileTypeConfig = this.options.fileTypeConfig || Docxtemplater.FileTypeConfig[this.fileType];
			return this;
		}
	}, {
		key: "render",
		value: function render() {
			var _this2 = this;

			this.options.xmlFileNames = [];
			this.modules = this.fileTypeConfig.baseModules.map(function (moduleFunction) {
				return moduleFunction();
			}).concat(this.modules);
			this.options = this.modules.reduce(function (options, module) {
				return module.optionsTransformer(options, _this2);
			}, this.options);
			this.xmlDocuments = this.options.xmlFileNames.reduce(function (xmlDocuments, fileName) {
				var content = _this2.zip.files[fileName].asText();
				xmlDocuments[fileName] = DocUtils.str2xml(content);
				return xmlDocuments;
			}, {});
			this.modules.forEach(function (module) {
				module.set({ zip: _this2.zip, xmlDocuments: _this2.xmlDocuments, data: _this2.data });
			});
			this.compile();

			this.modules.forEach(function (module) {
				module.set({ compiled: _this2.compiled });
			});
			// Loop inside all templatedFiles (ie xml files with content).
			// Sometimes they don't exist (footer.xml for example)
			this.templatedFiles.forEach(function (fileName) {
				if (_this2.zip.files[fileName] != null) {
					_this2.compileFile(fileName);
				}
			});

			this.mapper = this.modules.reduce(function (value, module) {
				return module.getRenderedMap(value);
			}, {});

			Object.keys(this.mapper).forEach(function (to) {
				var mapped = _this2.mapper[to];
				var from = mapped.from;
				var currentFile = _this2.compiled[from];
				currentFile.setTags(mapped.data);
				currentFile.render(to);
				_this2.zip.file(to, currentFile.content);
			});

			Object.keys(this.xmlDocuments).forEach(function (fileName) {
				_this2.zip.remove(fileName);
				var content = DocUtils.xml2str(_this2.xmlDocuments[fileName]);
				return _this2.zip.file(fileName, content, {});
			});
			return this;
		}
	}, {
		key: "setData",
		value: function setData(data) {
			this.data = data;
			return this;
		}
	}, {
		key: "getZip",
		value: function getZip() {
			return this.zip;
		}
	}, {
		key: "createTemplateClass",
		value: function createTemplateClass(path) {
			var usedData = this.zip.files[path].asText();
			return this.createTemplateClassFromContent(usedData, path);
		}
	}, {
		key: "createTemplateClassFromContent",
		value: function createTemplateClassFromContent(content, filePath) {
			var _this3 = this;

			var xmltOptions = {
				filePath: filePath
			};
			Object.keys(DocUtils.defaults).forEach(function (key) {
				xmltOptions[key] = _this3[key];
			});
			xmltOptions.fileTypeConfig = this.fileTypeConfig;
			xmltOptions.modules = this.modules;
			return new Docxtemplater.XmlTemplater(content, xmltOptions);
		}
	}, {
		key: "getFullText",
		value: function getFullText(path) {
			return this.createTemplateClass(path || this.fileTypeConfig.textPath).getFullText();
		}
	}, {
		key: "getTemplatedFiles",
		value: function getTemplatedFiles() {
			this.compile();
			return this.templatedFiles;
		}
	}]);

	return Docxtemplater;
}();

Docxtemplater.DocUtils = require("./doc-utils");
Docxtemplater.Errors = require("./errors");
Docxtemplater.XmlTemplater = require("./xml-templater");
Docxtemplater.FileTypeConfig = require("./file-type-config");
Docxtemplater.XmlMatcher = require("./xml-matcher");
module.exports = Docxtemplater;