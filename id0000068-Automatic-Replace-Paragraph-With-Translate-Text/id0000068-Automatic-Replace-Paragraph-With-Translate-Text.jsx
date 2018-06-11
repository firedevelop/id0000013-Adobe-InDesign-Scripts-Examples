if (app.documents.length != 2) {
    alert("2 documents must be opened!");
    exit();
    } 
    var myDocEn = app.activeDocument;
    var myDocSp = app.documents[1];
    var myStoryEn = myDocEn.stories[0];
    var myStorySp = myDocSp.stories[0];
    
    var paraLenEn = myStoryEn.paragraphs.length; 
    var paraLenSp = myStorySp.paragraphs.length;
    
    if(paraLenSp != paraLenEn) {
    alert("Mismatch by number of paragraphs")
    exit();
    }
    
    for(var i = paraLenEn-1; i >=0; i--)
    {
    
    myStyle = myStoryEn.paragraphs[i].appliedParagraphStyle;
    myStyleName = myStoryEn.paragraphs[i].appliedParagraphStyle.name;
    
    while(myStyle.parent instanceof ParagraphStyleGroup)
    {
    myStyleName = myStyle.parent.name + ":" + myStyleName;
    myStyle = myStyle.parent;
    }
    
    myStorySp.paragraphs[i].appliedParagraphStyle = getParagraphStyleByName(myStyleName, myDocSp);
    }
    alert("Done");
    
    function getParagraphStyleByName(myStyleName, doc)
    {
    var myParagraphStyles = doc.allParagraphStyles;
    var myParagraphStyleName, obj;
    for(var i=0; i < myParagraphStyles.length ; i++)
    {
    myParagraphStyleName = myParagraphStyles[i].name;
    obj = myParagraphStyles[i];
    while(obj.parent instanceof ParagraphStyleGroup)
    {
    myParagraphStyleName = obj.parent.name + ":" + myParagraphStyleName;
    obj = obj.parent; 
    }
    if(myParagraphStyleName == myStyleName) return myParagraphStyles[i];
    } // for
    
    } // fnc