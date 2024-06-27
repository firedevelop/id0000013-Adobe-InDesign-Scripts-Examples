// Clear All Overrides
// Written by TAW. (c) 2014 by Bookraft Solutions, Israel (Id-Extras.com)
// Please do not delete this copyright notice.
//
var myOverrideType = OverrideType.ALL;
// var myOverrideType = OverrideType.CHARACTER_ONLY;
// var myOverrideType = OverrideType.PARAGRAPH_ONLY;
var allStories = app.activeDocument.stories.everyItem();
// Remove overrides from all stories
try{
allStories.clearOverrides(myOverrideType);
}
catch (e){
    //alert ("No stories!")
}
// Remove overrides from all footnotes
try{
allStories.footnotes.everyItem().texts.everyItem().clearOverrides(myOverrideType);
}
catch (e){
    //alert ("No footnotes!")
}
// Remove overrides from all table
try{
allStories.tables.everyItem().cells.everyItem().paragraphs.everyItem().clearOverrides(myOverrideType);
}
catch (e){
    //alert ("No tables!")
}
//alert("Overrides cleared!");