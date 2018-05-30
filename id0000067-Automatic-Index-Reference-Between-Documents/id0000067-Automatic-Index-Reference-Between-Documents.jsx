// This script copy all index markers from one document to other. Ideal for example to translators. After run the script you will see in your Index panel all entries and you simple can translate in your language.
// Github files: https://github.com/firedevelop/id0000013-Adobe-InDesign-Scripts-Examples/tree/master/id0000067-Automatic-Index-Reference-Between-Documents
var myDocEn = app.documents[0];
var myDocSp = app.documents[1];

app.findTextPreferences = app.changeTextPreferences = NothingEnum.nothing;
app.findTextPreferences.findWhat = "^I";
var found = myDocEn.findText();
app.findTextPreferences = app.changeTextPreferences= NothingEnum.nothing;
var foundLen = found.length;

if (foundLen == 0) {
  alert ("Didn't find any index markers.\nPlease check the correct document is active.");
}

for (var i = 0; i < foundLen; i++) {
  var item = found[i];
  var story = item.parentStory;
  var lastSelIP = item.insertionPoints.lastItem();
  var paras = story.texts.itemByRange(story.insertionPoints.item(0),lastSelIP).paragraphs;
  var currPara = story.paragraphs.item(paras.length - 1);
  var chars = currPara.texts.itemByRange (currPara.insertionPoints.item(0), lastSelIP).characters;
  var paraInx = paras.length-1;
  var enCharInx = chars.length - 1;
  var spParaLen = myDocSp.stories[0].paragraphs[paraInx].length;
  var spCharInx = (enCharInx <= spParaLen)? enCharInx:spParaLen - 1;

  myDocEn.stories[0].paragraphs[paraInx].characters[enCharInx].duplicate (LocationOptions.BEFORE, myDocSp.stories[0].paragraphs[paraInx].characters[spCharInx]);
}
