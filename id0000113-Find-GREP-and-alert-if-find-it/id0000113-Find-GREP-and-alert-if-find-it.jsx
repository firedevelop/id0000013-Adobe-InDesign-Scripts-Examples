// create variable  
var myDoc = app.activeDocument,        
myCodes = "\\d+";  
  
//use grep 
app.findGrepPreferences = app.changeGrepPreferences = NothingEnum.nothing;   
  
app.findGrepPreferences.findWhat = myCodes;    
// variable result
var myFound = app.activeDocument.findGrep();    
// loop for the variable
for ( f = 0; f < myFound.length; f++) {       
        
        // To avoid any risk, in this conditional we only apply the changes if have a specific Paragraph Style name.    
        if (( myFound[f].appliedParagraphStyle.name == 'Index Level 01 Roman') || ( myFound[f].appliedParagraphStyle.name == 'Index Level 02 Roman') || ( myFound[f].appliedParagraphStyle.name == 'Index Level 03 Roman') || ( myFound[f].appliedParagraphStyle.name == 'Index Level 04 Roman')) {      
            myFound[f].appliedCharacterStyle = 'Roman';    
        }      
   }   