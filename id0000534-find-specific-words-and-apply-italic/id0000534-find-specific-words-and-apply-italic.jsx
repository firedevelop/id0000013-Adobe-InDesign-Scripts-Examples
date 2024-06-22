var myDoc = app.documents[0];
var characterStyleItalic = myDoc.characterStyles.itemByName("Italic");

var myWords = [
    "véase",
    "véanse",
    "véase también",
    "véanse también",
];

var paragraphStylesToCheck = [
    myDoc.paragraphStyleGroups.itemByName("INDEX").paragraphStyles.itemByName("Index Level 01 Roman"),
    myDoc.paragraphStyleGroups.itemByName("INDEX").paragraphStyles.itemByName("Index Level 02 Roman"),
    myDoc.paragraphStyleGroups.itemByName("INDEX").paragraphStyles.itemByName("Index Level 03 Roman"),
    myDoc.paragraphStyleGroups.itemByName("INDEX").paragraphStyles.itemByName("Index Level 04 Roman")
];

// Clear any existing find/change preferences
app.findGrepPreferences = null;
app.changeGrepPreferences = null;

// Function to check if a paragraph style is in the list of paragraph styles to check
function isInParagraphStylesToCheck(paragraphStyle) {
    for (var k = 0; k < paragraphStylesToCheck.length; k++) {
        if (paragraphStyle == paragraphStylesToCheck[k]) {
            return true;
        }
    }
    return false;
}

// Loop through each word and apply the italic character style
for (var i = 0; i < myWords.length; i++) {
    app.findGrepPreferences.findWhat = myWords[i];
    var foundItems = myDoc.findGrep();

    for (var j = 0; j < foundItems.length; j++) {
        var foundItem = foundItems[j];
        var appliedParagraphStyle = foundItem.appliedParagraphStyle;

        if (isInParagraphStylesToCheck(appliedParagraphStyle)) {
            foundItem.appliedCharacterStyle = characterStyleItalic;
        }
    }
}

// Clear find/change preferences after the operation
app.findGrepPreferences = null;
app.changeGrepPreferences = null;

alert("Italic character style applied to specified words where appropriate.");
