(function () {  
    var doc = app.activeDocument,  
        indexIdx = doc.indexes.length - 1;  
          
    function removeNewEntriesFromIndex(index) {  
        var idx = index.topics.length - 1;  
          
        for (; idx >= 0; idx -= 1) {  
            $.writeln(idx);

            index.topics[idx].name = index.topics[idx].name.replace(/ *^wisdom$/, 'sabiduría');
            index.topics[idx].name = index.topics[idx].name.replace(/ *^wisdom realizing knowledge$/, 'sabiduría que realiza el conocimiento');
            index.topics[idx].name = index.topics[idx].name.replace(/ *^realizing knowledge$/, 'que realiza el conocimiento');
            index.topics[idx].name = index.topics[idx].name.replace(/ *^knowledge$/, 'conocimiento');
        }  
    }  
      
    for (; indexIdx >= 0; indexIdx -= 1) {  
        removeNewEntriesFromIndex(doc.indexes[indexIdx]);  
    }  
}()); 