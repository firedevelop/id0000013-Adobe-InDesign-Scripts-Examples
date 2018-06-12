replaceTextUsingFIND ("Article 1.", "Article ONE");     
replaceTextUsingFIND ("Article 2.", "Article TWO");   
replaceTextUsingFIND ("Article 3.", "Article THREE");   
replaceTextUsingFIND ("Article 4.", "Article FOUR");  

function replaceTextUsingFIND (input, output)    
{    
    app.findTextPreferences = app.changeTextPreferences = NothingEnum.nothing;    
    app.findTextPreferences.findWhat = input;    
    app.changeTextPreferences.changeTo = output;    
    var changedResults = app.activeDocument.changeText();    
    app.findTextPreferences = app.changeTextPreferences = NothingEnum.nothing;     

    if ( changedResults.length === 0)  { 
        alert ( "No results for " + input);
    }  
}