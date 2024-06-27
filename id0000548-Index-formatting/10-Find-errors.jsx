replaceTextUsingGREP2 ("g, g");     
replaceTextUsingGREP3 ("(\^\[\\l\\u\]+? \[\\l\\u\]+?) g  \$"); 
     
    function replaceTextUsingGREP2 (input){     
        app.findGrepPreferences = app.changeGrepPreferences = NothingEnum.nothing;     
        app.findGrepPreferences.findWhat = input;       
        var foundResults = app.activeDocument.findGrep();    
        if ( foundResults.length != 0)  {     
                        for (var i=0; i < foundResults.length; i++)  
                        {      
                              var errorInfo= "ERROR: found double letter g from glosary: " + foundResults[i].contents;    
                                //alert (errorInfo); 
                                $.writeln(errorInfo);    
                            
                        }  
            }  
    }
    function replaceTextUsingGREP3 (input){     
        app.findGrepPreferences = app.changeGrepPreferences = NothingEnum.nothing;     
        app.findGrepPreferences.findWhat = input;       
        var foundResults = app.activeDocument.findGrep();    
        if ( foundResults.length != 0)  {     
                        for (var i=0; i < foundResults.length; i++)  
                        {      
                              var errorInfo= "ERROR: " + foundResults[i].contents;    
                                //alert (errorInfo); 
                                $.writeln(errorInfo);    
                            
                        }  
            }  
    }   