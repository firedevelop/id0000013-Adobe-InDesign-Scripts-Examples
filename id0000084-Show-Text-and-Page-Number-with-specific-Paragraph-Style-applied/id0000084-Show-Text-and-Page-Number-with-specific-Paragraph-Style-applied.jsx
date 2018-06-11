var myDoc = app.activeDocument;  
var list=new Array();  
app.findTextPreferences = app.changeTextPreferences = null;  
app.findTextPreferences.appliedParagraphStyle = "Title";  
var mySearch = app.activeDocument.findText();  
var msg="";  
  
  
for (i = 0; i < mySearch.length; i++){  
  
  
    msg+=mySearch[i].contents+" - "+mySearch[i].parentTextFrames[0].parent.name+"\r";  
 }  
alert(msg); 
var finds = myDoc.findText();
if (finds.length > 0) { 
alert("Found " + finds.length + " items, the first of them is on page " + finds[0].parentTextFrames[0].parentPage.name);
} 





