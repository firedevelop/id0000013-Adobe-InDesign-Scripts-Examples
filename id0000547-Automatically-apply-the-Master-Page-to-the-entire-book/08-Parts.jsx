//_____________________________________________________________________________________
//		 COUNT ALL PARAGRAPH STYLES IN A PARAGRAPH STYLES GROUP WITH THE SAME NAME    

var myName = "PART"
var myArr =[];
var myParaStyleList = myGetParagraphStyleNames();
for (var i=0; i< myParaStyleList.length; i++)
{
    if(myParaStyleList[i].indexOf(myName) !=-1)
    {
        myArr.push(myParaStyleList[i]);
    }
}
// alert("Total Paragraph Styles FIRST and SECOND dimension: " + myArr.length); // TOTAL OF PARAGRAPH STYLES
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
// alert("Total Paragraph Styles FIRST dimension: " + myArr3.length);   // TOTAL OF FIRST DIMENSION

myArr4 = Unique(myArr2);
// alert("Total Paragraph Styles SECOND dimension: " + myArr4.length);   // TOTAL OF SECOND DIMENSION


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

//_____________________________________________________________________________________
//                     END Apply Master Page based on Paragraph Style 





//_____________________________________________________________________________________
//                   START Apply Master Page based on Paragraph Style 

var myDocument = app.activeDocument;
var myParas = myDocument.stories.everyItem().paragraphs.everyItem().getElements();
var myPage = myDocument.pages;
myArr3.length++;
myArr4.length++;

for(i=0; i<myParas.length; i++){
for(x=0;x<myArr3.length;x++){
	for(z=0;z<myArr4.length;z++){
		if(myParas[i].appliedParagraphStyle.name == "Part "+[x]+"."+[z]){
			myParas[i].parentTextFrames[0].parentPage.appliedMaster = myDocument.masterSpreads.item("E-Empty 1.1");}}}

}

//_____________________________________________________________________________________
//                     END Apply Master Page based on Paragraph Style 

// alert("Done!");