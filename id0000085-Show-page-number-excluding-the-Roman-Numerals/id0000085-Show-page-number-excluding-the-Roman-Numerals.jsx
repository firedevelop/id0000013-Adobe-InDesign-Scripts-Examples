var sections = app.documents[0].sections.everyItem().getElements();  
  
for( var n=0;n<sections.length;n++ )  
{  
var firstPageInSection = sections[n].pageStart;  
var firstPageOfSectionPositionInDocument = firstPageInSection.documentOffset;  
//var firstPageName = firstPageInSection.name;  

//var pageNumberStyle = sections[n].pageNumberStyle;  

$.writeln( n +"\t"+firstPageOfSectionPositionInDocument );
//$.writeln( n +"\t"+firstPageName );    
//$.writeln( n +"\t"+pageNumberStyle.toString() ); 
if (firstPageOfSectionPositionInDocument != 0){
    alert ("The second section has the page number: "+firstPageOfSectionPositionInDocument+1);

} else{};
}  