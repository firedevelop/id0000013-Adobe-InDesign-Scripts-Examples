var myTerms = [
    
    ['text','translation'],
    ['text text\(s\)','translation translation\(s\)'],
    ['text\’s','translation\’s'],
    ['text\, text','translation\, translation'],
    ['text\-text','translation\-translation'],
    ['text ö','translation ö'],
    ['text \& text','translation \& translation']

];
var doc = app.activeDocument;
for (var i=0; i<doc.indexes.length; i++) {  
        renameTopics(doc.indexes[i]);  
    } // for  

function renameTopics(myIndex)
{
	var j;
	var tp = myIndex.topics.everyItem().getElements()
	for (var idx = 0; idx < tp.length; idx++) {
		if( myTest(tp[idx]) ) {
			renameTopics(tp[idx]); 
		}
       
	   j=translateIt(tp[idx].name+"", myTerms);
	   if(j != null)
	   {
		   tp[idx].name = j;
	   }
   } //for    
}

/* function renameTopics(myIndex)
{
var j;   
   for (var idx = 0; idx < myIndex.topics.length; idx++) {
    if( myTest(myIndex.topics[idx]) ) { renameTopics(myIndex.topics[idx]); }
       
       j=translateIt(myIndex.topics[idx].name+"", myTerms);
       if(j != null)
       {
           myIndex.topics[idx].name = j;
       }
   } //for    
}// fnc */

function translateIt(myStr, myArr)
{
    for(k=0; k< myArr.length; k++)
    {
        if(myStr == myArr[k][0]) return myArr[k][1];
    }
return null;
}

function myTest(myNextLevel)
{
     var result;
     try {var myLen = myNextLevel.topics.length;
       result = true;
      } //try
        catch (er) {result = false}    
    return result;
}
          
        
            
            



      

