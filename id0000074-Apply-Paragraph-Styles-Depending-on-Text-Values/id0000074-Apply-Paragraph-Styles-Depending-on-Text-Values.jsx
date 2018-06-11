// The Script apply paragraph styles based in the text options. For example if your text are in bold, the script will apply the Paragraph Quotation Bold.
// It is a easy way to typeset long documents with your custom styles.
// Files to download: https://github.com/firedevelop/id0000013-Adobe-InDesign-Scripts-Examples/tree/master/id0000074-Apply-Paragraph-Styles-Depending-on-Text-Values
// Thanks to the author: Loic.Aigon from Adobe Forums
//MAIN FUNCTION          
var main = function() {            
    //VARS          
    var doc = app.properties.activeDocument,          
    fgp = app.findGrepPreferences.properties,          
    texts = [], n = 0, nthText, myParaStyle,        
    texts2 = [], n = 0, nthText2, myParaStyle2,  
    texts3 = [], n = 0, nthText3, myParaStyle3,  
    texts4 = [], n = 0, nthText4, myParaStyle4, 
    paraStyleName = "Text New";   
    paraStyleName2 = "Text New 12";   
    paraStyleName3 = "Quotation New Bold";    
    paraStyleName4 = "Quotation New Italic";
              
    //Exit if no documents open          
    if ( !doc ) {          
    alert("You need an open document" );          
    return;          
    }              
              
    //Create ParaStyle if needed. Otherwise use it      
    var paraStyle = doc.paragraphStyleGroups.itemByName("TEXT NEW").paragraphStyles.itemByName(paraStyleName);    
    myParaStyle = doc.paragraphStyles.item ( paraStyleName );          
    // if ( !myParaStyle.isValid ) myParaStyle = doc.paragraphStyles.add ( paraStyleName );          
    
    var paraStyle2 = doc.paragraphStyleGroups.itemByName("TEXT NEW").paragraphStyles.itemByName(paraStyleName2);
    myParaStyle2 = doc.paragraphStyles.item ( paraStyleName2 );          
    // if ( !myParaStyle2.isValid ) myParaStyle2 = doc.paragraphStyles.add ( paraStyleName2 );  

    var paraStyle3 = doc.paragraphStyleGroups.itemByName("QUOTATION NEW").paragraphStyles.itemByName(paraStyleName3);
    myParaStyle3 = doc.paragraphStyles.item ( paraStyleName3 );          
    // if ( !myParaStyle3.isValid ) myParaStyle3 = doc.paragraphStyles.add ( paraStyleName3 );  

    var paraStyle4 = doc.paragraphStyleGroups.itemByName("QUOTATION NEW").paragraphStyles.itemByName(paraStyleName4);
    myParaStyle4 = doc.paragraphStyles.item ( paraStyleName4 );          
    // if ( !myParaStyle4.isValid ) myParaStyle4 = doc.paragraphStyles.add ( paraStyleName4 ); 
              
    //Setting grep find preferences          
    app.findGrepPreferences = null;        
    app.findGrepPreferences.properties = {          
    findWhat:".+",          
    }          
              
    //Finding texts with static properties          
    texts = doc.findGrep();          
    n = texts.length;          
          
    //Looping through found texts to inspect further properties with values ranges.          
    while ( n--  ) {nthText = texts[n];             
        // this is a example if you use false hyphenation:  !nthText.hyphenation       
        if (nthText.fontStyle =="Roman" && nthText.pointSize <= 10.5 ){nthText.appliedParagraphStyle = paraStyle;} 
        if (nthText.pointSize == 12){nthText.appliedParagraphStyle = paraStyle2;} 
        if (nthText.fontStyle == "Bold"){nthText.appliedParagraphStyle = paraStyle3;} 
        if (nthText.fontStyle == "Italic") {nthText.appliedParagraphStyle = paraStyle4;}   
    }      
              
    //reverting UI values in the F/C panel          
    app.findGrepPreferences.properties = fgp;          
    }          
    var u;                 
    app.doScript ( "main()",u,u,UndoModes.ENTIRE_SCRIPT, "The Script" );  