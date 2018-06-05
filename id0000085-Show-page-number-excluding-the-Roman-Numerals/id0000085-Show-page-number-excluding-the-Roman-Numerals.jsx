var myDoc = app.activeDocument,       
arrayRomanNumerals = ["1"],  
I = arrayRomanNumerals.length,  i;       
app.findTextPreferences = null;     
for ( i = 0; i < I; i++) {         
    app.findTextPreferences.findWhat = arrayRomanNumerals[i];         
    myFound = myDoc.findText();       
    var J = myFound.length,  j;  
    var styleBookPageNumber = myDoc.paragraphStyleGroups.itemByName("VARIOUS").paragraphStyles.itemByName("Book Page Number");  
    for ( j = 0; j < J; j++) {     
        myFound[j].appliedCharacterStyle = myDoc.characterStyles[0];     
        if (myFound[j].appliedParagraphStyle == styleBookPageNumber) {   
            parentPage = myFound[j].parentPage;  
            RealNumberPage = parentPage && parentPage.documentOffset; 
            alert("The real first page, excluding the Roman Numerals is: " + RealNumberPage);  
        }  
        else{}}}  