replaceTextUsingGREP ("%%%?.+","");

function replaceTextUsingGREP (input, output) { 
    app.findGrepPreferences = app.changeGrepPreferences = NothingEnum.nothing; 
    app.findGrepPreferences.findWhat = input;
    app.changeGrepPreferences.changeTo = output;
    var changedResults = app.activeDocument.changeGrep();
    app.findGrepPreferences = app.changeGrepPreferences = NothingEnum.nothing; 
}
