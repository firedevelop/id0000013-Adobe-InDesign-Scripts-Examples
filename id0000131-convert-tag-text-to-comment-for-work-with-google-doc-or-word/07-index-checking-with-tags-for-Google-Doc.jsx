//DESCRIPTION: Convert index entries to text tags and delete the index
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
					topics[i].pageReferences[j].sourceText.contents = '<ix>' + topicPath (topics[i], addSortOrder (topics[i])) + '</ix>';
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