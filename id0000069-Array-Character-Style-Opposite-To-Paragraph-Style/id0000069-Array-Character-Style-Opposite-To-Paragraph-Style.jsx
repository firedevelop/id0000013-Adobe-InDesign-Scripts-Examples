var myDoc = app.activeDocument,    
myCodes = ["STR 94583", "TRe87 090", "MR 840EOA"],  C = myCodes.length,  c;    
app.findTextPreferences = null;  
for ( c = 0; c < C; c++) {       
    app.findTextPreferences.findWhat = myCodes[c];       
    myFound = myDoc.findText();    
    var F = myFound.length,  f;  
    for ( f = 0; f < F; f++) {  
        myFound[f].appliedCharacterStyle = myDoc.characterStyles[0];  
         
            if ( myFound[f].appliedParagraphStyle = 'Text Roman' ){
                myFound[f].appliedCharacterStyle = 'Italic';
            }   
            if ( myFound[f].appliedParagraphStyle = 'Text Italic' ){
                myFound[f].appliedCharacterStyle = 'Roman';
            }  

          
        
          
    }  
} 