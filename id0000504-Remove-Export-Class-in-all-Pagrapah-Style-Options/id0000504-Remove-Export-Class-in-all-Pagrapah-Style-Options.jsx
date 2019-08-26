var se = app.documents[0].allParagraphStyles  
for(var i = 0; i < se.length; i++)  
{  
    for(var j = 0; j < se[i].styleExportTagMaps.length; j++)  
    {  
          if(se[i].styleExportTagMaps[j].exportType == "EPUB")   
              se[i].styleExportTagMaps[j].exportClass = ""  
    }  
}  