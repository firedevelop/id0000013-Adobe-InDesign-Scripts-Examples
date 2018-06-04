/*
[None]
BO-Title Main
BO-Title Bastard Lotus
BO-Title Bastard Vajra
BO-Title Bastard Sword
BO-Title Books
BO-Copyright
BO-Liberating Prayer
BO-Numbering Header
BO-Numbering
Part 01
...
Part 07
T-Title 01
...
T-Title 21
Illustration 01
...
Illustration 37
Appendix 01
Appendix 01.01
Appendix 01.02
Appendix 01.03
Appendix 01.04
Appendix 01.05
Appendix 01.06
Appendix 01.07
...
Appendix 21
------- BOOKLET ----------
BT-Title Bastard
BT-Copyright
BT-Numbering
BT-Liberating Prayer
BT-Illustration 01
...
BT-Illustration 21

top-01
top-02
middle
button-01
button-02
*/
/*******************************************************************/
/******* START Reset all pages with the Master Page Default *******/
var myDialog = app.dialogs.add({name:"Master Page Based in Paragraph Styles"});
//Add a dialog column.
with(myDialog.dialogColumns.add()){
staticTexts.add({staticLabel:"Click OK if your are design a Book"});
}
//Show the dialog box.
var myResult = myDialog.show();
//If the user clicked OK, display one message;
//if they clicked Cancel, display a different message.
if(myResult == true){
	// reset everything to Master Page Book Default
	function MasterPageBookDefault() {
		var curDoc = app.activeDocument;
		curDoc.pages.everyItem().appliedMaster = curDoc.masterSpreads.itemByName("01-Numbering Header");   
		var allParas = curDoc.stories.everyItem().paragraphs.everyItem().getElements();  
		}MasterPageBookDefault();
}
else{
	// reset everything to Master Page Booklet Default
	function MasterPageBookletDefault() {
		var curDoc = app.activeDocument;
		curDoc.pages.everyItem().appliedMaster = curDoc.masterSpreads.itemByName("02-Numbering");   
		var allParas = curDoc.stories.everyItem().paragraphs.everyItem().getElements();  
		}MasterPageBookletDefault();
}
//Remove the dialog box from memory.
myDialog.destroy();
/******* END Reset all pages with the Master Page Default *******/
/*******************************************************************/


/*******************************************************************/
/******* START Applies the [None] master page to pages with no text or other objects *******/
// (c) Harbs www.in-tools.com
var appVersion = parseFloat(app.version);
if(appVersion<6){main();}
else{app.doScript (main,undefined,undefined,UndoModes.FAST_ENTIRE_SCRIPT,"Apply None Master to Empty Pages")}

function main(){
	var d=app.dialogs.add({name:"Define Empty Pages"});
	var radioBtns = d.dialogColumns.add().radiobuttonGroups.add();
	radioBtns.radiobuttonControls.add({staticLabel:"No Text",checkedState:true});
	radioBtns.radiobuttonControls.add({staticLabel:"No Objects"});
	if(!d.show()){d.destroy();return}
	var emptyOption = radioBtns.selectedButton;
	d.destroy();
	var pages = app.documents[0].pages.everyItem().getElements();
	for(var i=0;i<pages.length;i++){
		var changeMaster = true;
		if(pages[i].pageItems.length>0){
	 		var items = pages[i].pageItems.everyItem().getElements();
	 		if(emptyOption==0){
	 			if(items.length>0){changeMaster=false}
	 		} else {
				for(var j=0;j<items.length;j++){
					if(!(items[j] instanceof TextFrame)){changeMaster=false;break}
					if(items[j].contents!=""){changeMaster=false;break}
				}
			}
		}
		if(changeMaster){pages[i].appliedMaster=null;}
	}
}
/******* END Applies the [None] master page to pages with no text or other objects *******/
/*******************************************************************/




/*******************************************************************/
/******* START Apply Master Page based on Paragraph Style *******/
var myDocument = app.activeDocument;
var myParas = myDocument.stories.everyItem().paragraphs.everyItem().getElements();
var myPage = myDocument.pages;
for(i=0; i<myParas.length; i++)
{
if(myParas[i].appliedParagraphStyle.name == "Book Title Main"){
myParas[i].parentTextFrames[0].parentPage.appliedMaster = myDocument.masterSpreads.item("[None]");}
if(myParas[i].appliedParagraphStyle.name == "Title B"){
myParas[i].parentTextFrames[0].parentPage.appliedMaster = myDocument.masterSpreads.item("A-Apendix 2");}
if(myParas[i].appliedParagraphStyle.name == "Title C"){
myParas[i].parentTextFrames[0].parentPage.appliedMaster = myDocument.masterSpreads.item("A-Apendix 3");}
}
/******* END Apply Master Page based on Paragraph Style *******/
/*******************************************************************/

alert("Done!");
