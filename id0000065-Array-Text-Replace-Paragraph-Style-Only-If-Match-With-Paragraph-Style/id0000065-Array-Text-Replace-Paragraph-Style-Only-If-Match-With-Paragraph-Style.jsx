var myDoc = app.activeDocument,      
myCodes = ["human","free"],    
C = myCodes.length,  c;      
app.findTextPreferences = null;    
for ( c = 0; c < C; c++) {         
    app.findTextPreferences.findWhat = myCodes[c];         
    myFound = myDoc.findText();      
    var F = myFound.length,  f;    
    for ( f = 0; f < F; f++) {    
        myFound[f].appliedCharacterStyle = myDoc.characterStyles[0];    
        if (( myFound[f].appliedParagraphStyle.name == 'Style 01') || ( myFound[f].appliedParagraphStyle.name == 'Style 02') || ( myFound[f].appliedParagraphStyle.name == 'Style 03') || ( myFound[f].appliedParagraphStyle.name == 'Style 04')) {    
            myFound[f].appliedParagraphStyle = myDoc.paragraphStyles.item('MyStyle'); 
        } else{}  
    }    
} 