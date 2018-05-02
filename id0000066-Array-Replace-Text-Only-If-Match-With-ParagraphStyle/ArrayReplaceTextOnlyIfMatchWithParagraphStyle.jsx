// This Script change the character styles in the list of names that match the indicated paragraph styles.
// Very usefull when you have for example a Index, and you need the titles of the books or some special characters (like spaces or hidden characters) appear with a character style Italic u others.

var myDoc = app.activeDocument,    
myCodes = [
// In this array you need add all titles you want apply the Character Style Italic. 

/* OTHERS */
"human",
"free",
"rights"

],  C = myCodes.length,  c;    
app.findTextPreferences = null;  
for ( c = 0; c < C; c++) {       
    app.findTextPreferences.findWhat = myCodes[c];       
    myFound = myDoc.findText();    
    var F = myFound.length,  f;  
    for ( f = 0; f < F; f++) {  
        myFound[f].appliedCharacterStyle = myDoc.characterStyles[0];  
        // To avoid any risk, in this conditional we only apply the changes if have a specific Paragraph Style name.
        if (( myFound[f].appliedParagraphStyle.name == 'Text Special 01') || ( myFound[f].appliedParagraphStyle.name == 'Text Special 02') || ( myFound[f].appliedParagraphStyle.name == 'Text Special 03')) {  
            // Apply to all array list names the Character Style Italic. We do this because the titles in Spanish need be with the Italic format.
            myFound[f].appliedCharacterStyle = 'Italic';
        } else{}
    }  
}  
