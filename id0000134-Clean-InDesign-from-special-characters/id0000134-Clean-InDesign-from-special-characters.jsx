// Carefull if you change the order of the actual secuences replaceTextUsingGREP, you can get errors in the text.

replaceTextUsingGREP ("\~y","\\s");           // delete all "tab"

replaceTextUsingGREP ("\~P","\\r");           // delete all "Page Break"

replaceTextUsingGREP ("\~a","");           // delete all "Anchored Object Marker"

replaceTextUsingGREP ("\~-","");           // delete all "Discretionary Hypen"

replaceTextUsingGREP ("(\\S)(\~m)","$1\\s");          // add space to any "Em Space" without it.
replaceTextUsingGREP ("\~m\\s","\\s\~m"); 
replaceTextUsingGREP ("\~m","");            

replaceTextUsingGREP ("(\\S)\n","$1\\s");      // add space to any Force Line Break without it.
replaceTextUsingGREP ("\\n\\s","\\s\\n");    // change the sintaxis:  Force Line Break + Space ---> Space + Force Line Break
replaceTextUsingGREP ("\\n","");            // delete all Force Line Break

replaceTextUsingGREP ("\\s+?$","");         // change the sintaxis: one or more spaces + End Paragraph ---> End Paragraph
replaceTextUsingGREP ("\\s\\s+?","\\s");   // delete more than one white space
replaceTextUsingGREP ("\^\\r","");        // delete empty paragraphs



function replaceTextUsingGREP (input, output) { 
    app.findGrepPreferences = app.changeGrepPreferences = NothingEnum.nothing; 
    app.findGrepPreferences.findWhat = input;
    app.changeGrepPreferences.changeTo = output;
    var changedResults = app.activeDocument.changeGrep();
    app.findGrepPreferences = app.changeGrepPreferences = NothingEnum.nothing; 
}
