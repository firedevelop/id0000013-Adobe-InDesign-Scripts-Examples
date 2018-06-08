//_____________________________________________________________________________________
//		 COUNT ALL PARAGRAPH STYLES IN A PARAGRAPH STYLES GROUP WITH THE SAME NAME             

var myDoc = app.documents[0];
     
var paragraphStyle1 = [];     
var counter = 0;     
var paragraphStyleGroup1 = myDoc.paragraphStyleGroups.itemByName("CHAPTERS");  
while(counter < paragraphStyleGroup1.paragraphStyles.length){      
    if(paragraphStyleGroup1.paragraphStyles[counter].name.toString().indexOf("Chapter ") != -1){    
		paragraphStyle1.push(paragraphStyleGroup1.paragraphStyles[counter]);}      
  counter++;}   
totalParagraphStyle1=paragraphStyle1.length;   
alert("The Total Paragraph Styles: " + totalParagraphStyle1);  

//____________________________________________________________________________________
//      END COUNT ALL PARAGRAPH STYLES IN A PARAGRAPH STYLES GROUP WITH THE SAME NAME