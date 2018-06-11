var myDoc = app.documents[0];  
var allParaStyleWithSameName = [];  
var counter = 0;  
var pStyleGroup = myDoc.paragraphStyleGroups.itemByName('BOOK COVER PAGE');
while(counter < myDoc.pStyleGroup.paragraphStyles.length){  
    if(myDoc.pStyleGroup.paragraphStyles[counter].name.toString().indexOf('Book Cover Page ') != -1){  
        //You can do something here//  
        allParaStyleWithSameName.push(myDoc.pStyleGroup.paragraphStyles[counter]);  
        }  
    counter++;  
    }  
alert(allParaStyleWithSameName.length);  
//You can do something here looping through your array// 









//var allParaStyles = app.documents[0].allParagraphStyles;  
//var allParaStylesLength = allParaStyles.length; 
//alert(allParaStylesLength);




//var BookCoverPage = myDoc.paragraphStyleGroups.itemByName("BOOK COVER PAGE").paragraphStyles.itemByName('Book Cover Page ');



/****  TO FIND PARAGRAPH STYLES WITHOUT GROUPS USE THIS SCRIPT  **********
var myDoc = app.documents[0];  
var allParaStyleWithSameName = [];  
var counter = 0;  
while(counter < myDoc.paragraphStyles.length){  
    if(myDoc.paragraphStyles[counter].name.toString().indexOf('Book Cover Page ') != -1){  
        //You can do something here//  
        allParaStyleWithSameName.push(myDoc.paragraphStyles[counter]);  
        }  
    counter++;  
    }  
alert(allParaStyleWithSameName.length);  
//You can do something here looping through your array//  
****************************************************************************/