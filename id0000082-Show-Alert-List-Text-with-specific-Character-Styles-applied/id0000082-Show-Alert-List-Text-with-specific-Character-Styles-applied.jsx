var myDoc = app.activeDocument;  
var list=new Array();  
app.findTextPreferences = app.changeTextPreferences = null;  
app.findTextPreferences.appliedCharacterStyle = "Article";  
var mySearch = app.activeDocument.findText();  
var msg="";  
  
  
for (i = 0; i < mySearch.length; i++){  
  
  
    msg+=mySearch[i].contents+" - "+mySearch[i].parentTextFrames[0].parent.name+"\r";  
 }  
alert(msg);  