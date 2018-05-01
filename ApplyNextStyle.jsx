//ApplyNextStyle.jsx by Henryk Jursz, HenJ, http://www.jursz.com, september 2016
//An InDesign CS3+ JavaScript for applying next style to paragraphs

$.locale = "pl";

//all script messages
myScriptIDC	= "\u017Baden dokument InDesigna nie jest otwarty lub nie zaznaczono akapitu!";
myScriptTIT	= "ApplyNextStyle 1.0, \u00a92016 Henryk Jursz";
myScriptSTA	= false;

//is InDesign?
if (app.name == "Adobe InDesign") {
	//any document opened?
	if (app.documents.length > 0) {
		//is any selection?
		if (app.selection.length > 0) {
			myScriptSTA = true;
			}
		}
	}
//start if true, else alert
if (!myScriptSTA) {
	alert(myScriptIDC);
	}
else {
	//some script turned off user interaction, we turn it on
	var myAppVersion = parseFloat(app.version);
	(myAppVersion < 4) ? (app.userInteractionLevel = UserInteractionLevels.interactWithAll) : (app.scriptPreferences.userInteractionLevel = UserInteractionLevels.interactWithAll);

	//are more than one paragraph?
	if (app.selection[0].paragraphs.length > 1) {
		for (a = 1; a < app.selection[0].paragraphs.length; a++) {
			myNextStyle = app.selection[0].paragraphs[a-1].appliedParagraphStyle.nextStyle;
			app.selection[0].paragraphs[a].applyParagraphStyle(myNextStyle, true);
			}
		}
	}//end char - don't touch!!
//end of script (by Henryk Jursz, HenJ 2016)