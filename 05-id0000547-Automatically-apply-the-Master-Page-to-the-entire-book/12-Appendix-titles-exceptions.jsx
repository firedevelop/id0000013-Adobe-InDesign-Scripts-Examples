//_____________________________________________________________________________________
//                   START Apply Master Page based on Paragraph Style 
/*
var myDocument = app.activeDocument;
var myParas = myDocument.stories.everyItem().paragraphs.everyItem().getElements();
var myPage = myDocument.pages;

for(i=0; i<myParas.length; i++){

if(myParas[i].appliedParagraphStyle.name == "Appendix 1.1"){
	myParas[i].parentTextFrames[0].parentPage.appliedMaster = myDocument.masterSpreads.item("E-Empty 1.1");}	

}
*/
//_____________________________________________________________________________________
//                     END Apply Master Page based on Paragraph Style 
