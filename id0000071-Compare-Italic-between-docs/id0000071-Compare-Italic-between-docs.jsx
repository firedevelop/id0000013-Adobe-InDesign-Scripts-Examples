// get documents to compare 
$.writeln(); 
var myDocs= app.documents;  
var compareDoc1 = myDocs.itemByName ("Original.indd");  
var compareDoc2 = myDocs.itemByName ("Typeset.indd");  
  
// get all the stories  
var compareDoc1Stories = compareDoc1.stories.everyItem();  
var compareDoc2Stories = compareDoc2.stories.everyItem();  
  
  
// get all the words  
var compareDoc1Words = compareDoc1Stories.words.everyItem().getElements();  
var compareDoc2Words = compareDoc2Stories.words.everyItem().getElements();  
var numberOfWords = compareDoc1Words.length;  
  
  
// incase they have differnet lengths, use the shorter one to make sure we don't access areas we are not allowed to be.  
if ( compareDoc2Words.length < numberOfWords )  
{  
    numberOfWords = compareDoc2Words.length;  
}  
  
  
// for each word  
for ( var i = 0; i < numberOfWords; i++)  
{  
    var currentDoc1Word = compareDoc1Words[i];  
    var currentDoc2Word = compareDoc2Words[i];  
  
  
     // get the word  
    var currentDoc1Contents = currentDoc1Word.contents;  
    var currentDoc2Contents = currentDoc2Word.contents;  
  
  
    //get the font style  
    var currentDoc1FontStyle = currentDoc1Word.fontStyle;  
    var currentDoc2FontStyle = currentDoc2Word.fontStyle;  
  
  
    //get the previous Word Location  
    var previousWordLocation = i -1;  
    var previousWord = compareDoc1Words[previousWordLocation];  
    var previousString = previousWord;  
  
  
    //get the next Word Location  
    var nextWordLocation = i + 1;  
    var nextWord = compareDoc1Words[nextWordLocation];  
    var nextString = nextWord;  
  
  
    // as we are only looking for italics  
    if ( currentDoc1FontStyle === "Italic")  
    {  
        if ( ! ( ( currentDoc1Contents === currentDoc2Contents ) && ( currentDoc1FontStyle === currentDoc2FontStyle)))  
        {  
            if (previousString !== undefined){  
                alert ( "Unmatched italics in: " + previousString.contents + " " + currentDoc1Contents + " " + nextString.contents); // report a fail in whichever makes most sense for you.  
            }  
    }  
          
}  
}  