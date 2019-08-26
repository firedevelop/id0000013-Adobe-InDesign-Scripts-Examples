#target "indesign";      
(function () {      
    var doc = app.activeDocument,      
        indexIdx = doc.indexes.length - 1;      
              
    function removeNewEntriesFromIndex(index) {      
        var idx = index.topics.length - 1;      
          
        topics = app.documents[0].indexes[0].allTopics;  
          
        for (idx = topics.length-1; idx >= 0; idx--) {  
            // index.topics[idx].name = index.topics[idx].name.replace(/ *NEW$/, '');      
            index.topics[idx].name = index.topics[idx].name.replace(/ *Article 1.$/, 'Article One');      
            index.topics[idx].name = index.topics[idx].name.replace(/ *rights$/, 'human rights');     
        }      
    }      
          
    for (; indexIdx >= 0; indexIdx -= 1) {      
        removeNewEntriesFromIndex(doc.indexes[indexIdx]);      
    }      
}());     