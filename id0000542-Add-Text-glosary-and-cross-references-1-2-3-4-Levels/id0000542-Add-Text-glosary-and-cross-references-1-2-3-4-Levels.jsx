var myDoc = app.documents[0];

// Define the paragraph styles
var IndexLevel01Roman = myDoc.paragraphStyleGroups.itemByName("INDEX").paragraphStyles.itemByName("Index Level 01 Roman");
var IndexLevel02Roman = myDoc.paragraphStyleGroups.itemByName("INDEX").paragraphStyles.itemByName("Index Level 02 Roman");
var IndexLevel03Roman = myDoc.paragraphStyleGroups.itemByName("INDEX").paragraphStyles.itemByName("Index Level 03 Roman");
var IndexLevel04Roman = myDoc.paragraphStyleGroups.itemByName("INDEX").paragraphStyles.itemByName("Index Level 04 Roman");

// Function to replace text using GREP for a specific paragraph style
function replaceTextOnIndexLevel(paragraphStyle, findPattern, replacePattern) {
    // Clear any existing find/change preferences
    app.findGrepPreferences = null;
    app.changeGrepPreferences = null;

    // Set the GREP find pattern
    app.findGrepPreferences.findWhat = findPattern;

    // Get all found items
    var foundItems = myDoc.findGrep();

    // Loop through all found items
    for (var i = 0; i < foundItems.length; i++) {
        var foundItem = foundItems[i];
        var appliedParagraphStyle = foundItem.appliedParagraphStyle;

        // Check if the found item's paragraph style matches the specified style
        if (appliedParagraphStyle == paragraphStyle) {
            // Set the GREP change pattern
            app.changeGrepPreferences.changeTo = replacePattern;

            // Replace the found text
            foundItem.changeGrep();
        }
    }

    // Clear find/change preferences after the operation
    app.findGrepPreferences = null;
    app.changeGrepPreferences = null;
}

// Replace text using the provided GREP pattern and replace pattern for each paragraph style
replaceTextOnIndexLevel(IndexLevel01Roman, 
    "(\^action)((.+?)$)", 
    "action $2 (see also actions), g");

replaceTextOnIndexLevel(IndexLevel02Roman, 
    "(\^actor)((.+?)$)", 
    "actor $2 , g");

