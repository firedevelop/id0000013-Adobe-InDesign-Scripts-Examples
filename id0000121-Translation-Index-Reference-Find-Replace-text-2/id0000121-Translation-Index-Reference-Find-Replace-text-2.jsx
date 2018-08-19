var myTerms = [
              ['wisdom' , 'sabiduría'],  
              ['wisdom realizing knowledge' , 'sabiduría que realiza el conocimiento'],  
              ['realizing knowledge' , 'que realiza el conocimiento'],  
              ['knowledge' , 'conocimiento'] 
];
var doc = app.activeDocument;
for (var i=0; i<doc.indexes.length; i++) {  
        renameTopics(doc.indexes[i]);  
    } // for  
alert("Done!\n Sometimes with a large translations, is recomend run the script more than 3 times to be sure all words are translated.");
function renameTopics(myIndex)
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
}// fnc

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
          
        
            
            



      

