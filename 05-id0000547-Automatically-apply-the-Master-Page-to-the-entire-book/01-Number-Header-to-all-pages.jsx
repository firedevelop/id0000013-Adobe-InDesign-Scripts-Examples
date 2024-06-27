//_____________________________________________________________________________________
//            START Reset all pages with the Master Page Default 
// Apply the default Master Page to all pages.
var myDialog = app.dialogs.add({name:"Master Page Based in Paragraph Styles"});
//Add a dialog column.
////// with(myDialog.dialogColumns.add()){
////// staticTexts.add({staticLabel:"Click OK if you are design a Book, select Cancel if you are design a Booklet"});
////// }
//Show the dialog box.
////// var myResult = myDialog.show();
var myResult = true;
//If the user clicked OK, display one message;
//if they clicked Cancel, display a different message.
if(myResult == true){
	// reset everything to Master Page Book Default
	function MasterPageBookDefault() {
		var curDoc = app.activeDocument;
		curDoc.pages.everyItem().appliedMaster = curDoc.masterSpreads.itemByName("NH-Number Header 1.1");   
		var allParas = curDoc.stories.everyItem().paragraphs.everyItem().getElements();  
		}MasterPageBookDefault();
}
else{
	alert("ERROR: I try to apply a default MasterPage in all document, but I can not do because the MasterPage defined in the script do not exist.")
}

//Remove the dialog box from memory.
myDialog.destroy();



//                   END Reset all pages with the Master Page Default 
//_____________________________________________________________________________________