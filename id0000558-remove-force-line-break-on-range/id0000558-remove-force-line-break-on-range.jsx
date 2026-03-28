#target indesign

function removeForcedLineBreaks() {
    if (app.documents.length === 0) {
        alert("Please open an InDesign document.");
        return;
    }

    var doc = app.activeDocument;

    // 1. Clear previous search preferences
    app.findTextPreferences = NothingEnum.nothing;
    app.changeTextPreferences = NothingEnum.nothing;

    // 2. Locate the START beacon
    app.findTextPreferences.findWhat = "[[START_SYNC]]";
    var startMatches = doc.findText();
    
    if (startMatches.length === 0) {
        alert("Could not find the [[START_SYNC]] beacon.");
        return;
    }

    // 3. Locate the END beacon
    app.findTextPreferences.findWhat = "[[END_SYNC]]";
    var endMatches = doc.findText();
    
    if (endMatches.length === 0) {
        alert("Could not find the [[END_SYNC]] beacon.");
        return;
    }

    var startText = startMatches[0];
    var endText = endMatches[0];
    var targetStory = startText.parentStory;

    if (targetStory !== endText.parentStory) {
        alert("Error: Beacons must be in the same threaded text flow.");
        return;
    }

    // 4. Define the exact mathematical range between beacons
    var startIndex = startText.characters.lastItem().index + 1;
    var endIndex = endText.characters.firstItem().index - 1;

    if (startIndex > endIndex) {
        alert("Error: [[END_SYNC]] appears before [[START_SYNC]] or there is no text between them.");
        return;
    }

    // Create a Text Object representing exactly the text between the beacons
    var targetRange = targetStory.characters.itemByRange(startIndex, endIndex);

    // 5. Configure the surgical Find/Change operation
    app.findTextPreferences = NothingEnum.nothing;
    app.changeTextPreferences = NothingEnum.nothing;

    // '^n' is the InDesign code for Forced Line Break (Shift+Enter)
    app.findTextPreferences.findWhat = "^n";
    
    // We replace it with a space so words don't merge together
    app.changeTextPreferences.changeTo = " ";

    // Execute the change ONLY within our target range
    var changesMade = targetRange.changeText();

    // Clean up preferences
    app.findTextPreferences = NothingEnum.nothing;
    app.changeTextPreferences = NothingEnum.nothing;

    alert("Cleanup Complete!\n\nRemoved " + changesMade.length + " forced line breaks between the beacons.");
}

app.doScript(removeForcedLineBreaks, ScriptLanguage.JAVASCRIPT, [], UndoModes.ENTIRE_SCRIPT, "Remove Forced Line Breaks");