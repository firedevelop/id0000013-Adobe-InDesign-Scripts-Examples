app.findTextPreferences = null;  
app.findTextPreferences.appliedParagraphStyle = app.activeDocument.paragraphStyles.item("Text01");  
sourcelist = app.activeDocument.findText();  
targetlist = [];  
for (l=0; l<sourcelist.length; l++)  
{  
 next = sourcelist[l].paragraphs.nextItem(sourcelist[l].paragraphs[0]);  
 if (next != null && next.appliedParagraphStyle.name == "Title 2.1")  
  targetlist.push(sourcelist[l]);  
}  
alert (sourcelist.length+" -> "+targetlist.length);