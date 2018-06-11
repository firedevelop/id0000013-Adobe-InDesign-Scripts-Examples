/* paragraphStyleChanger.jsx
Stephan Möbius (stephan.moebius@gmail.com), last edited March, 2017

Runs in Indesign CS4 to CC 2017. Most tested in CS6.
____________
DESCRIPTION 
Use this script to comfortably find and replace applied paragraph styles, especially conditional combinations(!) of paragraph styles in quite a variety of selections. I use it in early design phase to test different typographical layouts.
_________
EXAMPLES
- In selected text change each paragraph style that's "P1" to "P2" (quicker than using indesigns find/change) ;)
- In the stories of the selected textframes change each "Headline1" followed by "Subhead1" to "Headline2" followed by "Subhead 2". Quickly revert this by running the script again with the "autoReverseLastStyles" option. 
__________
NOTES
Original script for starting point was: "Fix paragraph style combinations" by Thomas Silkjær, 2009. https://forums.adobe.com/thread/2113439

The script will display the selection it applies to: 
- the active document (if nothing is selected)
- the active layer (if nothing is selected, settings option)
- the story if an insertion point or textframe is selected
- the stories of texts on paths (of textframes, lines, rectangle, polygons....)
- the stories of  multiple selected items, like textframes, groups, or groups of groups (recursive)
- the paragraphs of selected text 
- the paragraphs of selected cells or a selected table (select the table, not the container!)
(To clarify: it will _NOT_ do the pragraphs of a single textframe from a story, but do the complete linked parent story. If you only want to change a portion select the column or some paragraphs instead.)
________________
IMPORTANT NOTES 
Local character overrides, i.e textstyle ranges are kept, but overrides of paragraph styles are lost when you apply new paragraph styles - just as is always the case in inDesign by default. The script makes no effort to back up your overrides, when it applies styles.

You will not be able to create alternating patterns of paragraph styles from uniformity, i.e in texts that had no alternating pattern to begin with.

A nasty use case you should understand is this: Imagine "If -this- paragraph's style is [A] followed by [-ANY-Style-] THEN change this paragraph to [X] AND its next paragraph to [Y]." ... This would result in paragraphs to be changed twice – for example underway in A A A B --> X Y Y Y.  The script prevents paragraphs beeing changed twice by prefering to change _consecutive_ paragraphs and ignoring the other match. Hence the result may not seem logical. That's when the report says it had more matches than changes.

ParagraphStyleChanger won't find nor change blank line last paragraphs. To my knowledge and level of understanding, "blank line" end paragraphs at the end of a story consisting of a single carriage return DO NOT COUNT as a valid paragraph. Note that they won't count as 'ANY STYLE' ! This is irritating since in InDesign you're able to place your cursor in it and give it a paragraph style ... but in scripts we can't work with them.

Beware: Styles from preferences that are listed as [-NOT FOUND-] (i.e. styles that have been renamed, moved to another group or deleted since last run) are treated logically like [-ANY STYLE-].

About settings: The order in which the dropdowns get loaded are: FIRST load last used styles (if so set). THEN Auto-reverse styles (if so set) AT LAST insert retrieved current selections styles into -Find/Next- dropddowns (if so set). The result can be confusing if you use a mix of these settings. 
Using the "remove settings" option will delete the script label from the document and it will open with default preferences next time.
___________
CHANGELOG
v1.11 - March 2017 - Little bugfix and more usefull way to preload styles into the dialog from selected paragraphs: You need to select two paragraphs if you want to preload "follwed by"-style.

v1.1 - March 2017 - Now works with nested style groups (recursive, thanks to Peter Kahrel), added the ANY-style-option to _all_ find and change fields to give more logical combinations, more cleverly tell you what paragraphs its working on, works with a selection of multiple page Items, works with more sorts of pageItems and groups (recursive), optionally detects the current and next style from some selections, undoes in a single step, list styles in preferences that are missing (instead of reverting to defaults), works on selected cells and selected tables, comes in two languages (english & german).

to v.1.0 - May 2013 - A beefed up version of Thomas Silkjaer's script (Thanks Dude!), changes made to run in CS6,  to include styles in style-groups (not nesting), to save last settings, to give a report of num changed, and to add an -ANY-Style option for the follow up paragraphs.
_____________
IDEAS
- Find and match default styles in different language versions: "Basic paragraph" = "Einf. Abs.", "Kein Absatzformat" = "No paragraph style"
- Do something to not loose local paragraph styles overrides when changing paragraph styles.
- New option in Find/Change-Second-Paragraph: [-Followed by it's Next Style-]  &  [-Followed by -It's CHAIN of next Styles-]
- RequiresUI: Save last win-position.
- RequiresUI: Button: Load Last Settings (again)
- RequiresUI: Button: Get current paragraph styles
- RequiresUI: Button: Try logical reverse (some combinations are not possible to reverse ... but some are!)
- RequiresUI: Help-Page
- RequiresUI: Instant Mode !!! - modeless Palette with live switching of styles.
- v.2.0 : have +/- Buttons to add or remove any number of "Followed by"-fields, to create unlimited chains of style conditions AND style change combinations. 
- v.2.0 : Add A Dialog to Save/Load/Rename user presets of find/change-chains.
*/


// #target indesign

var ScriptName = "paragraphStyleChanger";
var ScriptVersion = "1.11";

// Edit the strings to your liking, ... but you better "removePrefs:true" in the settings for one go afterwards
var nameOfAnyStyle = localize({en: "[Any Style]", de: "[-Beliebig-]"});
var nameOfDontChange = localize({en: "[-Don't Change-]", de: "[-Nicht ändern-]"});
var markOfNotFound = localize({en: "(Missing) ", de: "(Nicht gefunden) "});
var _logging = false; // set true to log some information to javascript console

var _prefs = { // fallback default preferences
            dds: {
                ffp:nameOfAnyStyle, 
                fsp:nameOfAnyStyle, 
                cfp:nameOfDontChange, 
                csp:nameOfDontChange
            },
            removePrefs: false, // don't set this to true here, or it will remove  the script label on every run... better use the settings dialog and remove prefs only once.
            nextStartCurrentFindStyleCombo: false,
            nextStartWithLastStyles: true,
            autoReverseLastStyleCombos: true,
            useLayerInsteadOfDoc: false,
            silentMode: false
        };


function main(){
    var ad, s, cs, ns;
    var csn = "", nsn = "";
    var rep = {"matches": undefined, "changed": undefined};
    var p = {"sel": undefined, "desc": ""};
    app.scriptPreferences.userInteractionLevel = UserInteractionLevels.interactWithAll;
    Log("START: " + new Date());
    if (app.documents.length == 0) alertAndExit(localize({en: "No documents are open.", de: "Kein Dokument geöffnet."}), true); 
    ad = app.activeDocument;
    s = app.selection;
    (_prefs.removePrefs) ? (ad.insertLabel(ScriptName + ScriptVersion, "")) : (_prefs = loadPrefs(ad,s));
    p = getParas(s,ad);
    if (!p.sel) alertAndExit(p.desc, true);
    if (!myDisplayDialog(ad, p.desc)) alertAndExit("", true);
    // Report
    app.doScript("rep = paragraphStyleChanger(ad, p.sel); (_prefs.removePrefs) ? (ad.insertLabel(ScriptName + ScriptVersion, \"\")) : (savePrefs(ad));", ScriptLanguage.JAVASCRIPT, [], UndoModes.ENTIRE_SCRIPT, "paragraphStyleChanger");
    switch (rep.changed) {
        case -2: break;  // Still in default settings, no selections made. quit quietly.
        case -1: alertAndExit(localize({en: "Nothing needs to be done with these settings.", de: "Es ist nichts zu tun bei diesen Einstellungen."}), false); break;
        case 0: 
            if (rep.matches == 0) {
                alertAndExit(localize({en: "No matches found.", de: "Keine zutreffenden Stellen."}), false);
           }
           else {
               alertAndExit(rep.matches + ((rep.matches == 1) ? (localize({en: " match. ", de: " Treffer. "})) : (localize({en: " matches. ", de: " Treffer. "}))) + localize({en: "But the desired formats didn't need to be applied.", de: " Aber das gewünschte Format brauchte nicht zugewiesen werden."}), false);
           }
           break;
        default: alertAndExit(rep.matches +  ((rep.matches == 1) ? (localize({en: " match. ", de: " Treffer. "})) : (localize({en: " matches. ", de: " Treffer. "}))) + rep.changed + ((rep.changed == 1) ? (localize({en: " paragraph changed.", de: " Absatz geändert"})) : (localize({en: " paragraphs changed", de: " Absätze geändert"}))),  false)
	}
    Log("DONE\r- -"); 
}


function getParas(s, ad) { 
	// Returns a collection of paragraphs from the selection (s) and a descriptive string (or an error-exit message)
	var scope;
    var scope_n = "";
	var desc = "";
    var s0 = "";
	var sts = []; // an array of stories
    var ps = []; // an array of  paragraphs
    if (s.length == 0) { // no selection ? then do all paras of layer or document 
        if (_prefs.useLayerInsteadOfDoc) {
            scope = ad.activeLayer.allPageItems;
            scope_n = localize({en: "Layer", de: "Ebene"})
        }
        else {
            scope = ad.allPageItems;
            scope_n = localize({en: "Document", de: "Dokument"})
        }
        sts = GetStoriesSelection([],scope);
        for (i=0; i < sts.length; i++) {
            for (j=0; j < sts[i].paragraphs.length; j++) {
                ps.push(sts[i].paragraphs[j]);
            }
        }
        scope = ps.slice();
        if (scope.length > 0) {
            desc = localize({en: "none --> " + scope_n + " (", de: "keine --> " + scope_n +  " ("}) + sts.length + ((sts.length == 1) ? (localize({en: " Story, ", de: " Textfluss, "})) : (localize({en: " Stories, ", de: " Textflüsse, "}))) + scope.length + ((scope.length == 1) ? (localize({en: " paragraph)", de: " Absatz)"})) : (localize({en: " paragraphs)", de: " Absätze)"}))); 
        }
        else {
            scope = false; // returning scope false will lead to the script stopping with the alert:
            desc = localize({en: "This " + scope_n + " document has no paragraphs.", de: scope_n + " hat keine Absätze."});
        }
	} // end if s.length==0
	else { // i.e. if s.length <> 0
        s0 = s[0].constructor.name;
        switch (s0) {
            case "Character":   
            case "Word":
            case "TextStyleRange":     
            case "Line":     
            case "Paragraph": 
            case "Text":
            case "TextColumn":
            case "Cell":
                scope = s[0].paragraphs;
                desc = s0 + " --> " + scope.length + ((scope.length == 1) ? (localize({en: " paragraph)", de: " Absatz"})) : (localize({en: " paragraphs)", de: " Absätze"})));
                break;
            case "InsertionPoint":
                if (s[0].parentStory.paragraphs.length > 0) {
                    scope = s[0].parentStory.paragraphs;
                    desc = s0 +  localize({en: " --> Story (", de: " --> Textfluss ("})  + scope.length + ((scope.length == 1) ? (localize({en: " paragraph)", de: " Absatz)"})) : (localize({en: " paragraphs)", de: " Absätze)"})));
                } else {
                    desc = localize({en: "This textframe/story has no paragraphs.", de: "Dieser Textrahmen/Textfluss hat keine Absätze."});
                }				
                break;
            case "Table":
                sts = s[0].cells;
                for (i=0; i < sts.length; i++) {
                    for (j=0; j < sts[i].paragraphs.length; j++) {
                        ps.push(sts[i].paragraphs[j]);
                    }
                }
                if (ps.length > 0) {
                    scope = ps.slice();
                    desc = localize({en: "Table --> ", de: "Tabelle --> "}) + sts.length + ((sts.length == 1) ? (localize({en: " Cell (", de: " Zelle ("})) : (localize({en: " Cells (", de: " Zellen ("}))) + scope.length + ((scope.length == 1) ? (localize({en: " paragraph)", de: " Absatz)"})) : (localize({en: " paragraphs)", de: " Absätze)"}))); 
                } else {
                    desc = localize({en: "This table contains no paragraphs.", de: "Diese Tabelle enthält keine Absätze."});
                }    
            break;
            case "Group":
            case "GraphicLine":
            case "Rectangle":
            case "Oval":
            case "Polygon":
            case "TextFrame":
                sts = GetStoriesSelection([],s);
                for (i=0; i < sts.length; i++) {
                    for (j=0; j < sts[i].paragraphs.length; j++) {
                        ps.push(sts[i].paragraphs[j]);
                    }
                }
                if (ps.length > 0) {
                    scope = ps.slice();
                    if (s.length == 1) {
                        switch (s0) {
                            case "Group":  desc =  localize({en: "Group --> ", de: "Gruppe --> "}); break;
                            case "GraphicLine": desc =  localize({en: "GraphicLine --> ", de: "Linie mit Text --> "}); break;
                            case "Rectangle": desc =  localize({en: "Rectangle --> ", de: "Rechteck mit Text --> "}); break;
                            case "Oval": desc =  localize({en: "Oval --> ", de: "Oval mit Text --> "}); break;
                            case "Polygon": desc =  localize({en: "Polygon --> ", de: "Polygon mit Text --> "}); break;
                            // case  "TextFrame": desc = ""; break; // It will tell that it's got a story below .. so saying "textframe" is kinda redundant.
                            default: desc = "";
                        }
                    } 
                    else {
                        desc = localize({en: "Several objects --> ", de: "Mehrere Objekte --> "}); 
                    }
                    desc = desc + sts.length + ((sts.length == 1) ? (localize({en: " Story (", de: " Textfluss ("})) : (localize({en: " Stories (", de: " Textflüsse ("}))) + scope.length + ((scope.length == 1) ? (localize({en: " paragraph)", de: " Absatz)"})) : (localize({en: " paragraphs)", de: " Absätze)"}))); 
                } else {
                    desc = localize({en: "This selection contains no paragraphs.", de: "Diese Auswahl enthält keine Absätze."});
                }
                break;
            default:
                desc = "_" + s0 + localize({en: "_ selected. That's something i can't work with. Sorry.", de: "_ gewählt. Damit kann das Skript nicht arbeiten. Sorry."});
        } // end switch	
	} // end else (i.e. if s.length <> 0)
	return {"sel": scope, "desc": desc}
}


function myDisplayDialog(ad, desc){
    var dlg_main, dlg_set;
    var aps = ad.allParagraphStyles;
    var styleArray = [];
    var styleArrayMarked = []; // style list for dropdowns
    var styleArrayMarkedC= []; // style list for the change-to-dropdowns
    var s = "";
    var dd_indexes = []; // selected items in the dropdowns
    var i = 0;
    var j = 0;
    var doRun = false;
    // create a list of all paragraph styles
    styleArray = getNestedListOfShortendedStyles(aps);
    styleArray.splice(0,0,nameOfAnyStyle);  // unshift/add "ANY STYLE" and "DON'T CHANGE" option to the front
    // see if last used style names from preferences are in the list.
    // if not, add them to the start of the style list, also store the number of missing styles
    for (dd in _prefs.dds) {
        s = _prefs.dds[dd]
        if (s != nameOfAnyStyle && s != nameOfDontChange && !styleArray.contains(_prefs.dds[dd])) {
            styleArray.splice(0,0,_prefs.dds[dd]);
            i++;
        }
	}    
	// collecting indexes of chosen styles to select them in the dropdownboxes below
    // note that "don't change"-selections are stored as [Any style]-string in the preferences, thats why i have to check for nameOfAnyStyle instead if nameofDontChange...
	for (dd in _prefs.dds) { 
        dd_indexes.push(styleArray.indexOf((_prefs.dds[dd] == nameOfDontChange) ? (nameOfAnyStyle) : (_prefs.dds[dd])));
    } 
	// create a copy of the styleArray where we mark the missing styles for the dropdowns ( but the _unmarked_ styleArray will be returned back to _prefs later on)
	styleArrayMarked = styleArray.slice();
	for (j=i-1; j >= 0; j--) {styleArrayMarked[j] = markOfNotFound + styleArrayMarked[j];}
    // create a copy of the styleArrayMarked in which the "ANY-STYLE" is renamed to the "DONT-CHANGE"
    styleArrayMarkedC = styleArrayMarked.slice();
    styleArrayMarkedC.splice(i,1,nameOfDontChange); 
    // creating main dialog
    dlg_main = app.dialogs.add({name:ScriptName + " " + ScriptVersion});
    with(dlg_main.dialogColumns.add()){
        with(dialogRows.add()){
          staticTexts.add({staticLabel:localize({en: "Selection: ", de: "Auswahl: "})+ desc});
        }
        with(dialogRows.add()){
          staticTexts.add({staticLabel:localize({en: "Find style combination:", de: "Finde Formatkombination:"})});
        }
        with(borderPanels.add()){
          var dd_ffp = dropdowns.add({stringList:styleArrayMarked, selectedIndex:dd_indexes[0]});
          staticTexts.add({staticLabel:localize({en: "followed by", de: "gefolgt von"})});
          var dd_fsp = dropdowns.add({stringList:styleArrayMarked, selectedIndex:dd_indexes[1]});
        }
        with(dialogRows.add()){
          staticTexts.add({staticLabel:localize({en: "Change to:", de: "Ändere in:"})});
        }
        with(borderPanels.add()){
          var dd_cfp = dropdowns.add({stringList:styleArrayMarkedC, selectedIndex:dd_indexes[2]});
          staticTexts.add({staticLabel:localize({en: "followed by", de: "gefolgt von"})});
          var dd_csp = dropdowns.add({stringList:styleArrayMarkedC, selectedIndex:dd_indexes[3]});
        }
        with(dialogRows.add()){
          var cb_settings = checkboxControls.add({staticLabel: localize({en: "Open settings before run", de: "Einstellungen vor dem Ausführen öffnen"}), checkedState: false});
        }
    }
    // displaying dialog
    doRun = dlg_main.show();
    if (doRun == true){ // user hit OK ...
        if (cb_settings.checkedState) { // but if user checked "Open Settings" ...
            // create a settings dialog
            dlg_set = app.dialogs.add({name:ScriptName + " " + ScriptVersion + localize({en: " – Settings", de: " – Einstellungen"}), canCancel:false});
            with(dlg_set.dialogColumns.add()){
               var cb1 = checkboxControls.add({staticLabel: localize({en: "Remove preferences (Document script label)", de: "Einstellungen entfernen (Dokument Sktipt Etikett)"}), checkedState: _prefs.removePrefs});
                var cb2 = checkboxControls.add({staticLabel: localize({en: "Start with styles from last run", de: "Starte mit Formaten des letzten Durchgangs"}), checkedState: _prefs.nextStartWithLastStyles});
                var cb3 = checkboxControls.add({staticLabel: localize({en: "Auto-reverse last used styles", de: "Automatisch letzten Durchgang umkehren"}), checkedState: _prefs.autoReverseLastStyleCombos});
                var cb4 = checkboxControls.add({staticLabel: localize({en: "Start with find/findNext style from current selection", de: "Starte mit Finde-/FindeFolge aus aktueller Selektion"}), checkedState: _prefs.nextStartCurrentFindStyleCombo});
                var cb5 = checkboxControls.add({staticLabel: localize({en: "Silent mode (no alert boxes)", de: "Stiller Modus (Keine Meldungen)"}), checkedState: _prefs.silentMode});
                var cb6 = checkboxControls.add({staticLabel: localize({en: "Use active layer instead of document(if no selection)", de: "Arbeite auf aktueller Ebene anstelle Dokument (wenn Auswahl leer)"}), checkedState: _prefs.useLayerInsteadOfDoc});
            }
            dlg_set.show(); // it's a cancel-less dialog
            with (_prefs) { // change global _prefs
                removePrefs = cb1.checkedState;
                nextStartWithLastStyles = cb2.checkedState;
                autoReverseLastStyleCombos = cb3.checkedState;
                nextStartCurrentFindStyleCombo = cb4.checkedState;
                silentMode = cb5.checkedState;
                useLayerInsteadOfDoc = cb6.checkedState;
            }; 
            dlg_set.destroy();
        }
        with (_prefs) { // setting the preferences to the style choices in the dropdownboxes
            dds.ffp = styleArray[dd_ffp.selectedIndex];
            dds.fsp = styleArray[dd_fsp.selectedIndex];
            dds.cfp = styleArray[dd_cfp.selectedIndex]; 
            dds.csp = styleArray[dd_csp.selectedIndex];
        }; 
        return true;
    }
    else{ // user hit "Cancel"
        dlg_main.destroy();
        return false;
    }
}


function paragraphStyleChanger(ad, ps) {
    // expects document & a collection of paragraphs : returns number of matches where the find rules applied and number of changed paragraphs
    var aps = ad.allParagraphStyles;
    var styleArray = [];
    var dolist_fp = []; // will collect first paragraphs to be changed
    var dolist_sp = []; // will collect second paragraphs to be changed
    var blocklist = []; // a temporary list of paragraph to prevent them beeing changed twice
    var ffp, fsp, cfp, csp, this_p, next_p;
    var num_matches = 0;
    var i = 0;
    var this_p_isLast = false;
    // we create a list of all paragraph styles again with nested/foldered styles and  shortend names like we did for the dropdown-lists, so we can match the selected styles from prefs against it
    styleArray = getNestedListOfShortendedStyles(aps);
	// indexOf() will return -1 for styles he can't find, i.e. [-ANY STYLE-] or ...[-NOT FOUND-] and this will lead to "undefined" ffp, fsp, which we use below
	// fsp = find_second_paragraph; csp = change_second_paragraph; ffp = find_first_paragraph; cfp = change_first_paragraph;
    ffp = aps[styleArray.indexOf(_prefs.dds.ffp)];
    fsp = aps[styleArray.indexOf(_prefs.dds.fsp)]; 
    cfp = aps[styleArray.indexOf(_prefs.dds.cfp)]; 
    csp = aps[styleArray.indexOf(_prefs.dds.csp)];
    // If still in default settings, do nothing and return -2 to report nothing
    if (!ffp && !fsp && !cfp && !csp) {
      return {"matches": -2, "changed": -2};
    }
    // also intercept useless user settings
    if ((ffp == cfp && !csp) || (fsp == csp && !cfp) || (!cfp && !csp) || (ffp == cfp && fsp == csp)) {
      return {"matches": -1, "changed": -1};
    }
    // here is the logic :)
    for (var i = 0; i < ps.length; i++) {
        this_p = ps[i];
        this_p_isLast = this_p == this_p.parentStory.paragraphs.lastItem();
        if(!this_p_isLast) next_p = this_p.paragraphs[-1].insertionPoints[-1].paragraphs[0];
        // 1 - If _this_  paragraphs style is A and followed by ANY/NOT FOUND style THEN change _this_ para.
        if (ffp && !fsp && cfp && !csp) {
            if (this_p.appliedParagraphStyle == ffp) {
                num_matches += 1;
                dolist_fp.push(this_p);
            } 
        }
        // 2 - If _this_  paragraphs style is A and followed by ANY/NOT FOUND style THEN change _next_  para.
        if (ffp && !fsp && !cfp && csp) {
            if (this_p.appliedParagraphStyle == ffp) {
                num_matches += 1;
                 if(!this_p_isLast && next_p.appliedParagraphStyle != csp) dolist_sp.push(next_p);
            } 
        }
        // 3  - If _this_ paragraphs style is A and followed by ANY/NOT FOUND style THEN change _this_  para AND _next_  para.
        // this is the nastiest case and may result in paragraphs beeing changed twice - we have to prevent that.
        // The script is now set to prefer assigning styles to _consecutive_ paragraphs 
        // thus: A A A B --> X Y Y Y
        if (ffp && !fsp && cfp && csp) {
          if (this_p.appliedParagraphStyle == ffp) {
                num_matches += 1;
                // don't add to changelist if its unnessary / don't change A into A, also dont change if its already on the changelist for second paras
                if(!blocklist.contains(this_p) && this_p.appliedParagraphStyle != cfp) dolist_fp.push(this_p);
                if(!this_p_isLast && next_p.appliedParagraphStyle != csp) { 
                    dolist_sp.push(next_p);
                    blocklist.push(next_p);
                }
          } 
        }
        // 4 - If _this_ paragraphs style is ANY/NOT FOUND and _next_ paragraphs style is B THEN change _this_ para.
        if (!ffp && fsp && cfp && !csp && !this_p_isLast) {
            if (next_p.appliedParagraphStyle == fsp) {
                num_matches += 1;
                 if(this_p.appliedParagraphStyle != cfp) dolist_fp.push(this_p);
            } 
        }
        // 5 - If _this_ paragraphs style is ANY/NOT FOUND and _next_ paragraphs style is B THEN change _next_ para.
        if (!ffp && fsp && !cfp && csp && !this_p_isLast) {
            if (next_p.appliedParagraphStyle == fsp) {
                num_matches += 1;
                dolist_sp.push(next_p);
            } 
        }
        // 6 - If _this_ paragraphs style is ANY/NOT FOUND and _next_ paragraphs style is B THEN change _this_ AND _next_ para.
        if (!ffp && fsp && cfp && csp && !this_p_isLast) {
            if (next_p.appliedParagraphStyle == fsp) {
                num_matches += 1;
                if (!blocklist.contains(this_p) && this_p.appliedParagraphStyle != cfp) dolist_fp.push(this_p); 
                if (next_p.appliedParagraphStyle != csp) dolist_sp.push(next_p);
                blocklist.push(next_p);
            } 
        }
        // 7 - If _this_ paragraphs style is A and _next_ paragraphs style is B THEN change _this_ para.
        if (ffp && fsp && cfp && !csp && !this_p_isLast) {
            if (this_p.appliedParagraphStyle == ffp && next_p.appliedParagraphStyle == fsp) {
                num_matches += 1;
                dolist_fp.push(this_p);
            } 
        }
        // 8 - If _this_ paragraphs style is A and _next_ paragraphs style is B THEN change _next_ para.
        if (ffp && fsp && !cfp && csp && !this_p_isLast) {
            if (this_p.appliedParagraphStyle == ffp && next_p.appliedParagraphStyle == fsp) {
                num_matches += 1;
                dolist_sp.push(next_p);
            } 
        }
        // 9 - If _this_ paragraphs style is A and _next_ paragraphs style is B THEN change _this_ AND _next_ para.
        if (ffp && fsp && cfp && csp && !this_p_isLast) {
            if (this_p.appliedParagraphStyle == ffp && next_p.appliedParagraphStyle == fsp) {
                num_matches += 1;
                if (!blocklist.contains(this_p) && this_p.appliedParagraphStyle != cfp) dolist_fp.push(this_p); 
                if (next_p.appliedParagraphStyle != csp) dolist_sp.push(next_p);
                blocklist.push(next_p);
			} 
        }
         // 10 - If _this_ AND _next_ paragraphs style is ANY/NOTFOUND THEN change _this_ para.
        if (!ffp && !fsp && cfp && !csp) {
            num_matches += 1;
            if (this_p.appliedParagraphStyle != cfp) dolist_fp.push(this_p); 
        }
        // 11 - If _this_ AND _next_ paragraphs style is ANY/NOTFOUND THEN change _next_ para.
        if (!ffp && !fsp && !cfp && csp && !this_p_isLast ) {
            num_matches += 1;
            if (next_p.appliedParagraphStyle != csp) dolist_sp.push(next_p); 
        }
        // 12 - If _this_ AND _next_ paragraphs style is ANY/NOTFOUND THEN change _this_ AND _next_ para.
        if (!ffp && !fsp && cfp && csp && !this_p_isLast) {
            num_matches += 1;
            if (!blocklist.contains(this_p) && this_p.appliedParagraphStyle != cfp) dolist_fp.push(this_p); 
            if (next_p.appliedParagraphStyle != csp) dolist_sp.push(next_p);
            blocklist.push(next_p);
        }
    } // end For (through all paragraphs)
    // apply "changeTo"-paragraph styles
    for (i = 0; i < dolist_fp.length; i++) {
        dolist_fp[i].applyParagraphStyle(cfp, false);
    }
    for (i = 0; i < dolist_sp.length; i++) {
        dolist_sp[i].applyParagraphStyle(csp, false);
    }
    // returning number of changed paragraphs
    return {"matches": num_matches, "changed": dolist_fp.length + dolist_sp.length};
}


// ---------------------UTILITY FUNCTONS ---------------------------
function alertAndExit(a, is_error) {
	if (_prefs.silentMode) { 
        Log(a);
    }
    else {
        if (a !="")  alert(a, ScriptName, is_error);
    }
	if (is_error) {
		Log("EXIT\r- -"); 
		exit();
	}
}

function Log(a) {
	if (_logging && a != "") $.write(a + "\u000D");
}

function loadPrefs(ad,s) {
    var ffp_temp, fsp_temp;
    var cp; // current paragraph
    var cs, ns; // current style & next style
    var csn, nsn; // current style & next style name
    var _temp = eval(ad.extractLabel(ScriptName + ScriptVersion)) || _prefs; // load documents preferences, else defaults
    Log("LOADED: " + _temp.toSource());
    if (!_temp.nextStartWithLastStyles)  {
        _temp.dds = _prefs.dds; // Reverting dropdowns to default ANY-STYLE
    };
    if (_temp.autoReverseLastStyleCombos) {
        with (_temp.dds) {
            ffp_temp = ffp; ffp = cfp; cfp = ffp_temp;
            fsp_temp = fsp; fsp = csp; csp = fsp_temp;
        }
    }
    if (_temp.nextStartCurrentFindStyleCombo && s.length == 1) {
        switch (s[0].constructor.name) {
            case "Character":   
            case "Word":
            case "TextStyleRange":     
            case "Line":     
            case "Paragraph":
            case "Text":
            case "TextColumn":
            case "Cell":
            case "InsertionPoint": 
                cp = s[0];
                break;
            case "TextFrame":
                cp = s[0].parentStory;
                break;
            case "Rectangle":
            case "GraphicLine":
            case "Oval":
            case "Polygon":
                cp = s[0].textPaths[0];
                break;
            default: 
                if (!_temp.silentMode) alertAndExit(localize({en: "Currently selected style indeterminable.", de: "Kann gewählte Formate nicht erkennen."}), false);
        } // end switch
        if (cp) {
            cs = cp.paragraphs[0].appliedParagraphStyle;
            csn = getNestingPath(cs, cs.name.shorten(20)); // current paragraphs style name (Nested & Shortened)
            _temp.dds.ffp = csn;  
             if (cp.paragraphs[0] !== cp.paragraphs.lastItem() && cp.paragraphs.length > 1) {
                ns = cp.paragraphs[0].paragraphs[-1].insertionPoints[-1].paragraphs[0].appliedParagraphStyle // next paragraphs style
                nsn =  getNestingPath(ns, ns.name.shorten(20));       
                _temp.dds.fsp = nsn;
            }
        }
    }
    return _temp;
}

function savePrefs(ad) {
    ad.insertLabel(ScriptName + ScriptVersion,_prefs.toSource());
    Log("SAVED: " +_prefs.toSource());
}

function getNestingPath (style, style_name) {
	// rercursive functions from Peter Kahrel to collect nested styles names ... adds parent (folder) names to style names; thanks Peter!
	while (style.parent.constructor.name != 'Document')    
		return getNestingPath (style.parent, style.parent.name.shorten(20) + ' > ' + style_name);
	return style_name;
}

function getNestedListOfShortendedStyles (aps) {
	// expects document, returns Array of Strings of style names in a shortened way
	var styleArray = [];
	for (i = 0; i < aps.length; i++) {
        styleArray.push(getNestingPath(aps[i], aps[i].name.shorten(20)));  // recurse down style nesting and collect parents-names
    }
	return styleArray;
}

function GetStoriesSelection(myStories,mySelItems) {
    // Get stories of selected Textframes or Groups --------
    // by Kasyan Servetsky. Taken from "Export stories to InCopy.jsx ", Feb 13 2010, Thanks, dude!!!
    // I modified it to work recursive inside groups, because there can be multiple grouped stories inside groups.
    // I also made it return stories of texts on paths.
    var s;
    function IsObjInArray(myObj, myArray) {
        for (x in myArray) {
            if (myObj.id == myArray[x].id) {
                return true;
            }
        }
        return false;
    }
    for (var i = 0; i < mySelItems.length; i++) {
            s = mySelItems[i];
            switch (s.constructor.name) {
                case "TextFrame": 
                if (s.parentStory.itemLink == null) {
                    if (!IsObjInArray(s.parentStory, myStories)) {
                        myStories.push(s.parentStory);
                    }
                }
                // Somewhat esoteric case: but a textframe may contain text inside as well as on its edges in a textPath.
                if (s.textPaths.length > 0) {
                    for (var j = 0; j < s.textPaths.length; j++) {
                        if (s.textPaths[j].parentStory.itemLink == null) {
                            if (!IsObjInArray(s.textPaths[j].parentStory, myStories)) {
                                myStories.push(s.textPaths[j].parentStory);
                            }
                        }
                    }
                }
                break;
            case "Rectangle":
            case "GraphicLine":
            case "Oval":
            case "Polygon":
                if (s.textPaths.length > 0) {
                    for (var j = 0; j < s.textPaths.length; j++) {
                        if (s.textPaths[j].parentStory.itemLink == null) {
                            if (!IsObjInArray(s.textPaths[j].parentStory, myStories)) {
                                myStories.push(s.textPaths[j].parentStory);
                            }
                        }
                    }
                }
                break;
            case "Group": 
                var myItems = s.allPageItems;
                GetStoriesSelection(myStories, myItems);
                break;
            default:
        }
	}
	return myStories;
}

// ------------------------------------- POLYFILLS  -------------------------------
if (!Array.prototype.trim) {
	// trims leading and traling spaces of a string
	String.prototype.trim = function () {  
		return this.replace(/^\s+/,'').replace(/\s+$/,'');  
	} 
}
if (!Array.prototype.shorten) {  
	// Shortens a string to roughly n characters by replacing the middle part with "..." similar to how adobe  does it with long stylenames 
	String.prototype.shorten = function (n) { 
		return (this.length > n) ? this.slice(0, (n/2)-2).trim() + "..." + this.slice((-n/2)+2).trim() : this+"";
	}
}
if (!Array.prototype.contains) {
	// true if array contains given object
	Array.prototype.contains = function(obj) {
		var i = this.length;
		while (i--) {
			if (this[i] === obj) {
				return true;
			}
		}
		return false;
	}
}
if (!Array.prototype.indexOf) {  
	// of a given object returns its index in the array
	Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {    
		"use strict";  
		if (this == null) {  
			throw new TypeError();  
		}  
		var t = Object(this);  
		var len = t.length >>> 0;  
		if (len === 0) {  
			return -1;  
		}  
		var n = 0;  
		if (arguments.length > 0) {  
			n = Number(arguments[1]);  
			if (n != n) { // shortcut for verifying if it's NaN  
				n = 0;  
			} else if (n != 0 && n != Infinity && n != -Infinity) {  
				n = (n > 0 || -1) * Math.floor(Math.abs(n));  
			}  
		}  
		if (n >= len) {  
			return -1;  
		}  
		var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);  
		for (; k < len; k++) {  
			if (k in t && t[k] === searchElement) {  
				return k;  
			}  
		}  
		return -1;  
	}  
}

main();