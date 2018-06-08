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
alert("Total Paragraph Styles: " + totalParagraphStyle1);  

//____________________________________________________________________________________
//      END COUNT ALL PARAGRAPH STYLES IN A PARAGRAPH STYLES GROUP WITH THE SAME NAME





//_____________________________________________________________________________________
//                   START Apply Master Page based on Paragraph Style 

var myDocument = app.activeDocument;
var myParas = myDocument.stories.everyItem().paragraphs.everyItem().getElements();
var myPage = myDocument.pages;
totalParagraphStyle1++;

for(i=0; i<myParas.length; i++){

	for(j=0;j<totalParagraphStyle1;j++){
		if(myParas[i].appliedParagraphStyle.name == "Chapter "+[j]){
			myParas[i].parentTextFrames[0].parentPage.appliedMaster = myDocument.masterSpreads.item("C"+[j]+"-Chapter");}}

}
alert("Done!");
//_____________________________________________________________________________________
//                     END Apply Master Page based on Paragraph Style 

