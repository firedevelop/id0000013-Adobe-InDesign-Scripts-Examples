// DESCRIPTION: this script setup the Menu Paragraph Style Option of all Paragraph Styles in your document. First remind fix all overrides if you want see the changes applied in your document, otherway the changes will be applied in the styles but you won't see the changes in the styles with overrides.
// If you run the script in a document with more than 200 styles can be slow. If you have for example 1000 styles you can split the styles in a new documents and apply the script several times, and after merge again the document.
//https://forums.adobe.com/thread/573934#
// reduce the font size or leading direct in the Paragraph Styles. The script works including in the styles not applied in the text.
var myDoc = app.activeDocument;
ParaStyle_Reduce();
//alert("Process Completed...");

function ParaStyle_Reduce(){
	var countAllParagraphStyles = myDoc.allParagraphStyles.length;	//simple counter to indicate the progress on Javascript console
	for(var a=0;a<myDoc.allParagraphStyles.length;a++){	
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
			myDoc.allParagraphStyles[a].composer = "Adobe Paragraph Composer";

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

