// DESCRIPTION: this script setup the Menu Paragraph Style Option of all Paragraph Styles in your document. First remind fix all overrides if you want see the changes applied in your document, otherway the changes will be applied in the styles but you won't see the changes in the styles with overrides.
// Github: https://github.com/firedevelop/id0000013-Adobe-InDesign-Scripts-Examples/tree/master/id0000502-Change-some-Paragraph-Styles-Options-in-whole-document

/****** NOTE ABOUT myDoc.allParagraphStyles[a].composer = "$ID/HL Composer";
the only property you are using that is not independent of the installed InDesign localized version is the value for property composer. The value you gave, the specific string, is valid with an English version of InDesign and not with your Spanish version. The string "Adobe Paragraph Composer" will also not work with my German InDesign. Instead I have to use the string "Adobe-Absatzsetzer" if I want to address the composer in a localized way.
To make that independent of the localization of your InDesign use the independent strings.
Currently InDesign is able to use 6 different kinds of composers. Here is a list:
"$ID/HL Single J" > Adobe Japanese Single-line Composer
"$ID/HL Composer J" > Adobe Japanese Paragraph Composer
"$ID/HL Single" > Adobe Single-line Composer
"$ID/HL Composer" > Adobe Paragraph Composer
"$ID/HL Single Optyca" > Adobe World-Ready Single-line Composer
"$ID/HL Composer Optyca" > Adobe World-Ready Composer
That means: To make a script independent of the specific localization best use a string like "$ID/HL Composer" instead of "Adobe Paragraph Composer" when addressing property composer of a paragraph or a paragraph style.

****** NOTE ABOUT allParagraphStyles[0]
I would never try to change allParagraphStyles[0].
I would also add: Do not touch the [Basic Paragraph Style] as well, that is allParagraphStyles[1].
So if you loop through the allParagraphStyles array begin your loop with the third style:
for(var a=2;a<myDoc.allParagraphStyles.length;a++)
*/

var myDoc = app.activeDocument;
ParaStyle_Reduce();
//alert("Process Completed...");

function ParaStyle_Reduce(){
	var countAllParagraphStyles = myDoc.allParagraphStyles.length;	//simple counter to indicate the progress on Javascript console
	$.writeln("countAllParagraphStyles: " + countAllParagraphStyles);
	for(var a=2;a<myDoc.allParagraphStyles.length;a++){	
		$.writeln("a: " + a);
		try{
			// MENU PARAGRAPH STYLE OPTION - Advance Character Formats
			myDoc.allParagraphStyles[a].horizontalScale = 100;
			myDoc.allParagraphStyles[a].verticalScale = 100;
			myDoc.allParagraphStyles[a].baselineShift = 0;
			myDoc.allParagraphStyles[a].skew = 0;
			myDoc.allParagraphStyles[a].appliedLanguage = "Spanish";
			

			// MENU PARAGRAPH STYLE OPTION - Justification
			myDoc.allParagraphStyles[a].minimumWordSpacing = 85;
			myDoc.allParagraphStyles[a].minimumLetterSpacing = -2;
			myDoc.allParagraphStyles[a].minimumGlyphScaling = 97;
			myDoc.allParagraphStyles[a].desiredWordSpacing = 100;
			myDoc.allParagraphStyles[a].desiredLetterSpacing = 0;
			myDoc.allParagraphStyles[a].desiredGlyphScaling = 100;
			myDoc.allParagraphStyles[a].maximumWordSpacing = 110;
			myDoc.allParagraphStyles[a].maximumLetterSpacing = 2;
			myDoc.allParagraphStyles[a].maximumGlyphScaling = 103;
			myDoc.allParagraphStyles[a].autoLeading = 120;
			myDoc.allParagraphStyles[a].singleWordJustification = SingleWordJustification.FULLY_JUSTIFIED;
			myDoc.allParagraphStyles[a].composer = "$ID/HL Composer"; 		// don't use myDoc.allParagraphStyles[a].composer = "Adobe Paragraph Composer";

			// MENU PARAGRAPH STYLE OPTION - Justification
			// myDoc.allParagraphStyles[a].hyphenation = true;
			myDoc.allParagraphStyles[a].hyphenateWordsLongerThan = 5; 		// (range 3 - 25) also the name of this value is Words with at Least
			myDoc.allParagraphStyles[a].hyphenateAfterFirst	= 2;				
			myDoc.allParagraphStyles[a].hyphenateBeforeLast = 2;
			myDoc.allParagraphStyles[a].hyphenateLadderLimit = 2; 	// (range 0 - 25) also the name of this value is Hyphen Limit
			myDoc.allParagraphStyles[a].hyphenationZone = 0;
			myDoc.allParagraphStyles[a].hyphenWeight = 2;	// (range 0 - 10) also the name of this value is Better Spacing and Fewer Hyphens
			myDoc.allParagraphStyles[a].hyphenateCapitalizedWords = false;
			myDoc.allParagraphStyles[a].hyphenateLastWord = false;
			myDoc.allParagraphStyles[a].hyphenateAcrossColumns = false;

			$.writeln("Progress: " + a + " of " + countAllParagraphStyles + " Styles");  //simple counter to indicate the progress on Javascript console
		}catch(e){}
	}
}
