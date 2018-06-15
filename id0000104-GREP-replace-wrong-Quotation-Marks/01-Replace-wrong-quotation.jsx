replaceTextUsingGREP ("(´)(\\w)","‘$2"); 
replaceTextUsingGREP ("(\\w)(´)","$1’"); 
 
function replaceTextUsingGREP (input, output)  
{  
    app.findGrepPreferences = app.changeGrepPreferences = NothingEnum.nothing;  
    app.findGrepPreferences.findWhat = input; 
    app.changeGrepPreferences.changeTo = output; 
    app.activeDocument.changeGrep();  
    app.findGrepPreferences = app.changeGrepPreferences = NothingEnum.nothing;  
}