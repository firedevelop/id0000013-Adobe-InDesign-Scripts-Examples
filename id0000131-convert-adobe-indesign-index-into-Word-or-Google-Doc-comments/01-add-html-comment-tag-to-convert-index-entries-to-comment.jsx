// Project name: id0000131-convert-index-entries-into-Word-or-Google-Doc-comments
// Github: Adobe Indesign Script examples: https://github.com/firedevelop/id0000013-Adobe-InDesign-Scripts-Examples
// Github of this project: https://github.com/firedevelop/id0000013-Adobe-InDesign-Scripts-Examples/tree/master/id0000131-convert-tag-text-to-comment-for-work-with-google-doc-or-word
// YouTube Playlist: https://www.youtube.com/playlist?list=PLfdbMQ5CoohPqK8ekjthm2fNoGMLwYeFf
// Blog: https://www.firedevelop.com/2018/11/id0000131-convert-index-entries-into.html

// Script Author:
// Peter Kahrel -- www.kahrel.plus.com
// http://www.kahrel.plus.com/indesign/index-to-text.jsx
// http://www.kahrel.plus.com/indesign/index_to_text.html



(function () {
	
	function addSortOrder (topic) {
		var s = topic.name;
		if (topic.sortOrder !== '') {
			s += '@' + topic.sortOrder;
		}
		return s;
	}

	function topicPath (topic, str) {
		if (topic.parent.constructor.name == 'Index') {
			return str;
		} else {
			return topicPath (topic.parent, addSortOrder (topic.parent) + '#' + str);
		}
	}

	function main () {
		var i, j;
		var topics;
		var err = false;
		if (app.documents[0].indexes.length === 0) {
			alert ('Document doesn\'t have an index.');
			exit();
		}
		topics = app.documents[0].indexes[0].allTopics;
		for (i = topics.length-1; i >= 0; i--) {
			for (j = topics[i].pageReferences.length-1; j > -1; j--) {
				try {
					topics[i].pageReferences[j].sourceText.contents = '<!-- ' + topicPath (topics[i], addSortOrder (topics[i])) + ' -->';
					//topics[i].pageReferences[j].remove();
				} catch (_) {
					err = true;
				}
			}
		}
		if (err) {
			alert ('Some markers could not be converted. Please check the Index panel');
		}
	}

	main();
	
}());