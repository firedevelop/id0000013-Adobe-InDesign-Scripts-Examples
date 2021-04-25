
    
//_____________________________________________________________________________________
//		 COUNT ALL PARAGRAPH STYLES IN A PARAGRAPH STYLES GROUP WITH THE SAME NAME             

var Doc = app.documents[0];
var paragraphStyle1 = [];
var paragraphStyle2 = [];   
var paragraphStyle3 = []; 
var paragraphStyle4 = []; 
var counter = 0;     
var paragraphStyleGroup1 = Doc.paragraphStyleGroups.itemByName("INDEX");  
while(counter < paragraphStyleGroup1.paragraphStyles.length){      
    if(paragraphStyleGroup1.paragraphStyles[counter].name.toString().indexOf("Index Level 01 Roman Tracking-") != -1){    
        paragraphStyle1.push(paragraphStyleGroup1.paragraphStyles[counter]);} 
    if(paragraphStyleGroup1.paragraphStyles[counter].name.toString().indexOf("Index Level 02 Roman Tracking-") != -1){    
        paragraphStyle2.push(paragraphStyleGroup1.paragraphStyles[counter]);}
    if(paragraphStyleGroup1.paragraphStyles[counter].name.toString().indexOf("Index Level 03 Roman Tracking-") != -1){    
        paragraphStyle3.push(paragraphStyleGroup1.paragraphStyles[counter]);}
    if(paragraphStyleGroup1.paragraphStyles[counter].name.toString().indexOf("Index Level 04 Roman Tracking-") != -1){    
		paragraphStyle4.push(paragraphStyleGroup1.paragraphStyles[counter]);}         
  counter++;}   
  
totalParagraphStyle1=paragraphStyle1.length; 
totalParagraphStyle2=paragraphStyle2.length;  
totalParagraphStyle3=paragraphStyle3.length; 
totalParagraphStyle4=paragraphStyle4.length;
//____________________________________________________________________________________
//      END COUNT ALL PARAGRAPH STYLES IN A PARAGRAPH STYLES GROUP WITH THE SAME NAME



//_____________________________________________________________________________________
//		 APPLY PARAGRAPH OR CHARACTER STYLE ONLY IF MATCH  
var myDoc = app.activeDocument,      
myCodes = [





// these strings will have the italic character style applied
// If the string contain latin characters maybe you need to add \\, exmple: "v\èanse" instead of "véanse" 
"free",
"freedoms"
],    



C = myCodes.length,  c;      
app.findGrepPreferences = null;    
for ( c = 0; c < myCodes.length; c++) {         
    app.findGrepPreferences.findWhat = myCodes[c];         
    myFound = myDoc.findGrep();      
    var F = myFound.length,  f;

    var characterStyleItalic = app.documents[0].characterStyles.itemByName( "Italic" );
    var IndexSectionHead = myDoc.paragraphStyleGroups.itemByName("INDEX").paragraphStyles.itemByName("Index Section Head");   
    var IndexLevel01Roman = myDoc.paragraphStyleGroups.itemByName("INDEX").paragraphStyles.itemByName("Index Level 01 Roman");   
    var IndexLevel02Roman = myDoc.paragraphStyleGroups.itemByName("INDEX").paragraphStyles.itemByName("Index Level 02 Roman");   
    var IndexLevel03Roman = myDoc.paragraphStyleGroups.itemByName("INDEX").paragraphStyles.itemByName("Index Level 03 Roman");   
    var IndexLevel04Roman = myDoc.paragraphStyleGroups.itemByName("INDEX").paragraphStyles.itemByName("Index Level 04 Roman");   
     


    for ( f = 0; f < F; f++) {    
        if ((myFound[f].appliedParagraphStyle == IndexLevel01Roman ||
            myFound[f].appliedParagraphStyle == IndexLevel02Roman ||
            myFound[f].appliedParagraphStyle == IndexLevel03Roman ||
            myFound[f].appliedParagraphStyle == IndexLevel04Roman )){
            myFound[f].appliedCharacterStyle = characterStyleItalic;    // uncomment this line to use Character Style
          //myFound[f].appliedParagraphStyle = IndexSectionHead;       // uncomment this line to use Paragraph Style
        } else{}}
        

    for(i=1; i<=totalParagraphStyle1 ;i++){
        var IndexLevel01RomanTracking = myDoc.paragraphStyleGroups.itemByName("INDEX").paragraphStyles.itemByName("Index Level 01 Roman Tracking-"+i);
    for ( f = 0; f < F; f++) {    
        if (myFound[f].appliedParagraphStyle == IndexLevel01RomanTracking) { 
            myFound[f].appliedCharacterStyle = characterStyleItalic;    // uncomment this line to use Character Style
          //myFound[f].appliedParagraphStyle = IndexSectionHead;       // uncomment this line to use Paragraph Style
        } else{}}}


    
    for(i=1; i<=totalParagraphStyle2 ;i++){
        var IndexLevel02RomanTracking = myDoc.paragraphStyleGroups.itemByName("INDEX").paragraphStyles.itemByName("Index Level 02 Roman Tracking-"+i);
    for ( f = 0; f < F; f++) {    
        if (myFound[f].appliedParagraphStyle == IndexLevel02RomanTracking) { 
            myFound[f].appliedCharacterStyle = characterStyleItalic;    // uncomment this line to use Character Style
          //myFound[f].appliedParagraphStyle = IndexSectionHead;       // uncomment this line to use Paragraph Style
        } else{}}}



    for(i=1; i<=totalParagraphStyle3 ;i++){
        var IndexLevel03RomanTracking = myDoc.paragraphStyleGroups.itemByName("INDEX").paragraphStyles.itemByName("Index Level 03 Roman Tracking-"+i);
    for ( f = 0; f < F; f++) {    
        if (myFound[f].appliedParagraphStyle == IndexLevel01RomanTracking) { 
            myFound[f].appliedCharacterStyle = characterStyleItalic;    // uncomment this line to use Character Style
          //myFound[f].appliedParagraphStyle = IndexSectionHead;       // uncomment this line to use Paragraph Style       
        } else{}}}



    for(i=1; i<=totalParagraphStyle4 ;i++){
        var IndexLevel04RomanTracking = myDoc.paragraphStyleGroups.itemByName("INDEX").paragraphStyles.itemByName("Index Level 04 Roman Tracking-"+i);
    for ( f = 0; f < F; f++) {    
        if (myFound[f].appliedParagraphStyle == IndexLevel04RomanTracking) { 
            myFound[f].appliedCharacterStyle = characterStyleItalic;    // uncomment this line to use Character Style
          //myFound[f].appliedParagraphStyle = IndexSectionHead;       // uncomment this line to use Paragraph Style     
        } else{}}}

} 
//_____________________________________________________________________________________
//		 END APPLY PARAGRAPH OR CHARACTER STYLE ONLY IF MATCH  