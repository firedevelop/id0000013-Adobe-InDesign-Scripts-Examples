//DESCRIPTION: Jongware's PrepText
if(app.documents.length==0){exit()}
switch(app.activeDocument.selection[0].constructor.name){
case "InsertionPoint":
var textRange=app.activeDocument.selection[0].parentStory;
break;
case "Character":
case "Word":
case "TextStyleRange":
case "Line":
case "Paragraph":
case "TextColumn":
case "Text":
case "TextFrame":
var textRange=app.activeDocument.selection[0];
break;
default :
alert ("You must be in some text");
exit(0);
}
/*
if (app.activeDocument.selection[0].constructor.name != "InsertionPoint")
{
	alert ("You must be in some text");
	exit(0);
}
*/
var myMaximumValue = 63;
var myProgressBarWidth = 384;
var myIncrement = myMaximumValue/myProgressBarWidth;
myCreateProgressPanel(myMaximumValue, myProgressBarWidth);

myProgressPanel.myProgressBar.value = 0;
myCreateProgressPanel(100, 400);
myProgressPanel.show();

for (b=0; b<2; b++)
{
	for (i=0; i<2; i++)
	{
		for (s=0; s<2; s++)
		{
			for (u=0; u<2; u++)
			{
				for (k=0; k<2; k++)
				{
					for (c=0; c<2; c++)
					{
						for (ac=0; ac<2; ac++)
						{
							if ((b+i+s+u+k+c+ac) && !(ac & c))
							{
								myProgressPanel.myProgressBar.value = 64*b+32*i+16*s+8*u+4*k+2*c+ac;
								findAttr (b, i, s, false, u, k, c, ac, "");
								if (s)
									findAttr (b, i, false, s, u, k, c, ac, "");
							}
						}
					}
				}
			}
		}
	}
}
myProgressPanel.hide();
exit(0);

function myCreateProgressPanel(myMaximumValue, myProgressBarWidth)
{
	myProgressPanel = new Window('window', 'Prepping text');
	with(myProgressPanel)
	{
		myProgressPanel.myProgressBar = add('progressbar', [12, 12, myProgressBarWidth, 24], 0, myMaximumValue);
	}
}

function findAttr (bold, italic, superscript, subscript, underline, strikeout, smallcaps, allcaps, StyleName)
{
	app.findTextPreferences = NothingEnum.nothing;
	app.changeTextPreferences = NothingEnum.nothing;
	app.findTextPreferences.appliedCharacterStyle = app.activeDocument.characterStyles[0];	// [None]

	app.findTextPreferences.fontStyle = "Regular";
	app.findTextPreferences.position = Position.normal;
	app.findTextPreferences.capitalization = Capitalization.normal;
	app.findTextPreferences.underline = false;
	app.findTextPreferences.strikeThru = false;

	if (bold)
	{
		if (italic)
			app.findTextPreferences.fontStyle = "Bold Italic";
		else
			app.findTextPreferences.fontStyle = "Bold";
	} else
	{
		if (italic)
			app.findTextPreferences.fontStyle = "Italic";
	}
	if (superscript)
		app.findTextPreferences.position = Position.superscript;

	if (subscript)
		app.findTextPreferences.position = Position.subscript;

	if (underline)
		app.findTextPreferences.underline = true;
	if (strikeout)
		app.findTextPreferences.strikeThru = true;

	if (allcaps)
		app.findTextPreferences.capitalization = Capitalization.allCaps;
	else
		if (smallcaps)
			app.findTextPreferences.capitalization = Capitalization.smallCaps;

	//foundItems = app.activeDocument.selection[0].parent.findText();
	var foundItems = textRange.findText();
	if (foundItems.length > 0)
	{
		if (StyleName == "")
		{
		//	Make up a name
			if (bold)
				StyleName = "Bold";
			if (italic)
			{
				if (bold)
					StyleName = "Bold italic";
				else
					StyleName = "Italic";
			}
			if (superscript)
			{
				if (StyleName) StyleName += " + ";
				StyleName += "sup";
			}
			if (subscript)
			{
				if (StyleName) StyleName += " + ";
				StyleName += "inf";
			}
			if (underline)
			{
				if (StyleName) StyleName += " + ";
				StyleName += "und";
			}
			if (strikeout)
			{
				if (StyleName) StyleName += " + ";
				StyleName += "stkout";
			}

			if (allcaps)
			{
				if (StyleName) StyleName += " + ";
				StyleName += "caps";
			} else
			{
				if (smallcaps)
				{
					if (StyleName) StyleName += " + ";
					StyleName += "scaps";
				}
			}
			try
			{
				cstyle = app.activeDocument.characterStyles.add({name:StyleName, fontStyle:app.findTextPreferences.fontStyle, underline:app.findTextPreferences.underline, strikeThru:app.findTextPreferences.strikeThru, position:app.findTextPreferences.position, capitalization:app.findTextPreferences.capitalization});
			} catch (e)
			{
			}
		}
		app.changeTextPreferences.appliedCharacterStyle = StyleName;
		//app.activeDocument.selection[0].parent.changeText (false);
		textRange.changeText (false);
	}
}
