"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DocUtils = require("./doc-utils");
var ScopeManager = require("./scope-manager");
var xmlMatcher = require("./xml-matcher");
var Errors = require("./errors");
var Lexer = require("./lexer");
var Parser = require("./parser.js");
var _render = require("./render.js");

function _getFullText(content, tagsXmlArray) {
	var matcher = xmlMatcher(content, tagsXmlArray);
	var result = matcher.matches.map(function (match) {
		return match.array[2];
	});
	return DocUtils.wordToUtf8(DocUtils.convertSpaces(result.join("")));
}

module.exports = function () {
	function XmlTemplater(content, options) {
		_classCallCheck(this, XmlTemplater);

		this.fromJson(options);
		this.setModules({ inspect: { filePath: this.filePath } });
		this.load(content);
	}

	_createClass(XmlTemplater, [{
		key: "load",
		value: function load(content) {
			if (typeof content !== "string") {
				var err = new Errors.XTInternalError("Content must be a string");
				err.properties.id = "xmltemplater_content_must_be_string";
				throw err;
			}
			this.content = content;
		}
	}, {
		key: "setTags",
		value: function setTags(tags) {
			this.tags = tags != null ? tags : {};
			this.scopeManager = ScopeManager.createBaseScopeManager({ tags: this.tags, parser: this.parser });
			return this;
		}
	}, {
		key: "fromJson",
		value: function fromJson(options) {
			this.filePath = options.filePath;
			this.modules = options.modules;
			this.fileTypeConfig = options.fileTypeConfig;
			Object.keys(DocUtils.defaults).map(function (key) {
				this[key] = options[key] != null ? options[key] : DocUtils.defaults[key];
			}, this);
		}
	}, {
		key: "getFullText",
		value: function getFullText() {
			return _getFullText(this.content, this.fileTypeConfig.tagsXmlTextArray);
		}
	}, {
		key: "setModules",
		value: function setModules(obj) {
			this.modules.forEach(function (module) {
				module.set(obj);
			});
		}
	}, {
		key: "parse",
		value: function parse() {
			this.xmllexed = Lexer.xmlparse(this.content, { text: this.fileTypeConfig.tagsXmlTextArray, other: this.fileTypeConfig.tagsXmlLexedArray });
			this.setModules({ inspect: { xmllexed: this.xmllexed } });
			this.lexed = Lexer.parse(this.xmllexed, this.delimiters);
			this.setModules({ inspect: { lexed: this.lexed } });
			this.parsed = Parser.parse(this.lexed, this.modules);
			this.setModules({ inspect: { parsed: this.parsed } });
			this.postparsed = Parser.postparse(this.parsed, this.modules);
			return this;
		}
		/*
  content is the whole content to be tagged
  scope is the current scope
  returns the new content of the tagged content
  */

	}, {
		key: "render",
		value: function render(to) {
			this.filePath = to;
			this.setModules({ inspect: { postparsed: this.postparsed } });
			this.content = _render({
				compiled: this.postparsed,
				tags: this.tags,
				modules: this.modules,
				parser: this.parser,
				nullGetter: this.nullGetter,
				filePath: this.filePath
			});
			this.setModules({ inspect: { content: this.content } });
			return this;
		}
	}]);

	return XmlTemplater;
}();