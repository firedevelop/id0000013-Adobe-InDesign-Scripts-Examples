(function () { 
    #include translate.jsx; 
    var doc = app.activeDocument,      
        indexIdx = doc.indexes.length - 1;     
    
    
    function removeNewEntriesFromIndex(index) {  
            
        var idx = index.topics.length - 1;        
        for (; idx >= 0; idx -= 1) {      
                
            index.topics[idx].name = index.topics[idx].name.replace(english1, spanish1);  
            index.topics[idx].name = index.topics[idx].name.replace(english2, spanish2);
            index.topics[idx].name = index.topics[idx].name.replace(english3, spanish3);

        }      
    }      
          
    for (; indexIdx >= 0; indexIdx -= 1) {      
        removeNewEntriesFromIndex(doc.indexes[indexIdx]);      
    }      
}());  