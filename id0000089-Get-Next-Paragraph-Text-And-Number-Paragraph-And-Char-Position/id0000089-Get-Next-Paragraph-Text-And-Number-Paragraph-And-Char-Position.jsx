main();
function main()
{
  var myDocDebug = app.documents[1];
  var sel = app.selection[0];
  if( sel===undefined )
    throw "No selection";
  if( !sel.hasOwnProperty("insertionPoints") )
    throw "No text";

  var story = sel.parentStory;
  var lastSelIP = sel.insertionPoints.lastItem();
  var paras = story.texts.itemByRange(story.insertionPoints.item(0),lastSelIP).paragraphs;
  var nextPara = story.paragraphs.item(paras.length);
  alert("Next paragraph's text is:\r"+nextPara.contents);

  var paraInx = paras.length-1;
  var lastParaIP = story.paragraphs.item(paraInx).insertionPoints.lastItem();
  if( lastParaIP.index>lastSelIP.index )
    alert("Selected "+sel.constructor.name+" ends in paragraph "+paraInx);
  else
    alert("Selected "+sel.constructor.name+" ends after paragraph "+paraInx);

  var currPara = story.paragraphs.item(paras.length - 1);
  var chars = currPara.texts.itemByRange (currPara.insertionPoints.item(0), lastSelIP).characters;
  alert ("Char Position: "+chars.length);
  myDocDebug.stories[0].paragraphs[0].contents = "test";
}
