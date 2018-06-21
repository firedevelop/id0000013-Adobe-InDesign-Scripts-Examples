/* Copyright 2015, Kasyan Servetsky
March 17, 2015
Written by Kasyan Servetsky
http://www.kasyan.ho.com.ua
http://www.kasyan.ho.com.ua/indesign/export/export_styles_description_settings_to_csv.html
e-mail: askoldich@yahoo.com

The script exports most of the document´s paragraph style description settings to CSV or TXT file which can be opened in Excel.
I recommend you to set Excel as the default application for opening csv-files and record a macro for fast formatting 
the spreadsheet: auto adjust column widths, apply color to the text and background for the first two (header) rows.
*/
//======================================================================================
var doc, set, appVersion, subFolders, delimiter,
scriptName = "Export paragraph style description settings - 4.0",
txt = "";

CreateDialog();

//===================================== FUNCTIONS  ======================================
function Main() {
	var inddFolder, inddFiles, inddFiles;
	appVersion = Number(app.version.split(".")[0] + "." + app.version.split(".")[1]);
	
	if (set.delimiterSel == 0) {
		delimiter = ";";
	}
	else if (set.delimiterSel == 1) {
		delimiter = ",";
	}
	else if (set.delimiterSel == 2) {
		delimiter = "\t";
	}
	
	MakeHeader();
	
	if (set.rbSel == 0 || set.rbSel == 1) {
		if (set.rbSel == 0) { // active document
			doc = app.activeDocument;
			ProcessDocument(doc);
		}
		else if (set.rbSel == 1) { // all open documents
			for (var d = 0; d < app.documents.length; d++) {
				doc = app.documents[d];
				ProcessDocument(doc);
			}
		}
	}
	else if (set.rbSel == 2) { // active book
		inddFiles = GetFilesFromBook();
		if (inddFiles.length == 0) ErrorExit("Found no InDesign documents in the active book.", true);
		ProcessAllInddDocs(inddFiles);
	}
	else if (set.rbSel == 3 || set.rbSel == 4) {
		inddFolder = Folder.selectDialog("Choose a folder with InDesign documents.");
		if (inddFolder == null) exit();
		if (set.rbSel == 3) { // folder
			inddFiles = inddFolder.getFiles("*.indd");
		}
		else if (set.rbSel == 4) { // folder and subfolders
			inddFiles = GetAllInddFiles(inddFolder);
		}
		if (inddFiles.length == 0) ErrorExit("Found no InDesign documents in the selected folder.", true);
		ProcessAllInddDocs(inddFiles);
	}

	txt = txt.replace(/true/g, "On");
	txt = txt.replace(/false/g, "Off");
	
	WriteToFile(txt);
	
	alert("Finished.", scriptName);
}
//--------------------------------------------------------------------------------------------------------------------------------------------------------
function ProcessDocument(doc) {
	var ps, str, tmpStr, characterValue, tabStop, tabStopAlignment, tabStopAlignmentCharacter, tabStopAlignmentCharacter,
	mapEpub = null,
	mapPdf = null,
	arr = [],
	parStyles = doc.allParagraphStyles;

	for (var p = 0; p < parStyles.length; p++) {
		ps = parStyles[p];
		var _psName = ps.name; // for debugging only
		arr = [];
		
		if (set.rbSel > 0) arr.push(doc.name);
		
		arr.push(GetParentGroups(ps));
		arr.push(ps.name);
		
		// General
		if (p != 0) {
			if (ps.basedOn instanceof ParagraphStyle) {
				arr.push(ps.basedOn.name);
			}
			else {
				arr.push(ps.basedOn);
			}
		}
		else { // [No Paragraph Style]
			arr.push("N/A for root style");
		}
		
		if (p != 0) {
			if (ps.nextStyle instanceof ParagraphStyle) {
				arr.push(ps.nextStyle.name);
			}
			else {
				arr.push(ps.nextStyle);
			}
		}
		else { // [No Paragraph Style]
			arr.push("N/A for root style");
		}
	
		// Basic character formats
		try { // if a font is installed in the "Document fonts" folder, it's properties might be unavailable
			arr.push(ps.appliedFont.fontFamily);
		}
		catch(err) {
			arr.push("N/A");
		}
	
		try {
			arr.push(ps.appliedFont.fontStyleName);
		}
		catch(err) {
			arr.push("N/A");
		}	
	
		try {
			arr.push(RoundWithDecimal(Number(ps.pointSize), 2));
		}
		catch(err) {
			arr.push("N/A");
		}

		arr.push((ps.leading == Leading.AUTO) ? "Auto" : RoundWithDecimal(Number(ps.leading), 2));
		arr.push(ps.kerningMethod);
		arr.push(ps.tracking);
		
		switch (ps.capitalization) {
			case Capitalization.NORMAL:
				arr.push("Normal");
				break;
			case Capitalization.SMALL_CAPS:
				arr.push("Small caps");
				break;
			case Capitalization.ALL_CAPS:
				arr.push("All caps");
				break;
				case Capitalization.CAP_TO_SMALL_CAP:
				arr.push("Open type all small caps");
				break;
			default:
				arr.push("N/A");
		}

		switch (ps.position) {
			case Position.NORMAL:
				arr.push("Normal");
				break;
			case Position.SUPERSCRIPT:
				arr.push("Superscript");
				break;
			case Position.SUBSCRIPT:
				arr.push("Subscript");
				break;
			case Position.OT_SUPERSCRIPT:
				arr.push("Open Type Superior/Superscript");
				break;
			case Position.OT_SUBSCRIPT:
				arr.push("Open Type Inferior/Subscript");
				break;
			case Position.OT_NUMERATOR:
				arr.push("Open Type Numerator");
				break;
			case Position.OT_DENOMINATOR:
				arr.push("Open Type Denominator");
				break;
			default:
				arr.push("N/A");
		}
		
		arr.push(ps.underline);
		arr.push(ps.ligatures);
		arr.push(ps.noBreak);
		arr.push(ps.strikeThru);
	
		// Advanced character formats
		arr.push(RoundWithDecimal(Number(ps.horizontalScale), 2));
		arr.push(RoundWithDecimal(Number(ps.verticalScale), 2));
		arr.push(RoundWithDecimal(Number(ps.baselineShift), 2));
		arr.push(RoundWithDecimal(Number(ps.skew), 2));
		arr.push(ps.appliedLanguage.name);
				
		// Indents and spacing
		switch (ps.justification) {
			case Justification.LEFT_ALIGN:
				arr.push("Left");
				break;
			case Justification.CENTER_ALIGN:
				arr.push("Center");
				break;
			case Justification.RIGHT_ALIGN:
				arr.push("Right");
				break;
			case Justification.LEFT_JUSTIFIED:
				arr.push("Left justify");
				break;
			case Justification.RIGHT_JUSTIFIED:
				arr.push("Right justify");
				break;
			case Justification.CENTER_JUSTIFIED:
				arr.push("Center justify");
				break;
			case Justification.FULLY_JUSTIFIED:
				arr.push("Full justify");
				break;
			case Justification.TO_BINDING_SIDE:
				arr.push("Towards spine");
				break;
			case Justification.AWAY_FROM_BINDING_SIDE:
				arr.push("Away from spine");
				break;
			default:
				arr.push("N/A");
		}
		
		switch (ps.balanceRaggedLines) {
			case BalanceLinesStyle.FULLY_BALANCED:
				arr.push("Balances lines equally");
				break;
			case BalanceLinesStyle.NO_BALANCING:
				arr.push("Does not balance lines");
				break;
			case BalanceLinesStyle.PYRAMID_SHAPE:
				arr.push("Prefers longer last lines");
				break;
				case BalanceLinesStyle.VEE_SHAPE:
				arr.push("Prefers shorter last lines");
				break;
			default:
				arr.push("N/A");
		}

		arr.push(ps.ignoreEdgeAlignment); // Ignore optical margin
		arr.push(RoundWithDecimal(Number(ps.leftIndent), 2));
		arr.push(RoundWithDecimal(Number(ps.rightIndent), 2));
		arr.push(RoundWithDecimal(Number(ps.firstLineIndent), 2));
		arr.push(RoundWithDecimal(Number(ps.lastLineIndent), 2));
		arr.push(RoundWithDecimal(Number(ps.spaceBefore), 2));
		arr.push(RoundWithDecimal(Number(ps.spaceAfter), 2));
		arr.push(ps.alignToBaseline);

		// Tabs
		var tabStopsCount = ps.tabStops.count();
		
		if (tabStopsCount == 0) {
			arr.push("N/A");
		}
		else {
			tmpStr = "";
			
			for (var t = 0; t < tabStopsCount; t++) {
				tabStop = ps.tabStops[t];
				
				switch (tabStop.alignment) {
					case TabStopAlignment.LEFT_ALIGN:
						tabStopAlignment = "Left";
						break;
					case TabStopAlignment.CENTER_ALIGN:
						tabStopAlignment = "Center";
						break;
					case TabStopAlignment.RIGHT_ALIGN:
						tabStopAlignment = "Right";
						break;
					case TabStopAlignment.CHARACTER_ALIGN:
						tabStopAlignment = "Decimal";
						break;
					default:
						tabStopAlignment = "";
				}

				tmpStr += tabStopAlignment;
				tmpStr += "\\" + RoundWithDecimal(Number(tabStop.position), 2);
				
				tabStopLeader = tabStop.leader;
				
				if (tabStopLeader == ",") {
					tabStopLeader = "comma";
				}
				else if (tabStopLeader == ";") {
					tabStopLeader = "semicolon";
				}
				else if (tabStopLeader == "") {
					tabStopLeader = "N/A";
				}
				
				tmpStr += "\\" + tabStopLeader;
				
				tabStopAlignmentCharacter = tabStop.alignmentCharacter;

				if (tabStopAlignmentCharacter == ",") {
					tabStopAlignmentCharacter = "comma";
				}
				else if (tabStopAlignmentCharacter == ";") {
					tabStopAlignmentCharacter = "semicolon";
				}
				else if (tabStopAlignmentCharacter == "") { // ???
					tabStopLeader = "N/A";
				}
			
				tmpStr += "\\" + tabStopAlignmentCharacter;
				
				if (t != tabStopsCount - 1) tmpStr += " | ";
			}
		
			arr.push(tmpStr);
		}
			
		// Paragraph rules
		arr.push(ps.ruleAbove);
		arr.push(RoundWithDecimal(Number(ps.ruleAboveLineWeight), 2));
		arr.push(ps.ruleAboveType.name);
		arr.push((ps.ruleAboveColor.name != undefined) ? ps.ruleAboveColor.name : ps.ruleAboveColor);
		arr.push((ps.ruleAboveTint == -1) ? "N/A" : ps.ruleAboveTint);
		arr.push(ps.ruleAboveOverprint);
		arr.push((ps.ruleAboveGapColor.name != undefined) ? ps.ruleAboveGapColor.name : ps.ruleAboveGapColor);
		arr.push((ps.ruleAboveGapTint == -1) ? "N/A" : ps.ruleAboveGapTint);
		arr.push(ps.ruleAboveGapOverprint);

		switch (ps.ruleAboveWidth) {
			case RuleWidth.COLUMN_WIDTH:
				arr.push("Column");
				break;
			case RuleWidth.TEXT_WIDTH:
				arr.push("Width");
				break;
			default:
				arr.push("N/A");
		}
	
		arr.push(RoundWithDecimal(Number(ps.ruleAboveOffset), 2));
		arr.push(RoundWithDecimal(Number(ps.ruleAboveLeftIndent), 2));
		arr.push(RoundWithDecimal(Number(ps.ruleAboveRightIndent), 2));
		arr.push(ps.keepRuleAboveInFrame);
		
		arr.push(ps.ruleBelow);
		arr.push(RoundWithDecimal(Number(ps.ruleBelowLineWeight), 2));
		arr.push(ps.ruleBelowType.name);
		arr.push((ps.ruleBelowColor.name != undefined) ? ps.ruleBelowColor.name : ps.ruleBelowColor);
		arr.push((ps.ruleBelowTint == -1) ? "N/A" : ps.ruleBelowTint);
		arr.push(ps.ruleBelowOverprint);
		arr.push((ps.ruleBelowGapColor.name != undefined) ? ps.ruleBelowGapColor.name : ps.ruleBelowGapColor);
		arr.push((ps.ruleBelowGapTint == -1) ? "N/A" : ps.ruleBelowGapTint);
		arr.push(ps.ruleBelowGapOverprint);
	
		switch (ps.ruleBelowWidth) {
			case RuleWidth.COLUMN_WIDTH:
				arr.push("Column");
				break;
			case RuleWidth.TEXT_WIDTH:
				arr.push("Width");
				break;
			default:
				arr.push("N/A");
		}
	
		arr.push(RoundWithDecimal(Number(ps.ruleBelowOffset), 2));
		arr.push(RoundWithDecimal(Number(ps.ruleBelowLeftIndent), 2));
		arr.push(RoundWithDecimal(Number(ps.ruleBelowRightIndent), 2));
		
		// Keep options
		if (appVersion > 6) {
			arr.push(ps.keepWithPrevious);
		}	
		arr.push(ps.keepWithNext);
		
		arr.push(ps.keepLinesTogether);
		arr.push(ps.keepAllLinesTogether); // All lines in paragraph
		arr.push(ps.keepFirstLines); // Start lines
		arr.push(ps.keepLastLines); // End lines

		switch (ps.startParagraph) {
			case StartParagraph.ANYWHERE:
				arr.push("Anyware");
				break;
			case StartParagraph.NEXT_COLUMN:
				arr.push("In next column");
				break;
			case StartParagraph.NEXT_FRAME:
				arr.push("In next frame");
				break;
			case StartParagraph.NEXT_PAGE:
				arr.push("On next page");
				break;
			case StartParagraph.NEXT_ODD_PAGE:
				arr.push("On next odd page");
				break;
			case StartParagraph.NEXT_EVEN_PAGE:
				arr.push("On next even page");
				break;
			default:
				arr.push("N/A");
		}

		// Hyphenation
		arr.push(String(ps.hyphenation));
		arr.push(ps.hyphenateWordsLongerThan);
		arr.push(ps.hyphenateAfterFirst);
		arr.push(ps.hyphenateBeforeLast);
		arr.push(ps.hyphenateLadderLimit);
		arr.push(RoundWithDecimal(Number(ps.hyphenationZone), 2));
		arr.push(ps.hyphenateCapitalizedWords);
		arr.push(ps.hyphenateLastWord);
		arr.push(ps.hyphenateAcrossColumns);
			
		// Justification
		arr.push(RoundWithDecimal(Number(ps.minimumWordSpacing), 2) + "/" + RoundWithDecimal(Number(ps.desiredWordSpacing), 2) + "/" + RoundWithDecimal(Number(ps.maximumWordSpacing), 2));
		arr.push(RoundWithDecimal(Number(ps.minimumLetterSpacing), 2) + "/" + RoundWithDecimal(Number(ps.desiredLetterSpacing), 2) + "/" + RoundWithDecimal(Number(ps.maximumLetterSpacing), 2));
		arr.push(RoundWithDecimal(Number(ps.minimumGlyphScaling), 2) + "/" + RoundWithDecimal(Number(ps.desiredGlyphScaling), 2) + "/" + RoundWithDecimal(Number(ps.maximumGlyphScaling), 2));
		arr.push(RoundWithDecimal(Number(ps.autoLeading), 2));
		
		switch (ps.singleWordJustification) {
			case SingleWordJustification.CENTER_ALIGN:
				arr.push("Align center");
				break;
			case SingleWordJustification.FULLY_JUSTIFIED:
				arr.push("Full justify");
				break;
			case SingleWordJustification.LEFT_ALIGN:
				arr.push("Align left");
				break;
			case SingleWordJustification.RIGHT_ALIGN:
				arr.push("Align right");
				break;
			default:
				arr.push("N/A");
		}

		arr.push(ps.composer);
			
		// Span columns
		if (appVersion > 6) {
			switch (ps.spanColumnType) {
				case SpanColumnTypeOptions.SINGLE_COLUMN:
					arr.push("Single column");
					break;
				case SpanColumnTypeOptions.SPAN_COLUMNS:
					arr.push("Span columns");
					break;
				case SpanColumnTypeOptions.SPLIT_COLUMNS:
					arr.push("Split column");
					break;
				default:
					arr.push("N/A");
			}
		
			arr.push(ps.spanSplitColumnCount); // Span ... columns/Sub-columns
			arr.push(ps.spanColumnMinSpaceBefore); // Space before span/split
			arr.push(ps.spanColumnMinSpaceAfter); // Space after span/split
			arr.push(RoundWithDecimal(ps.splitColumnInsideGutter, 2)); // Inside gutter
			arr.push(ps.splitColumnOutsideGutter); // Outide gutter
		}
	
		// Drop caps and nested styles
		arr.push(ps.dropCapLines);
		arr.push(ps.dropCapCharacters);
		arr.push(ps.dropCapStyle.name);

		switch (ps.dropcapDetail) {
			case 0:
				arr.push("Off");
				arr.push("Off");
				break;
			case 1:
				arr.push("On");
				arr.push("Off");
				break;
			case 2:
				arr.push("Off");
				arr.push("On");
				break;
			case 3:
				arr.push("On");
				arr.push("On");
				break;
			default:
				arr.push("N/A");
		}		
		
		if (ps.nestedStyles.length == 0) {
			arr.push("N/A");
		}
		else {
			arr.push(GetNamesList(ps.nestedStyles).join(" | "));
		}

		
		if (appVersion > 6) {
			if (ps.nestedLineStyles.length == 0) {
				arr.push("N/A");
			}
			else {
				arr.push(GetNamesList(ps.nestedLineStyles).join(" | "));
			}
			
			// GREP styles
			if (ps.nestedGrepStyles.length == 0) {
				arr.push("N/A");
			}
			else {
				tmpStr = "";
				for (var i = 0; i < ps.nestedGrepStyles.length; i++) {
					tmpStr += ps.nestedGrepStyles[i].grepExpression + " (" + ps.nestedGrepStyles[i].appliedCharacterStyle.name + ")";
					if (i != ps.nestedGrepStyles.length - 1) tmpStr += " | ";
				}
				
			arr.push(tmpStr);
			}
		}
	
		// Bullets and numbering
		switch (ps.bulletsAndNumberingListType) {
			case ListType.NO_LIST:
				arr.push("None");
				break;
			case ListType.BULLET_LIST:
				arr.push("Bullets");
				break;
			case ListType.NUMBERED_LIST:
				arr.push("Numbers");
				break;
			default:
				arr.push("N/A");
		}
	
	
		if (ps.bulletChar.characterType == BulletCharacterType.UNICODE_ONLY || ps.bulletChar.characterType == BulletCharacterType.UNICODE_WITH_FONT) {
			characterValue = "Unicode: " + ps.bulletChar.characterValue.toString(16);
		}
		else if (ps.bulletChar.characterType == BulletCharacterType.GLYPH_WITH_FONT) {
			characterValue = "GID: " + ps.bulletChar.characterValue;
		}
	
		arr.push(characterValue);

		arr.push(ps.bulletChar.bulletsFont);
		arr.push(ps.bulletsTextAfter);
		arr.push(ps.bulletsCharacterStyle.name); // Character style
		
		switch (ps.bulletsAlignment) {
			case ListAlignment.CENTER_ALIGN:
				arr.push("Center");
				break;
			case ListAlignment.LEFT_ALIGN:
				arr.push("Left");
				break;
			case ListAlignment.RIGHT_ALIGN:
				arr.push("Right");
				break;
			default:
				arr.push("N/A");
		}

		// Character color
		arr.push((ps.fillColor.name == "") ? "Unnamed color" : ps.fillColor.name);
		arr.push(((ps.fillTint != -1) ? ps.fillTint : "N/A"));
		arr.push(ps.overprintFill);
		
		// Open type features
		arr.push(ps.otfTitling);
		arr.push(ps.otfContextualAlternate);
		arr.push(ps.otfSwash);
		arr.push(ps.otfOrdinal);
		arr.push(ps.otfDiscretionaryLigature);
		arr.push(ps.otfFraction);
		arr.push(ps.otfSlashedZero);
		
		switch (ps.otfFigureStyle) {
			case OTFFigureStyle.TABULAR_LINING:
				arr.push("Tabular lining");
				break;
			case OTFFigureStyle.PROPORTIONAL_OLDSTYLE:
				arr.push("Proportional oldstyle");
				break;
			case OTFFigureStyle.PROPORTIONAL_LINING:
				arr.push("Proportional lining");
				break;
			case OTFFigureStyle.TABULAR_OLDSTYLE:
				arr.push("Tabular oldstyle");
				break;
			case OTFFigureStyle.DEFAULT_VALUE:
				arr.push("Default figure style");
				break;
			default:
				arr.push("N/A");
		}
		
		switch (ps.positionalForm) {
			case PositionalForms.NONE:
				arr.push("General form");
				break;
			case PositionalForms.CALCULATE:
				arr.push("Automatic form");
				break;
			case PositionalForms.INITIAL:
				arr.push("Initial form");
				break;
			case PositionalForms.MEDIAL:
				arr.push("Medial form");
				break;
			case PositionalForms.FINAL:
				arr.push("Final form");
				break;
			case PositionalForms.ISOLATED:
				arr.push("Isolated form");
				break;
			default:
				arr.push("N/A;");
		}
		
		arr.push(ps.otfStylisticSets);
		
		// Underline options
		arr.push((ps.underlineWeight != -9999) ? ps.underlineWeight : "N/A");
		arr.push(ps.underlineType.name);
		arr.push((ps.underlineOffset != -9999) ? ps.underlineOffset  : "N/A");
		arr.push((ps.underlineColor.name != undefined) ? ps.underlineColor.name : ps.underlineColor);
		arr.push((ps.underlineTint != -1) ? ps.underlineTint : "N/A");
		arr.push(ps.underlineOverprint);
		arr.push((ps.underlineGapOverprint.name != undefined) ? ps.underlineGapOverprint.name : ps.underlineGapOverprint);
		arr.push((ps.underlineGapTint != -1) ? ps.underlineGapTint : "N/A");
		arr.push(ps.underlineGapOverprint);

		// Strikethrough options
		arr.push((ps.strikeThroughWeight != -9999) ? ps.strikeThroughWeight : "N/A");
		arr.push(ps.strikeThroughType.name);
		arr.push((ps.strikeThroughOffset != -9999) ? ps.strikeThroughOffset  : "N/A");
		arr.push((ps.strikeThroughColor.name != undefined) ? ps.strikeThroughColor.name : ps.strikeThroughColor);
		arr.push((ps.strikeThroughTint != -1) ? ps.strikeThroughTint : "N/A");
		arr.push(ps.strikeThroughOverprint);
		arr.push((ps.strikeThroughGapOverprint.name != undefined) ? ps.strikeThroughGapOverprint.name : ps.strikeThroughGapOverprint);
		arr.push((ps.strikeThroughGapTint != -1) ? ps.strikeThroughGapTint : "N/A");
		arr.push(ps.strikeThroughGapOverprint);

		// Export tagging - EPUB and HTML
		if (appVersion >= 7.5) { // StyleExportTagMap appeared in CS 5.5 - "Tag" and "Class" are available in in all versions
			if (ps.styleExportTagMaps.length == 0) {
				mapEpub = ps.styleExportTagMaps.add("EPUB", "", "", ""); // workaround to get "splitDocument" value
			}
			else if (ps.styleExportTagMaps.length == 1) {
				if (ps.styleExportTagMaps[0].exportType == "EPUB") {
					mapEpub = ps.styleExportTagMaps[0];
				}
				else if (ps.styleExportTagMaps[0].exportType == "PDF") {
					mapPdf = ps.styleExportTagMaps[0];
				}
			}
			else if (ps.styleExportTagMaps.length == 2) {
				if (ps.styleExportTagMaps[0].exportType == "EPUB") {
					mapEpub = ps.styleExportTagMaps[0];
				}
				else if (ps.styleExportTagMaps[0].exportType == "PDF") {
					mapPdf = ps.styleExportTagMaps[0];
				}
			
				if (ps.styleExportTagMaps[1].exportType == "EPUB") {
					mapEpub = ps.styleExportTagMaps[1];
				}
				else if (ps.styleExportTagMaps[1].exportType == "PDF") {
					mapPdf = ps.styleExportTagMaps[1];
				}
			}			
			
			// Tag
			if (mapEpub != null) {
				if (mapEpub.exportTag != "") {
					arr.push(mapEpub.exportTag);
				}
				else { // empty exportTag means it's set to defaults
					arr.push("[Automatic]");
				}
			}
			else {
				arr.push("N/A");
			}
		
			// Class
			if (mapEpub != null && mapEpub.exportClass != "") {
				arr.push(mapEpub.exportClass);
			}
			else {
				arr.push("N/A");
			}
		}

		if (appVersion >= 8 && appVersion < 9) { // "Split document (EPUB only)" was added in CS 6
			if (mapEpub != null) {
				arr.push(mapEpub.splitDocument); // Split document
			}
		}
		else if (appVersion >= 9 && appVersion < 10) { // "Emit CSS" was added in CC
			
			arr.push(mapEpub.splitDocument); // Split document
			arr.push(mapEpub.emitCss); // Emit CSS
		}
		else if (appVersion >= 9 && appVersion < 11) { // CC 2014 is a special case due to the bug in the object model: "splitDocument" and "emitCss" properties are bound to ParagraphStyle instead of StyleExportTagMap
			//debugger
			if (ps.hasOwnProperty("splitDocument")) { // check if the property is available just in case
				arr.push(ps.splitDocument); // Split document
			}
			else {
				arr.push("N/A");
			}
			if (ps.hasOwnProperty("emitCss")) {
				arr.push(ps.emitCss); // Emit CSS
			}
			else {
				arr.push("N/A");
			}
		}
	
		// PDF tag
		if (mapPdf != null && mapPdf.exportTag != "") {
			arr.push(mapPdf.exportTag);
		}
		else { // empty exportTag means it's set to defaults
			arr.push("[Automatic]");
		}
	
		mapEpub = mapPdf = null;
	
		str = arr.join(delimiter);
		str += "\r";
		txt += str;
	}
}
//--------------------------------------------------------------------------------------------------------------------------------------------------------
function GetParentGroups(style) {
	var item = style,
	str = "",
	arr = [];
	
	while (item.constructor.name != "Application") {
	
		if (item.constructor.name == "ParagraphStyleGroup") {
			arr.push(item.name);
		}
	
		item = item.parent;	
	}
	
	str = arr.join(" > ");
	if (str == "") str = "N/A";
	
	return str;
}
//--------------------------------------------------------------------------------------------------------------------------------------------------------
function GetNamesList(collection) {
	var namesList = [],
	arr = collection.everyItem().getElements();
	
	for (var i = 0; i < arr.length; i++) {
		namesList.push(arr[i].appliedCharacterStyle.name);
	}
	
	return namesList;
}
//--------------------------------------------------------------------------------------------------------------------------------------------------------
function WriteToFile(text) {
	
	if (set.extensionSel == 0) {
		extension = ".csv";
	}
	else if (set.extensionSel == 1) {
		extension = ".txt";
	}

	var file = new File("~/Desktop/" + scriptName + extension);
	
	if (File.fs == "Macintosh" && set.delimiterSel == 2) {
		file.encoding = "UTF-16";
	}
	else {
		file.encoding = "UTF-8";
	}

	file.open("w");
	file.write("\uFEFF" + text);
	file.close();
	if (set.openFile) file.execute();
}
//--------------------------------------------------------------------------------------------------------------------------------------------------------
function RoundWithDecimal(number, decimals) {
    var multiplier = Math.pow(10, decimals);
    return Math.round(number * multiplier) / multiplier;
}
//--------------------------------------------------------------------------------------------------------------------------------------------------------
function ProcessAllInddDocs(inddFiles) {
	for (var i = 0; i < inddFiles.length; i++) {
		inddFile = inddFiles[i];
		app.scriptPreferences.userInteractionLevel = UserInteractionLevels.NEVER_INTERACT;
		doc = app.open(inddFile);
		app.scriptPreferences.userInteractionLevel = UserInteractionLevels.INTERACT_WITH_ALL;
		ProcessDocument(doc, subFolders);
		doc.close(SaveOptions.YES);
	}
}
//--------------------------------------------------------------------------------------------------------------------------------------------------------
function GetFilesFromBook() {
	var bookContent, file,
	activeBook = app.activeBook,
	files = [];
	
	for (var i = 0; i < activeBook.bookContents.length; i++) {
		bookContent = activeBook.bookContents[i];
		if (bookContent.status != BookContentStatus.MISSING_DOCUMENT) {
			file = new File(bookContent.fullName);
			files.push(file);
		}
	}
	
	return files;
}
//--------------------------------------------------------------------------------------------------------------------------------------------------------
function CreateDialog() {
	GetDialogSettings();
	var w = new Window("dialog", scriptName);
	
	w.p1 = w.add("panel", undefined, "Process");
	w.p1.orientation = "column";
	w.p1.alignment = "fill";
	w.p1.alignChildren = "left";
	
	//Radio buttons
	w.p1.rb0 = w.p1.add("radiobutton", undefined, "active document");
	if (app.documents.length == 0) w.p1.rb0.enabled = false;
	w.p1.rb1 = w.p1.add("radiobutton", undefined, "all open documents");
	if (app.documents.length < 2) w.p1.rb1.enabled = false;
	w.p1.rb2 = w.p1.add("radiobutton", undefined, "active book");
	if (app.books.length == 0) w.p1.rb2.enabled = false;
	w.p1.rb3 = w.p1.add("radiobutton", undefined, "documents in the selected folder");
	w.p1.rb4 = w.p1.add("radiobutton", undefined, "documents in the selected folder and its subfolders");

	
	if (set.rbSel == 0 && app.documents.length != 0) {
		w.p1.rb0.value = true;
	}
	else if (set.rbSel == 1 && app.documents.length > 1) {
		w.p1.rb1.value = true;
	}
	else if (set.rbSel == 2 && app.books.length != 0) {
		w.p1.rb2.value = true;
	}
	else if (set.rbSel == 3) {
		w.p1.rb3.value = true;
	}
	else  {
		w.p1.rb4.value = true;
	}
	
	w.p2 = w.add("panel", undefined, "Settings");
	w.p2.orientation = "column";
	w.p2.alignChildren = "left";
	w.p2.alignment = "fill";
	
	w.p2.g1 =  w.p2.add("group", undefined, {orientation: "row"});
	w.p2.g1.st1 = w.p2.g1.add("statictext", undefined, "For column delimiters use:");
	w.p2.g1.ddl1 = w.p2.g1.add("dropdownlist", undefined, ["Semicolon \";\"", "Comma \",\"", "Tab"]);
	w.p2.g1.ddl1.selection = set.delimiterSel;
	
	w.p2.g2 =  w.p2.add("group", undefined, {orientation: "row"});
	w.p2.g2.st2 = w.p2.g2.add("statictext", undefined, "File extension:");
	w.p2.g2.ddl2 = w.p2.g2.add("dropdownlist", undefined, ["CSV", "TXT"]);
	w.p2.g2.ddl2.selection = set.extensionSel;
	
	w.p2.g3 =  w.p2.add("group", undefined, {orientation: "row"});
	w.p2.g3.cb = w.p2.g3.add("checkbox", undefined, "Open CSV/TXT file");
	w.p2.g3.cb.alignment = "left";
	w.p2.g3.cb.value = set.openFile;
	
	// Buttons
	w.buttons = w.add("group");
	w.buttons.orientation = "row";   
	w.buttons.alignment = "center";
	w.buttons.ok = w.buttons.add("button", undefined, "OK", {name:"ok" });
	w.buttons.cancel = w.buttons.add("button", undefined, "Cancel", {name:"cancel"});
	
	var showDialog = w.show();
	
	if (showDialog == 1) {
		if (w.p1.rb0.value == true) {
			set.rbSel = 0;
		}
		else if (w.p1.rb1.value == true) {
			set.rbSel = 1;
		}
		else if (w.p1.rb2.value == true) {
			set.rbSel = 2;
		}
		else if (w.p1.rb3.value == true) {
			set.rbSel = 3;
		}
		else if (w.p1.rb4.value == true) {
			set.rbSel = 4;
		}
		
		set.delimiterSel = w.p2.g1.ddl1.selection.index;
		set.extensionSel = w.p2.g2.ddl2.selection.index;
		set.openFile = w.p2.g3.cb.value;
		
		app.insertLabel("Kas_" + scriptName, set.toSource());
		
		Main();
	}
}
//--------------------------------------------------------------------------------------------------------------------------------------------------------
function GetDialogSettings() {
	set = eval(app.extractLabel("Kas_" + scriptName));
	if (set == undefined) {
		set = { rbSel: 0, delimiterSel: 0, extensionSel: 0, openFile: true };
	}
	return set;
}
//--------------------------------------------------------------------------------------------------------------------------------------------------------
function GetAllInddFiles(folder) {
	var files = [],
	fileList = folder.getFiles(),
	i, file;
	
	for (i = 0; i < fileList.length; i++) {
		file = fileList[i];
		if (file instanceof Folder) {
			files = files.concat(GetAllInddFiles(file));
		}
		else if (file instanceof File && file.name.match(/\.indd$/i)) {
			files.push(file);
		}
	}

	return files;
}
//--------------------------------------------------------------------------------------------------------------------------------------------------------
function GetSubFolders(folder) {
	var file,
	fileList = folder.getFiles();
	
	for (var i = 0; i < fileList.length; i++) {
		file = fileList[i];
		
		if (file instanceof Folder) {
			subFolders.push(file.fsName);
			GetSubFolders(file);
		}
	}
}
//--------------------------------------------------------------------------------------------------------------------------------------------------------
function ErrorExit(error, icon) {
	alert(error, scriptName, icon);
	exit();
}
//--------------------------------------------------------------------------------------------------------------------------------------------------------
function MakeHeader() {
	var header_1 = [],
	header_2 = [];
	
	if (appVersion > 6) {
		header_1[2] = "General";
		header_1[5] = "Basic character formats";
		header_1[17] = "Advanced character formats";
		header_1[22] = "Indents and spacing";
		header_1[32] = "Tabs";
		header_1[33] = "Paragraph rules";	
		header_1[60] = "Keep options";
		header_1[67] = "Hyphenation";
		header_1[76] = "Justification";
		header_1[82] = "Span columns";
		header_1[88] = "Drop caps and nested styles";
		header_1[95] = "GREP style";
		header_1[96] = "Bullets and numbering";
		header_1[102] = "Character color";
		header_1[105] = "OpenType features";
		header_1[115] = "Underline features";
		header_1[124] = "Strikethrough features";
		header_1[133] = "Export tagging - EPUB and HTML";
	}
	else {
		header_1[2] = "General";
		header_1[5] = "Basic character formats";
		header_1[17] = "Advanced character formats";
		header_1[22] = "Indents and spacing";
		header_1[32] = "Tabs";
		header_1[33] = "Paragraph rules";
		header_1[60] = "Keep options";
		header_1[66] = "Hyphenation";
		header_1[75] = "Justification";
		header_1[86] = "Drop caps and nested styles";
		header_1[87] = "Bullets and numbering";
		header_1[93] = "Character color";
		header_1[96] = "OpenType features";
		header_1[106] = "Underline features";
		header_1[115] = "Strikethrough features";
	}
	
	if (set.rbSel == 0) { // Active doc -- remove doc name
		header_1.shift();
	}
	else {
		header_2.push("Document name");
	}
	
	header_2 = header_2.concat(["Group", "Style name", "Based on", "Next style",
		"Font family", "Font style", "Font size", "Leading", "Kerning", "Tracking", "Case", "Position", "Underline", "Ligatures", "No break", "Strikethrough",
		"Horizontal scale", "Vertical scale", "Baseline shift", "Skew", "Language",
		"Alignment", "Balance ragged lines", "Ignore optical margin", "Left indent", "Right indent", "First line indent", "Last line indent", "Space before", "Space after", "Align to grid", 
		"Alignment\\Position\\Leader\\Align on",
		"Rule above On/Off", "Weight", "Type", "Color", "Tint", "Overprint stroke", "Gap color", "Gap tint", "Overprint gap", "Width", "Offset", "Left indent", "Right indent", "Keep in frame",
		"Rule below On/Off", "Weight", "Type", "Color", "Tint", "Overprint stroke", "Gap color", "Gap tint", "Overprint gap", "Width", "Offset", "Left indent", "Right indent", ]);
					
	if (appVersion > 6) header_2.push("Keep with previous");
					
	header_2 = header_2.concat(["Keep with next lines", "Keep lines together", "All lines in paragraph", "Start ... lines", "End ... lines", "Start paragraph", 
		"Hyphenate", "Words with at least", 
		"After first", "Before last", "Hyphen limit", "Hyphenation zone", "Hyphenate capitalized words", 
		"Hyphenate last word", "Hyphenate across columns", 
		"Word spacing Min/Desired/Max", "LetterSpacing Min/Desired/Max", "Glyph scaling Min/Desired/Max", "Auto Leading", "Single word justification", "Composer"]);
					
	if (appVersion > 6) header_2 = header_2.concat(["Paragraph layout", "Span ... columns/Sub-columns", "Space before span/split", "Space after span/split", "Inside gutter", "Outside gutter"]);
	
	header_2 = header_2.concat(["Lines", "Characters", "Character style", "Align left edge", "Scale for descenders", "Nested styles"]);
	
	if (appVersion > 6) header_2 = header_2.concat(["Nested line styles", "GREP style"]);
					
	header_2 = header_2.concat(["List type", "Bullet character", "Bullets font", "Text after", "Character style", "Alignment",
		"Character color", "Tint", "Overprint fill",
		"Titling alternates", "Contextual alternates", "Swash alternates", "Ordinals", "Descretionary ligatures", "Fractions", "Slashed zero", "Figure style", "Positional form", "Stylistic sets",
		"Weight", "Type", "Offset", "Color", "Tint", "Overprint stroke", "Gap color", "Gap tint", "Overprint gap",
		"Weight", "Type", "Offset", "Color", "Tint", "Overprint stroke", "Gap color", "Gap tint", "Overprint gap"]);
					
	if (appVersion >= 7.5) {
		header_2 = header_2.concat(["Epub tag", "Class"]);
		
		if (appVersion >= 8 && appVersion < 9) {
			header_2 = header_2.concat(["Split document"]);
		}
	
		if (appVersion >= 9) {
			header_2 = header_2.concat(["Split document", "Emit CSS"]);
		}
	}

	header_2 = header_2.concat(["Pdf tag"]);
	
	txt += header_1.join(delimiter) + "\r";
	txt += header_2.join(delimiter) + "\r";
}
//--------------------------------------------------------------------------------------------------------------------------------------------------------