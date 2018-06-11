var doc = app.activeDocument;
// clear find change text preferences before search
app.findTextPreferences = app.changeTextPreferences = NothingEnum.NOTHING;
// this is scripting equivalent of the 'Find What:' edit text field
app.findTextPreferences.findWhat = "Article 30.";
// search it in the active document
// you can also search it in almost everywhere: story, text frame, paragraph, line, word, etc
var finds = doc.findText();
if (finds.length > 0) { // something has been found
// for the 1st found item display the name of the page where the 1st text frame (there can be several threaded frames) containing it is located
alert("Found " + finds.length + " items, the first of them is on page " + finds[0].parentTextFrames[0].parentPage.name);
}
else { // found nothing
alert("Nothing has been found");
}
// clear find change text preferences after search
app.findTextPreferences = app.changeTextPreferences = NothingEnum.NOTHING;