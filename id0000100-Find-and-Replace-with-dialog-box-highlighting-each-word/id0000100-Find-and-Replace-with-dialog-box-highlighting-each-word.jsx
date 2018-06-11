// https://forums.adobe.com/message/9004008#9004008
app.findTextPreferences = app.changeTextPreferences = null;  
app.findTextPreferences.findWhat = "Article 1.";  
app.changeTextPreferences.changeTo = "Article ONE.";  
  
var allFounds = app.activeDocument.findText();  
for (var i = 0; i < allFounds.length; i++) {  
  var curFound = allFounds[i];  
  curFound.select();  
  app.layoutWindows[0].zoomPercentage = app.layoutWindows[0].zoomPercentage;  
   if(confirm("Do you wish to change this instance?",undefined, "Find/Replace")) {  
     curFound.changeText();  
  }  
}  
  
app.findTextPreferences = app.changeTextPreferences = null;  