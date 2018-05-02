// Find and Change the words inside the array, only if they have applied specific Paragraph Style name. 
// Github: https://github.com/firedevelop/id0000013-Adobe-InDesign-Scripts-Examples/tree/master/id0000065-Array-Text-Replace-Paragraph-Style-Only-If-Match-With-Paragraph-Style
// video: https://youtu.be/aD7jQBdfxco
var myDoc = app.activeDocument,      
myCodes = ["human","free"],    
C = myCodes.length,  c;      
app.findTextPreferences = null;    
for ( c = 0; c < C; c++) {         
    app.findTextPreferences.findWhat = myCodes[c];         
    myFound = myDoc.findText();      
    var F = myFound.length,  f; 
    
    var Style_01 = myDoc.paragraphStyleGroups.itemByName("INDEX").paragraphStyles.itemByName("Style_01");
    var Style_02 = myDoc.paragraphStyleGroups.itemByName("INDEX").paragraphStyles.itemByName("Style_02");
    var Style_03 = myDoc.paragraphStyleGroups.itemByName("INDEX").paragraphStyles.itemByName("Style_03");
    var MyStyle = myDoc.paragraphStyleGroups.itemByName("INDEX").paragraphStyles.itemByName("MyStyle");   
    
    for ( f = 0; f < F; f++) {    
        myFound[f].appliedCharacterStyle = myDoc.characterStyles[0];
        
        if ((myFound[f].appliedParagraphStyle == Style_01) || 
            (myFound[f].appliedParagraphStyle == Style_02) || 
            (myFound[f].appliedParagraphStyle == Style_03)) {    
            
                myFound[f].appliedParagraphStyle = MyStyle; 
        } else{}
    }    
} 