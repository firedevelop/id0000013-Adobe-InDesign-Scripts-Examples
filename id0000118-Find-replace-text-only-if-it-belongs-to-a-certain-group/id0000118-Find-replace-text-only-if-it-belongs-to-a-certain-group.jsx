app.scriptPreferences.userInteractionLevel = UserInteractionLevels.interactWithAll;
if(app.documents.length == 0){
alert("No documents are open. Please open a document and try again.");
exit();
}
var myParaStyleList = myGetParagraphStyleNames();
myDialog = new Window('dialog', 'Input Parameters');
myDialog.orientation = "column";
myDialog.alignChildren = ['fill', 'fill'];
myPStyle = myDialog.add ("dropdownlist", undefined, myParaStyleList);
myPStyle.title = "Select Style for Find";
myPStyle.selection=0;

myGroup = myDialog.add( "group" );
myGroup.orientation = 'row';
myGroup.okButton = myGroup.add( "button", undefined, "OK" );
myGroup.cancelButton = myGroup.add( "button", undefined, "Cancel" );
myGroup.cancelButton.onClick = function() { myDialog = this.window.close( 0 ); }
myGroup.okButton.onClick = function()
{
myParaStyleName=myPStyle.selection.text;
myDialog= this.window.close( 1 );
}
if (myDialog.show()==1) {

alert("Selected Paragraph Style "+myParaStyleName);
myStyleAsObj = getParagraphStyleByName(myParaStyleName);
replaceTextUsingGREP ("human00","human");
replaceTextUsingGREP ("free00","free");

}

/* FUNCTIONS */
function myGetParagraphStyleNames()
{
var result = [];
var myParagraphStyles = app.activeDocument.allParagraphStyles;
var myParagraphStyleName, obj;
for(var i=0; i < myParagraphStyles.length ; i++)
{
myParagraphStyleName = myParagraphStyles[i].name;
obj = myParagraphStyles[i];
while(obj.parent instanceof ParagraphStyleGroup)
{
myParagraphStyleName = obj.parent.name + ":" + myParagraphStyleName;
obj = obj.parent;
}
result.push(myParagraphStyleName);
} // for
result.shift(); // delete "No Paragraph Style"
return result;
} // fnc

function getParagraphStyleByName(myStyleName)
{
var myParagraphStyles = app.activeDocument.allParagraphStyles;
var myParagraphStyleName, obj;
for(var i=0; i < myParagraphStyles.length ; i++)
{
myParagraphStyleName = myParagraphStyles[i].name;
obj = myParagraphStyles[i];
while(obj.parent instanceof ParagraphStyleGroup)
{
myParagraphStyleName = obj.parent.name + ":" + myParagraphStyleName;
obj = obj.parent;
}
if(myParagraphStyleName == myStyleName) return myParagraphStyles[i];
} // for

} // fnc

function replaceTextUsingGREP (input, output) {
app.findGrepPreferences = app.changeGrepPreferences = NothingEnum.nothing;
app.findGrepPreferences.findWhat = input;
app.changeGrepPreferences.changeTo = output;
app.findGrepPreferences.appliedParagraphStyle = myStyleAsObj;
app.activeDocument.changeGrep();
//var changedResults = app.activeDocument.changeGrep();
app.findGrepPreferences = app.changeGrepPreferences = NothingEnum.nothing;
}