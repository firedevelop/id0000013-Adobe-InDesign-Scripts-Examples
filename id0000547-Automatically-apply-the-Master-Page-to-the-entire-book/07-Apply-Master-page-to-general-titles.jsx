//_____________________________________________________________________________________
//                   START Apply Master Page based on Paragraph Style 

var myDocument = app.activeDocument;
var myParas = myDocument.stories.everyItem().paragraphs.everyItem().getElements();
var myPage = myDocument.pages;

for(i=0; i<myParas.length; i++){

if(myParas[i].appliedParagraphStyle.name == "Main Title 1.1"){
	myParas[i].parentTextFrames[0].parentPage.appliedMaster = myDocument.masterSpreads.item("E-Empty 1.1");}

if(myParas[i].appliedParagraphStyle.name == "Suggested Study 1.1"){
	myParas[i].parentTextFrames[0].parentPage.appliedMaster = myDocument.masterSpreads.item("E-Empty 1.1");}

if(myParas[i].appliedParagraphStyle.name == "Cover Page 1.1"){
	myParas[i].parentTextFrames[0].parentPage.appliedMaster = myDocument.masterSpreads.item("E-Empty 1.1");}

if(myParas[i].appliedParagraphStyle.name == "Copyright 1.1"){
	myParas[i].parentTextFrames[0].parentPage.appliedMaster = myDocument.masterSpreads.item("E-Empty 1.1");}

if(myParas[i].appliedParagraphStyle.name == "Liberating Prayer 1.1"){
	myParas[i].parentTextFrames[0].parentPage.appliedMaster = myDocument.masterSpreads.item("N-Number 1.1");}	

}

//_____________________________________________________________________________________
//                     END Apply Master Page based on Paragraph Style 

//alert("Done!");

// Después de los arrays tienes que volver aplicar los script por si acaso la pagina contiene una pagina en blanco o bien una ilustracion
// También recuerda pensar si oracion liberadora necesita un master page aparte y un script
// hay que crear un group styles solo para los INDICES por que de esta manera las paginas pertenecientes al indice genral deben ser BN-Book Number
// crear un caso nuevo para cuando en los libros comienza una sadhana esta aparece solo el titulo y debe ser BE-Book Empty

/*
for(AppendixA=0;AppendixA<21;AppendixA++){
	for(AppendixB=0;AppendixB<7;AppendixB++){
	if(myParas[i].appliedParagraphStyle.name == "Book Appendix "+[AppendixA]+"."+[AppendixB]){
		myParas[i].parentTextFrames[0].parentPage.appliedMaster = myDocument.masterSpreads.item("A"+[AppendixA]+"-Appendix");}}}	
*/