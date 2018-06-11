try{
var myNewStory = app.activeDocument.stories[0];
} catch(myError){ alert("myNewStory not found. Document is empty?"); exit();}

try{
var myOldStory = app.documents[1].stories[0];
} catch(myError){ alert("myOldStory not found. Document is empty?"); exit();}

var myNewParagraphs = myNewStory.paragraphs;
var NewLen = myNewParagraphs.length;

var myOldParagraphs = myOldStory.paragraphs;
var OldLen = myNewParagraphs.length;

if(OldLen !=NewLen) {alert("There is a mismatch between the number of paragraphs"); exit(); }

var myParaStyles = [], myStyle, myText;


if(myNewParagraphs.item(0).parentStory.insertionPoints.item(-1).index == myNewParagraphs.item(-1).insertionPoints.item(-1).index){
		myNewParagraphs.item(-1).insertionPoints.item(-1).contents = "\r";
		}
    
if(myOldParagraphs.item(0).parentStory.insertionPoints.item(-1).index == myOldParagraphs.item(-1).insertionPoints.item(-1).index){
		myOldParagraphs.item(-1).insertionPoints.item(-1).contents = "\r";
		}

for(var i=0; i<NewLen; i++) {
myParaStyles.push(myOldStory.paragraphs[i].appliedParagraphStyle);
}

for(var i=0; i<NewLen; i++) {
myOldStory.paragraphs[i].contents = "\r";
myText = myNewParagraphs[i].characters.itemByRange(0, myNewParagraphs[i].characters.length-2);
myText.duplicate(LocationOptions.atBeginning, myOldStory.paragraphs[i].insertionPoints.item(0) );
}

for(var i=0; i<NewLen; i++) {
myOldStory.paragraphs[i].appliedParagraphStyle = myParaStyles[i];
}