//MAIN FUNCTION    
var main = function() {    
    
    //VARS    
    var doc = app.properties.activeDocument,    
    fgp = app.findGrepPreferences.properties,    
    texts = [], n = 0, nthText, myParaStyle,    
    paraStyleName = "Text New";    
        
    //Exit if no documents open    
    if ( !doc ) {    
    alert("You need an open document" );    
    return;    
    }    
        
        
    //Create ParaStyle if needed. Otherwise use it    
    myParaStyle = doc.paragraphStyles.item ( paraStyleName );    
    if ( !myParaStyle.isValid ) myParaStyle = doc.paragraphStyles.add ( paraStyleName );    
        
    //Setting grep find preferences    
    app.findGrepPreferences = null;  
    app.findGrepPreferences.properties = {    
    allowArbitraryHyphenation:true,    
    findWhat:".+",    
    }    
        
    //Finding texts with static properties    
    texts = doc.findGrep();    
    n = texts.length;    
        
    //Looping through found texts to inspect further properties with values ranges.    
    while ( n--  ) {    
    nthText = texts[n];    
    if ( nthText.pointSize <= 10.5    
    // && nthText "other property"…    
    // && nthText "other property"…    
    // Now it's your turn to do the dirty work ;)    
    //…    
    ) {    
        
    //Applying style    
    nthText.appliedParagraphStyle = myParaStyle;    
    }    
    }    
        
        
    //reverting UI values in the F/C panel    
    app.findGrepPreferences.properties = fgp;    
    }    
        
        
    var u;    
        
        
    app.doScript ( "main()",u,u,UndoModes.ENTIRE_SCRIPT, "The Script" );    