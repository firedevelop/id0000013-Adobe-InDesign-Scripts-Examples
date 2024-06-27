var xrefs = app.documents[0].crossReferenceSources.everyItem().getElements();  
for (var i = xrefs.length-1; i > -1; i--){  
    xrefs[i].sourceText.insertionPoints[-1].contents = xrefs[i].sourceText.contents;  
    xrefs[i].sourceText.contents = "";  
} 