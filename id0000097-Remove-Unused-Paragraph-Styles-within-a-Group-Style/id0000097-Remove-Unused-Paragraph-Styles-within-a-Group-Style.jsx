
ArrayCompress=function(array){    
    var str = array.sort().join('\r')+'\r'      
    str = str.replace(/([^\r]+\r)(\1)+/g,'$1')      
    str = str.replace(/\r$/,'')      
    return str.split('\r')      
}    
IsInArray = function (item,array){    
   for(var i=0;i<array.length;i++){    
       if(array[i] == item){return true;}    
   }    
   return false;    
}    

var doc = app.documents[0];    
var styles = doc.stories.everyItem().paragraphs.everyItem().appliedParagraphStyle;    
try{    
styles = styles.concat(doc.stories.everyItem().footnotes.everyItem().paragraphs.everyItem().appliedParagraphStyle);    
}catch(e){}    
try{    
styles = styles.concat(doc.stories.everyItem().tables.everyItem().cells.everyItem().paragraphs.everyItem().appliedParagraphStyle);    
}catch(e){}    
var names = [];    
for(var i=0;i<styles.length;i++){    
names[i] = styles[i].name;    
}    
names = ArrayCompress(names);    
var allStyles = doc.allParagraphStyles;    
for(var i=allStyles.length-1;i>=0;i--){    
if(IsInArray(allStyles[i].name,names)){ allStyles.splice(i,1);   }    
}    


var appendixStyles = doc.paragraphStyleGroups.itemByName("APPENDIX").paragraphStyles;  
var stylesToRemove = [];  

for ( var k = 0; k < allStyles.length; k++)  
{  
for ( var l = 0; l < appendixStyles.length; l++)  
{  
  if ( allStyles[k].name == appendixStyles[l].name)  
  {  
      stylesToRemove.push ( appendixStyles[l]);  
  }  
}  
}  

for ( var p = stylesToRemove.length-1; p > 0; p--)  
{  
stylesToRemove[p].remove();  
}  