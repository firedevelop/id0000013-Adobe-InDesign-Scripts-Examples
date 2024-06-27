// Source: https://forums.adobe.com/thread/708641
// This Script allow you to find a replace a Text using 2 syntax FIND or GREP. Becarefull, affects the text of the entire document. The sintaxis of your queries are different if you use FIND or GREP, exaclty same like when you find and replace with the indesign window.
// https://helpx.adobe.com/indesign/using/find-change.html#find_and_change_objects
// To replace with GREP a simple Index Setion Heading, for example the letter D, you can use simple this ^(D)$ but if you want extra security use this ^([D])$
/******** FIND AND REPLACE TEXT USING GREP ********/
//replaceTextUsingGREP ("^([B])$","~M$1"); // add a Break Column before letter D (Index Section Heading) 
function replaceTextUsingGREP (input, output) 
{ 
    app.findGrepPreferences = app.changeGrepPreferences = NothingEnum.nothing; 
    app.findGrepPreferences.findWhat = input;
    app.changeGrepPreferences.changeTo = output;
    app.activeDocument.changeGrep(); 
    app.findGrepPreferences = app.changeGrepPreferences = NothingEnum.nothing; 
}


/******** FIND AND REPLACE TEXT USING FIND ********/
//replaceTextUsingFIND ("camino(s)^%", "^Mcamino(s)^%"); 
//replaceTextUsingFIND ("fenómeno(s)^%\r", "^Mfenómeno(s)^%\r");  
function replaceTextUsingFIND (input, output)  
{  
     app.findTextPreferences = app.changeTextPreferences = NothingEnum.nothing;  
     app.findTextPreferences.findWhat = input;  
     app.changeTextPreferences.changeTo = output;  
     app.activeDocument.changeText();  
     app.findTextPreferences = app.changeTextPreferences = NothingEnum.nothing;   
}