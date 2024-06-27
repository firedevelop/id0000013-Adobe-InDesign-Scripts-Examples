// APPLY MASTER TO EVERY NTH PAGE
// Copyright (c) 2017 Mads Wolff
// This script is distributed under the MIT License.
// https://graphicdesign.stackexchange.com/questions/102800/how-to-apply-a-master-page-to-every-nth-page
// Github: https://github.com/firedevelop/id0000013-Adobe-InDesign-Scripts-Examples/tree/master/id0000081-Apply-Master-Page-base-on-Interval
// Github: https://github.com/firedevelop/id0000013-Adobe-InDesign-Scripts-Examples/tree/master/id0000085-Show-page-number-excluding-the-Roman-Numerals

//_____________________________________________________________________________________
//           GET THE PAGE NUMBER OR POSITION OF THE FIRST PAGE NUMBER WITH NUMBER DECIMAL AND NOT ROMAN NUMERALS 
// we do this because when we get for example the page number of the var pageNumberBookAppendix1_1, this number don't include the first pages in roman numerals.
var sections = app.documents[0].sections.everyItem().getElements();   
for( var n=0;n<sections.length;n++ )  
{  
var firstPageInSection = sections[n].pageStart;  
var firstPageOfSectionPositionInDocument = firstPageInSection.documentOffset;  
//var firstPageName = firstPageInSection.name;  

//var pageNumberStyle = sections[n].pageNumberStyle;  

$.writeln( n +"\t"+firstPageOfSectionPositionInDocument );
//$.writeln( n +"\t"+firstPageName );    
//$.writeln( n +"\t"+pageNumberStyle.toString() ); 
if (firstPageOfSectionPositionInDocument != 0){ //  exclude the first section.
    FirstNumberPageDecimal = firstPageOfSectionPositionInDocument;
} else{};
} 

//_____________________________________________________________________________________
//           END GET THE PAGE NUMBER OR POSITION OF THE FIRST PAGE NUMBER WITH NUMBER DECIMAL AND NOT ROMAN NUMERALS 







//_____________________________________________________________________________________
//                      APPLY MASTER PAGE TO APPENDIX RANGE PAGES 
// this script apply the Appendix Master Page, to the range pages specific for each appendix. For example the range pages between the Appendix 1 and Appendix 2, will be applied the Master Page A-Appendix 1, etc...  After run this script we will apply other script only for the Appendix titles.
// to get the first decimal number of the book, we use the script above. 
// Make a reference to the "pages" of the active document.
var pages = app.activeDocument.pages;

// Make a reference to the "masterSpreads" of the active document.
var masterSpreads = app.activeDocument.masterSpreads;

// Applies a master to every nth page starting at a certain page.
// Takes 3 arguments:
//   masterName   the name of the master spread
//   firstPage    the first page to apply the master to
//   interval     the interval (n) to apply the master at
function applyMasterToEveryNthPage(masterName, firstPage, interval) {

  // Make a reference to the "masterSpread" to apply.
  var masterSpread = masterSpreads.item(masterName);

  // Iterate through the "pages" at the chosen "interval", starting at the chosen "firstPage".
  for (var i = firstPage - 1; i < pages.length; i += interval) {

    // Make a reference to the "page".
    var page = pages.item(i);

    // Apply the "masterSpread" to the "page" by setting its "appliedMaster" attribute.
    page.appliedMaster = masterSpread;

  }

}

// Stores all the names of the document's master spreads in an array.
function getMasterSpreadNames() {
    var masterSpreadNames = new Array;
    for(i = 0; i < masterSpreads.length; i++){
        masterSpreadNames.push(masterSpreads.item(i).name);
    }
    return masterSpreadNames;
}

//_____________________________________________________________________________________
//                        END APPLY MASTER PAGE TO APPENDIX RANGE PAGES








//___________________________________________________________________________________________________________
//		 COUNT ALL PARAGRAPH STYLES IN A PARAGRAPH STYLES GROUP WITH THE SAME NAME IN A BIDIMENSIONAL ARRAY   
// we use this script to know how many Appendix paragraph styles. We only go to use the number of the first dimension, for example if we have Appendix 1.1, Appendix 2.1, Appendix 3.1, we have 3 Appendix. And we need for the script below.

var myName = "APPENDIX"
var myArr =[];
var myParaStyleList = myGetParagraphStyleNames();
for (var i=0; i< myParaStyleList.length; i++)
{
    if(myParaStyleList[i].indexOf(myName) !=-1)
    {
        myArr.push(myParaStyleList[i]);
    }
}
// alert(myArr.length); // TOTAL OF PARAGRAPH STYLES
var myArr1=[], myArr2 = [];
for(var i =0; i< myArr.length; i++)
{
    myArr1[i]=myArr[i].split(".")[0];
}
for(var i =0; i< myArr.length; i++)
{
    myArr2[i]=myArr[i].split(".")[1];
}
myArr3= Unique(myArr1);
// alert(myArr3.length);   // TOTAL OF FIRST DIMENSION

myArr4 = Unique(myArr2);
// alert(myArr4.length);   // TOTAL OF SECOND DIMENSION


function myGetParagraphStyleNames()
{
var result = [];    
var myParagraphStyles = app.activeDocument.allParagraphStyles;
var myParagraphStyleName, obj;
for(var i=0; i < myParagraphStyles.length ; i++)
{
    myParagraphStyleName = myParagraphStyles[i].name;
    obj = myParagraphStyles[i];
    while(obj.parent instanceof ParagraphStyleGroup)
    {
        myParagraphStyleName = obj.parent.name + ":" + myParagraphStyleName;
        obj = obj.parent;        
    }
    result.push(myParagraphStyleName);
 } // for
result.shift(); // удаление стиля No Paragraph Style
return result;
} // fnc

function Unique(A)
{
    var n = A.length, k = 0, B = [];
    for (var i = 0; i < n; i++) 
     { var j = 0;
       while (j < k && B[j] !== A[i]) j++;
       if (j == k) B[k++] = A[i];
     }
    return B;
}

//_______________________________________________________________________________________________________________
//      END COUNT ALL PARAGRAPH STYLES IN A PARAGRAPH STYLES GROUP WITH THE SAME NAME IN A BIDIMENSIONAL ARRAY








//_____________________________________________________________________________________
//                        GET THE NUMBER PAGE OF PARAGRAPH STYLE APPLIED

var myDoc = app.activeDocument; 
var myArr3Length = myArr3.length;
//alert (myArr3Length);
myArr3Length++;
app.findTextPreferences = app.changeTextPreferences = null; 
for(z=1;z<myArr3Length;z++){
 
    var Book_Appendix_1_1 = myDoc.paragraphStyleGroups.itemByName("APPENDIX").paragraphStyles.itemByName("Appendix " + [z] + ".1"); 
    $.writeln( n +"\t" + "working on Appendix " + [z] + ".1" );
    app.findTextPreferences.appliedParagraphStyle = Book_Appendix_1_1;
     
    var finds = myDoc.findText();
    if (finds.length > 0) { 
        var pageNumberBookAppendix_1_1=finds[0].parentTextFrames[0].parentPage.name;
    } 
//_____________________________________________________________________________________
//                        END GET THE NUMBER PAGE OF PARAGRAPH STYLE APPLIED 
    $.writeln( n +"\t" + "Master page " + [z] + ".1" );
    var masterName = "A-Appendix " + [z] + ".1";
    var pageNumberExcludingRomanNumbers = parseInt(pageNumberBookAppendix_1_1)+FirstNumberPageDecimal; // we convert the String number pages and add the number of Number Roman pages.
    var firstPage = pageNumberExcludingRomanNumbers;
    var interval = 1;
    $.writeln( n +"\t" + "\nmasterName: " + masterName + "\nfirstPage: " + firstPage + "\ninterval: " + interval );
    applyMasterToEveryNthPage(masterName, firstPage, interval);
    
}








/*
//                    GET THE NUMBER PAGE OF PARAGRAPH STYLE APPLIED 
    var myDoc = app.activeDocument;  
    app.findTextPreferences = app.changeTextPreferences = null;  
    var Book_Appendix_1_1 = myDoc.paragraphStyleGroups.itemByName("APPENDIX").paragraphStyles.itemByName("Appendix 1.1"); 
    app.findTextPreferences.appliedParagraphStyle = Book_Appendix_1_1; 
    var finds = myDoc.findText();
    if (finds.length > 0) { 
        var pageNumberBookAppendix_1_1=finds[0].parentTextFrames[0].parentPage.name;
    } 
//                    END GET THE NUMBER PAGE OF PARAGRAPH STYLE APPLIED 

var masterName = "A-Appendix 1.1";
var pageNumberExcludingRomanNumbers = parseInt(pageNumberBookAppendix_1_1)+FirstNumberPageDecimal; // we convert the String number pages and add the number of Number Roman pages.
var firstPage = pageNumberExcludingRomanNumbers;
var interval = 1;
applyMasterToEveryNthPage(masterName, firstPage, interval);










//                    GET THE NUMBER PAGE OF PARAGRAPH STYLE APPLIED 
    var myDoc = app.activeDocument;  
    app.findTextPreferences = app.changeTextPreferences = null;  
    var Book_Appendix_2_1 = myDoc.paragraphStyleGroups.itemByName("APPENDIX").paragraphStyles.itemByName("Appendix 2.1"); 
    app.findTextPreferences.appliedParagraphStyle = Book_Appendix_2_1; 
    var finds = myDoc.findText();
    if (finds.length > 0) { 
        var pageNumberBookAppendix_2_1=finds[0].parentTextFrames[0].parentPage.name;
    } 
//                    END GET THE NUMBER PAGE OF PARAGRAPH STYLE APPLIED 

var masterName = "A-Appendix 2.1";
var pageNumberExcludingRomanNumbers = parseInt(pageNumberBookAppendix_2_1)+FirstNumberPageDecimal; // we convert the String number pages and add the number of Number Roman pages.
var firstPage = pageNumberExcludingRomanNumbers;
var interval = 1;
applyMasterToEveryNthPage(masterName, firstPage, interval);









//                    GET THE NUMBER PAGE OF PARAGRAPH STYLE APPLIED 
    var myDoc = app.activeDocument;  
    app.findTextPreferences = app.changeTextPreferences = null;  
    var Book_Appendix_3_1 = myDoc.paragraphStyleGroups.itemByName("APPENDIX").paragraphStyles.itemByName("Appendix 3.1"); 
    app.findTextPreferences.appliedParagraphStyle = Book_Appendix_3_1; 
    var finds = myDoc.findText();
    if (finds.length > 0) { 
        var pageNumberBookAppendix_3_1=finds[0].parentTextFrames[0].parentPage.name;
    } 
//                    END GET THE NUMBER PAGE OF PARAGRAPH STYLE APPLIED 

var masterName = "A-Appendix 3.1";
var pageNumberExcludingRomanNumbers = parseInt(pageNumberBookAppendix_3_1)+FirstNumberPageDecimal; // we convert the String number pages and add the number of Number Roman pages.
var firstPage = pageNumberExcludingRomanNumbers;
var interval = 1;
applyMasterToEveryNthPage(masterName, firstPage, interval);










//                    GET THE NUMBER PAGE OF PARAGRAPH STYLE APPLIED 
    var myDoc = app.activeDocument;  
    app.findTextPreferences = app.changeTextPreferences = null;  
    var Book_Appendix_4_1 = myDoc.paragraphStyleGroups.itemByName("APPENDIX").paragraphStyles.itemByName("Appendix 4.1"); 
    app.findTextPreferences.appliedParagraphStyle = Book_Appendix_4_1; 
    var finds = myDoc.findText();
    if (finds.length > 0) { 
        var pageNumberBookAppendix_4_1=finds[0].parentTextFrames[0].parentPage.name;
    } 
//                    END GET THE NUMBER PAGE OF PARAGRAPH STYLE APPLIED 

var masterName = "A-Appendix 4.1";
var pageNumberExcludingRomanNumbers = parseInt(pageNumberBookAppendix_4_1)+FirstNumberPageDecimal; // we convert the String number pages and add the number of Number Roman pages.
var firstPage = pageNumberExcludingRomanNumbers;
var interval = 1;
applyMasterToEveryNthPage(masterName, firstPage, interval);









//                    GET THE NUMBER PAGE OF PARAGRAPH STYLE APPLIED 
    var myDoc = app.activeDocument;  
    app.findTextPreferences = app.changeTextPreferences = null;  
    var Book_Appendix_5_1 = myDoc.paragraphStyleGroups.itemByName("APPENDIX").paragraphStyles.itemByName("Appendix 5.1"); 
    app.findTextPreferences.appliedParagraphStyle = Book_Appendix_5_1; 
    var finds = myDoc.findText();
    if (finds.length > 0) { 
        var pageNumberBookAppendix_5_1=finds[0].parentTextFrames[0].parentPage.name;
    } 
//                    END GET THE NUMBER PAGE OF PARAGRAPH STYLE APPLIED 

var masterName = "A-Appendix 5.1";
var pageNumberExcludingRomanNumbers = parseInt(pageNumberBookAppendix_5_1)+FirstNumberPageDecimal; // we convert the String number pages and add the number of Number Roman pages.
var firstPage = pageNumberExcludingRomanNumbers;
var interval = 1;
applyMasterToEveryNthPage(masterName, firstPage, interval);









//                    GET THE NUMBER PAGE OF PARAGRAPH STYLE APPLIED 
    var myDoc = app.activeDocument;  
    app.findTextPreferences = app.changeTextPreferences = null;  
    var Book_Appendix_6_1 = myDoc.paragraphStyleGroups.itemByName("APPENDIX").paragraphStyles.itemByName("Appendix 6.1"); 
    app.findTextPreferences.appliedParagraphStyle = Book_Appendix_6_1; 
    var finds = myDoc.findText();
    if (finds.length > 0) { 
        var pageNumberBookAppendix_6_1=finds[0].parentTextFrames[0].parentPage.name;
    } 
//                    END GET THE NUMBER PAGE OF PARAGRAPH STYLE APPLIED 

var masterName = "A-Appendix 6.1";
var pageNumberExcludingRomanNumbers = parseInt(pageNumberBookAppendix_6_1)+FirstNumberPageDecimal; // we convert the String number pages and add the number of Number Roman pages.
var firstPage = pageNumberExcludingRomanNumbers;
var interval = 1;
applyMasterToEveryNthPage(masterName, firstPage, interval);









//                    GET THE NUMBER PAGE OF PARAGRAPH STYLE APPLIED 
    var myDoc = app.activeDocument;  
    app.findTextPreferences = app.changeTextPreferences = null;  
    var Book_Appendix_7_1 = myDoc.paragraphStyleGroups.itemByName("APPENDIX").paragraphStyles.itemByName("Appendix 7.1"); 
    app.findTextPreferences.appliedParagraphStyle = Book_Appendix_7_1; 
    var finds = myDoc.findText();
    if (finds.length > 0) { 
        var pageNumberBookAppendix_7_1=finds[0].parentTextFrames[0].parentPage.name;
    } 
//                    END GET THE NUMBER PAGE OF PARAGRAPH STYLE APPLIED 

var masterName = "A-Appendix 7.1";
var pageNumberExcludingRomanNumbers = parseInt(pageNumberBookAppendix_7_1)+FirstNumberPageDecimal; // we convert the String number pages and add the number of Number Roman pages.
var firstPage = pageNumberExcludingRomanNumbers;
var interval = 1;
applyMasterToEveryNthPage(masterName, firstPage, interval);









//                    GET THE NUMBER PAGE OF PARAGRAPH STYLE APPLIED 
    var myDoc = app.activeDocument;  
    app.findTextPreferences = app.changeTextPreferences = null;  
    var Book_Appendix_8_1 = myDoc.paragraphStyleGroups.itemByName("APPENDIX").paragraphStyles.itemByName("Appendix 8.1"); 
    app.findTextPreferences.appliedParagraphStyle = Book_Appendix_8_1; 
    var finds = myDoc.findText();
    if (finds.length > 0) { 
        var pageNumberBookAppendix_8_1=finds[0].parentTextFrames[0].parentPage.name;
    } 
//                    END GET THE NUMBER PAGE OF PARAGRAPH STYLE APPLIED 

var masterName = "A-Appendix 8.1";
var pageNumberExcludingRomanNumbers = parseInt(pageNumberBookAppendix_8_1)+FirstNumberPageDecimal; // we convert the String number pages and add the number of Number Roman pages.
var firstPage = pageNumberExcludingRomanNumbers;
var interval = 1;
applyMasterToEveryNthPage(masterName, firstPage, interval);









//                    GET THE NUMBER PAGE OF PARAGRAPH STYLE APPLIED 
    var myDoc = app.activeDocument;  
    app.findTextPreferences = app.changeTextPreferences = null;  
    var Book_Appendix_9_1 = myDoc.paragraphStyleGroups.itemByName("APPENDIX").paragraphStyles.itemByName("Appendix 9.1"); 
    app.findTextPreferences.appliedParagraphStyle = Book_Appendix_9_1; 
    var finds = myDoc.findText();
    if (finds.length > 0) { 
        var pageNumberBookAppendix_9_1=finds[0].parentTextFrames[0].parentPage.name;
    } 
//                    END GET THE NUMBER PAGE OF PARAGRAPH STYLE APPLIED 

var masterName = "A-Appendix 9.1";
var pageNumberExcludingRomanNumbers = parseInt(pageNumberBookAppendix_9_1)+FirstNumberPageDecimal; // we convert the String number pages and add the number of Number Roman pages.
var firstPage = pageNumberExcludingRomanNumbers;
var interval = 1;
applyMasterToEveryNthPage(masterName, firstPage, interval);









//                    GET THE NUMBER PAGE OF PARAGRAPH STYLE APPLIED 
    var myDoc = app.activeDocument;  
    app.findTextPreferences = app.changeTextPreferences = null;  
    var Book_Appendix_10_1 = myDoc.paragraphStyleGroups.itemByName("APPENDIX").paragraphStyles.itemByName("Appendix 10.1"); 
    app.findTextPreferences.appliedParagraphStyle = Book_Appendix_10_1; 
    var finds = myDoc.findText();
    if (finds.length > 0) { 
        var pageNumberBookAppendix_10_1=finds[0].parentTextFrames[0].parentPage.name;
    } 
//                    END GET THE NUMBER PAGE OF PARAGRAPH STYLE APPLIED 

var masterName = "A-Appendix 10.1";
var pageNumberExcludingRomanNumbers = parseInt(pageNumberBookAppendix_10_1)+FirstNumberPageDecimal; // we convert the String number pages and add the number of Number Roman pages.
var firstPage = pageNumberExcludingRomanNumbers;
var interval = 1;
applyMasterToEveryNthPage(masterName, firstPage, interval);









//                    GET THE NUMBER PAGE OF PARAGRAPH STYLE APPLIED 
    var myDoc = app.activeDocument;  
    app.findTextPreferences = app.changeTextPreferences = null;  
    var Book_Appendix_11_1 = myDoc.paragraphStyleGroups.itemByName("APPENDIX").paragraphStyles.itemByName("Appendix 11.1"); 
    app.findTextPreferences.appliedParagraphStyle = Book_Appendix_11_1; 
    var finds = myDoc.findText();
    if (finds.length > 0) { 
        var pageNumberBookAppendix_11_1=finds[0].parentTextFrames[0].parentPage.name;
    } 
//                    END GET THE NUMBER PAGE OF PARAGRAPH STYLE APPLIED 

var masterName = "A-Appendix 11.1";
var pageNumberExcludingRomanNumbers = parseInt(pageNumberBookAppendix_11_1)+FirstNumberPageDecimal; // we convert the String number pages and add the number of Number Roman pages.
var firstPage = pageNumberExcludingRomanNumbers;
var interval = 1;
applyMasterToEveryNthPage(masterName, firstPage, interval);









//                    GET THE NUMBER PAGE OF PARAGRAPH STYLE APPLIED 
    var myDoc = app.activeDocument;  
    app.findTextPreferences = app.changeTextPreferences = null;  
    var Book_Appendix_12_1 = myDoc.paragraphStyleGroups.itemByName("APPENDIX").paragraphStyles.itemByName("Appendix 12.1"); 
    app.findTextPreferences.appliedParagraphStyle = Book_Appendix_12_1; 
    var finds = myDoc.findText();
    if (finds.length > 0) { 
        var pageNumberBookAppendix_12_1=finds[0].parentTextFrames[0].parentPage.name;
    } 
//                    END GET THE NUMBER PAGE OF PARAGRAPH STYLE APPLIED 

var masterName = "A-Appendix 12.1";
var pageNumberExcludingRomanNumbers = parseInt(pageNumberBookAppendix_12_1)+FirstNumberPageDecimal; // we convert the String number pages and add the number of Number Roman pages.
var firstPage = pageNumberExcludingRomanNumbers;
var interval = 1;
applyMasterToEveryNthPage(masterName, firstPage, interval);









//                    GET THE NUMBER PAGE OF PARAGRAPH STYLE APPLIED 
    var myDoc = app.activeDocument;  
    app.findTextPreferences = app.changeTextPreferences = null;  
    var Book_Appendix_13_1 = myDoc.paragraphStyleGroups.itemByName("APPENDIX").paragraphStyles.itemByName("Appendix 13.1"); 
    app.findTextPreferences.appliedParagraphStyle = Book_Appendix_13_1; 
    var finds = myDoc.findText();
    if (finds.length > 0) { 
        var pageNumberBookAppendix_13_1=finds[0].parentTextFrames[0].parentPage.name;
    } 
//                    END GET THE NUMBER PAGE OF PARAGRAPH STYLE APPLIED 

var masterName = "A-Appendix 13.1";
var pageNumberExcludingRomanNumbers = parseInt(pageNumberBookAppendix_13_1)+FirstNumberPageDecimal; // we convert the String number pages and add the number of Number Roman pages.
var firstPage = pageNumberExcludingRomanNumbers;
var interval = 1;
applyMasterToEveryNthPage(masterName, firstPage, interval);









//                    GET THE NUMBER PAGE OF PARAGRAPH STYLE APPLIED 
    var myDoc = app.activeDocument;  
    app.findTextPreferences = app.changeTextPreferences = null;  
    var Book_Appendix_14_1 = myDoc.paragraphStyleGroups.itemByName("APPENDIX").paragraphStyles.itemByName("Appendix 14.1"); 
    app.findTextPreferences.appliedParagraphStyle = Book_Appendix_14_1; 
    var finds = myDoc.findText();
    if (finds.length > 0) { 
        var pageNumberBookAppendix_14_1=finds[0].parentTextFrames[0].parentPage.name;
    } 
//                    END GET THE NUMBER PAGE OF PARAGRAPH STYLE APPLIED 

var masterName = "A-Appendix 14.1";
var pageNumberExcludingRomanNumbers = parseInt(pageNumberBookAppendix_14_1)+FirstNumberPageDecimal; // we convert the String number pages and add the number of Number Roman pages.
var firstPage = pageNumberExcludingRomanNumbers;
var interval = 1;
applyMasterToEveryNthPage(masterName, firstPage, interval);









//                    GET THE NUMBER PAGE OF PARAGRAPH STYLE APPLIED 
    var myDoc = app.activeDocument;  
    app.findTextPreferences = app.changeTextPreferences = null;  
    var Book_Appendix_15_1 = myDoc.paragraphStyleGroups.itemByName("APPENDIX").paragraphStyles.itemByName("Appendix 15.1"); 
    app.findTextPreferences.appliedParagraphStyle = Book_Appendix_15_1; 
    var finds = myDoc.findText();
    if (finds.length > 0) { 
        var pageNumberBookAppendix_15_1=finds[0].parentTextFrames[0].parentPage.name;
    } 
//                    END GET THE NUMBER PAGE OF PARAGRAPH STYLE APPLIED 

var masterName = "A-Appendix 15.1";
var pageNumberExcludingRomanNumbers = parseInt(pageNumberBookAppendix_15_1)+FirstNumberPageDecimal; // we convert the String number pages and add the number of Number Roman pages.
var firstPage = pageNumberExcludingRomanNumbers;
var interval = 1;
applyMasterToEveryNthPage(masterName, firstPage, interval);









//                    GET THE NUMBER PAGE OF PARAGRAPH STYLE APPLIED 
    var myDoc = app.activeDocument;  
    app.findTextPreferences = app.changeTextPreferences = null;  
    var Book_Appendix_16_1 = myDoc.paragraphStyleGroups.itemByName("APPENDIX").paragraphStyles.itemByName("Appendix 16.1"); 
    app.findTextPreferences.appliedParagraphStyle = Book_Appendix_16_1; 
    var finds = myDoc.findText();
    if (finds.length > 0) { 
        var pageNumberBookAppendix_16_1=finds[0].parentTextFrames[0].parentPage.name;
    } 
//                    END GET THE NUMBER PAGE OF PARAGRAPH STYLE APPLIED 

var masterName = "A-Appendix 16.1";
var pageNumberExcludingRomanNumbers = parseInt(pageNumberBookAppendix_16_1)+FirstNumberPageDecimal; // we convert the String number pages and add the number of Number Roman pages.
var firstPage = pageNumberExcludingRomanNumbers;
var interval = 1;
applyMasterToEveryNthPage(masterName, firstPage, interval);









//                    GET THE NUMBER PAGE OF PARAGRAPH STYLE APPLIED 
    var myDoc = app.activeDocument;  
    app.findTextPreferences = app.changeTextPreferences = null;  
    var Book_Appendix_17_1 = myDoc.paragraphStyleGroups.itemByName("APPENDIX").paragraphStyles.itemByName("Appendix 17.1"); 
    app.findTextPreferences.appliedParagraphStyle = Book_Appendix_17_1; 
    var finds = myDoc.findText();
    if (finds.length > 0) { 
        var pageNumberBookAppendix_17_1=finds[0].parentTextFrames[0].parentPage.name;
    } 
//                    END GET THE NUMBER PAGE OF PARAGRAPH STYLE APPLIED 

var masterName = "A-Appendix 17.1";
var pageNumberExcludingRomanNumbers = parseInt(pageNumberBookAppendix_17_1)+FirstNumberPageDecimal; // we convert the String number pages and add the number of Number Roman pages.
var firstPage = pageNumberExcludingRomanNumbers;
var interval = 1;
applyMasterToEveryNthPage(masterName, firstPage, interval);









//                    GET THE NUMBER PAGE OF PARAGRAPH STYLE APPLIED 
    var myDoc = app.activeDocument;  
    app.findTextPreferences = app.changeTextPreferences = null;  
    var Book_Appendix_18_1 = myDoc.paragraphStyleGroups.itemByName("APPENDIX").paragraphStyles.itemByName("Appendix 18.1"); 
    app.findTextPreferences.appliedParagraphStyle = Book_Appendix_18_1; 
    var finds = myDoc.findText();
    if (finds.length > 0) { 
        var pageNumberBookAppendix_18_1=finds[0].parentTextFrames[0].parentPage.name;
    } 
//                    END GET THE NUMBER PAGE OF PARAGRAPH STYLE APPLIED 

var masterName = "A-Appendix 18.1";
var pageNumberExcludingRomanNumbers = parseInt(pageNumberBookAppendix_18_1)+FirstNumberPageDecimal; // we convert the String number pages and add the number of Number Roman pages.
var firstPage = pageNumberExcludingRomanNumbers;
var interval = 1;
applyMasterToEveryNthPage(masterName, firstPage, interval);









//                    GET THE NUMBER PAGE OF PARAGRAPH STYLE APPLIED 
    var myDoc = app.activeDocument;  
    app.findTextPreferences = app.changeTextPreferences = null;  
    var Book_Appendix_19_1 = myDoc.paragraphStyleGroups.itemByName("APPENDIX").paragraphStyles.itemByName("Appendix 19.1"); 
    app.findTextPreferences.appliedParagraphStyle = Book_Appendix_19_1; 
    var finds = myDoc.findText();
    if (finds.length > 0) { 
        var pageNumberBookAppendix_19_1=finds[0].parentTextFrames[0].parentPage.name;
    } 
//                    END GET THE NUMBER PAGE OF PARAGRAPH STYLE APPLIED 

var masterName = "A-Appendix 19.1";
var pageNumberExcludingRomanNumbers = parseInt(pageNumberBookAppendix_19_1)+FirstNumberPageDecimal; // we convert the String number pages and add the number of Number Roman pages.
var firstPage = pageNumberExcludingRomanNumbers;
var interval = 1;
applyMasterToEveryNthPage(masterName, firstPage, interval);









//                    GET THE NUMBER PAGE OF PARAGRAPH STYLE APPLIED 
    var myDoc = app.activeDocument;  
    app.findTextPreferences = app.changeTextPreferences = null;  
    var Book_Appendix_20_1 = myDoc.paragraphStyleGroups.itemByName("APPENDIX").paragraphStyles.itemByName("Appendix 20.1"); 
    app.findTextPreferences.appliedParagraphStyle = Book_Appendix_20_1; 
    var finds = myDoc.findText();
    if (finds.length > 0) { 
        var pageNumberBookAppendix_20_1=finds[0].parentTextFrames[0].parentPage.name;
    } 
//                    END GET THE NUMBER PAGE OF PARAGRAPH STYLE APPLIED 

var masterName = "A-Appendix 20.1";
var pageNumberExcludingRomanNumbers = parseInt(pageNumberBookAppendix_20_1)+FirstNumberPageDecimal; // we convert the String number pages and add the number of Number Roman pages.
var firstPage = pageNumberExcludingRomanNumbers;
var interval = 1;
applyMasterToEveryNthPage(masterName, firstPage, interval);









//                    GET THE NUMBER PAGE OF PARAGRAPH STYLE APPLIED 
    var myDoc = app.activeDocument;  
    app.findTextPreferences = app.changeTextPreferences = null;  
    var Book_Appendix_21_1 = myDoc.paragraphStyleGroups.itemByName("APPENDIX").paragraphStyles.itemByName("Appendix 21.1"); 
    app.findTextPreferences.appliedParagraphStyle = Book_Appendix_21_1; 
    var finds = myDoc.findText();
    if (finds.length > 0) { 
        var pageNumberBookAppendix_21_1=finds[0].parentTextFrames[0].parentPage.name;
    } 
//                    END GET THE NUMBER PAGE OF PARAGRAPH STYLE APPLIED 

var masterName = "A-Appendix 21.1";
var pageNumberExcludingRomanNumbers = parseInt(pageNumberBookAppendix_21_1)+FirstNumberPageDecimal; // we convert the String number pages and add the number of Number Roman pages.
var firstPage = pageNumberExcludingRomanNumbers;
var interval = 1;
applyMasterToEveryNthPage(masterName, firstPage, interval);



*/





