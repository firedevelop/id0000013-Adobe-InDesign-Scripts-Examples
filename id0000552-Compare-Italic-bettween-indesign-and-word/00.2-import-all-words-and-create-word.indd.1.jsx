// Description: Place multiple doc docx rtf files as one story
// Peter Kahrel -- www.kahrel.plus.com

#targetengine place_documents;

try {place_docs ()}
	catch (e) {alert (e.message + " (line " + e.line + ")")};


function place_docs () {
	//set_Word_import_preferences();
	var ff = get_files ();
	var missed = [];
	var placedstory = get_story ();
	app.scriptPreferences.userInteractionLevel = UserInteractionLevels.neverInteract;
	var pb = initprogressbar (ff.length, 'Loading');
	pb.show();
	for (var i = 0; i < ff.length; i++) {
		pb.value = i;
		try {
			placedstory.insertionPoints[-1].contents = '%%%'+ff[i];
			placedstory.insertionPoints[-1].place (File(ff[i]));
			placedstory.insertionPoints[-1].contents = '\r\r';
		} catch (_) {
			missed.push (decodeURI (ff[i]));
		}
	}
	app.scriptPreferences.userInteractionLevel = UserInteractionLevels.interactWithAll;
	var inform = "";
	if (missed.length > 0){
		inform += '\r\rCould not place:\r\r' + missed.join ('\r');
	}
	delete_empty_frames ();
	try{pb.parent.close()} catch (_){}
	if (inform !== "") alert (inform);
}


function get_story () {
	var doc = app.documents.add();
	doc.zeroPoint = [0,0];
	doc.textPreferences.smartTextReflow = true;
	try {
		doc.textPreferences.limitToMasterTextFrames = false;
	}catch(_){
	}

	var pb = doc.pages[0].bounds;
	var m = doc.pages[0].marginPreferences;
	var gb = [m.top, m.left, pb[2]-m.bottom, pb[3]-m.left];
	doc.pages[0].textFrames.add ({geometricBounds: gb});

	doc.pages.add();
	doc.pages[1].textFrames.add ({geometricBounds: gb});
	doc.pages[0].textFrames[0].nextTextFrame = doc.pages[1].textFrames[0];
	return doc.pages[0].textFrames[0].parentStory;
}


function delete_empty_frames () {
	app.findGrepPreferences = app.changeGrepPreferences = null;
	app.findGrepPreferences.findWhat = '\\A\\Z';
	var empties = app.activeDocument.findGrep (true);
	for (var i = 0; i < empties.length; i++){
		empties[i].parentTextFrames[0].remove();
	}
}


function initprogressbar (stop, title) {
	var w = new Window('palette', title);
	w.progressbar = w.add ('progressbar', undefined, 1, stop);
	w.progressbar.preferredSize = [200, 20];
	return w;
}

//=====================================================================================

function get_folder ()
		{
		var history_file = File (script_dir() + "/place_documents.txt");
		var history = read_history (history_file);
		var w = new Window ("dialog", "Place documents (.doc, .docx, .rtf)", undefined, {closeButton: false});
		w.alignChildren = "right";
	
		var main = w.add ('group {_: StaticText {text: "Folder: "}}');
		var inp = main.add ('group {alignChildren: "left", orientation: "stack"}');
			if (File.fs != "Windows"){
				var list = inp.add ("dropdownlist", ["", "", 240, ""], history);
			}
			var mask = inp.add ('edittext');
			if (File.fs == "Windows"){
				var list = inp.add ("dropdownlist", ["", "", 240, ""], history);
			}
			mask.preferredSize = [list.size.width-20, list.size.height];
		var pick_button = main.add ('iconbutton', undefined, folder_icon(), {style: 'toolbutton'});


		var buttons = w.add ('group {alignment: "right", margins: [0,0,43,0]}');
			buttons.add ('button', undefined, 'OK', {name: 'OK'});
			buttons.add ('button', undefined, 'Cancel', {name: 'Cancel'});
        
		list.onChange = function () {mask.text = list.selection.text; mask.active = true}
	
		pick_button.onClick = function ()
			{
			var f = Folder (mask.text).selectDlg ('Choose a folder')
			if (f != null)
				{
				mask.text = f.fullName + '/';
				}
			}
	
		mask.text = history[0];
		w.layout.layout();
		mask.active = true;

		if (w.show () == 1) {
			write_history (history_file, list, mask.text);
			return mask.text;
		}
		exit ();
	} // get_folder

//==================================================================

function get_files ()
	{
	var dir = get_folder ();
	var f = find_files (dir);
	if (f.length === 0)
		{
		alert ('No doc, docx, or rtf files found.');
		exit();
		}
	
	var w = new Window ('dialog {orientation: "row", alignChildren: "top"}');
		w.text = "Select files ("+dir+")";

		var main_group = w.add ('group {orientation: "column", alignChildren: "fill"}');
		
		var main = main_group.add ('panel');
			var list = main.add ('listbox', undefined, f, {multiselect: true});
			list.selection = 0;
			list.preferredSize.width += 10; list.preferredSize.height += 50;
			
		var b = w.add ('group {orientation: "column"}');
			b.up = b.add ('button {text: "Up"}');
			b.down = b.add ('button {text: "Down"}');
			b.rem = b.add ('button {text: "Remove"}');
			b.select_all = b.add ('button {text: "Select all"}');
			b.ok = b.add ('button {text: "OK"}');
			b.cancel = b.add ('button {text: "Cancel"}');


		b.select_all.onClick = function (){
			var all_items = [];
			var L = list.items.length;
			for (var i = 0; i < L; i++){
				all_items[i] = list.items[i];
			}
			list.selection = all_items;
		}


		b.up.onClick = function (){
			var first = list.selection[0].index;
			if (first == 0 || !contiguous (list.selection)) return;
			var last = first+list.selection.length;
			for (var i = first; i < last; i++){
				swap (list.items [i-1], list.items [i]);
			}
			list.selection = null;
			for (var i = first-1; i < last-1; i++){
				list.selection = i;
			}
		}


		b.down.onClick = function (){
			//var last = list.selection.pop().index;
			var last = list.selection[list.selection.length-1].index;
			if (last == list.items.length-1 || !contiguous (list.selection)) return;
			var first = list.selection[0].index;
			for (var i = last; i >= first; i--){
				swap (list.items [i+1], list.items [i]);
			}
			list.selection = null;
			for (var i = first+1; i <= last+1; i++){
				list.selection = i;
			}
		}
	
		
		function contiguous (sel){
			return sel.length == (sel[sel.length-1].index - sel[0].index + 1);
		}

		function swap (x, y){
			var temp = x.text;
			x.text = y.text;
			y.text = temp;
		}


		b.rem.onClick = function (){
			var sel = list.selection[0].index;
			for (var i = list.selection.length-1; i > -1; i--){
				list.remove (list.selection[i]);
			}
			if (sel > list.items.length-1){
				list.selection = list.items.length-1;
			}else{
				list.selection = sel;
			}
		} // rem.onClick
		
		if (w.show() == 2) exit();

		var temp = [];
		for (var i = 0; i < list.selection.length; i++){
			temp.push (list.selection[i].text);
		}
		if (parseInt(app.version) > 8) {
			var preview = showPreview(temp);
			if (preview.show() == 2) exit();
			temp = preview.txt.text.split(/[\n\r]/);
		}
		//$.writeln (temp.join('\r')); exit();
		return temp;
		
	} // get_files


function showPreview (arr) {
	var w = new Window ('dialog', 'Preview', undefined, {resizeable: true});
		w.orientation = 'row';
		w.txt = w.add ('edittext', undefined, arr.join('\r'), {multiline: true});
			w.txt.alignment = ['fill', 'fill'];
			w.txt.minimumSize = [300, 200];
		w.buttons = w.add ('group {orientation: "column"}');
			w.buttons.alignment = ['right', 'top'];
			w.buttons.alignChildren = 'fill';
			w.buttons.add ('button {text: "OK"}');
			w.buttons.add ('button {text: "Cancel"}');
		w.onResizing = w.onResize = function () {this.layout.resize ();}
		
	w.onShow = function () {
		w.minimumSize = w.size;
	}
	return w
}

function find_files (dir) {
	var list = Folder(dir).getFiles (function (f) {
		return f.name.search(/\.(?:rtf|docx?)$/gi) !== -1;
	});
	if (list.length > 0) {
		for (var i = 0; i < list.length; i++) {
			list[i] = decodeURI (list[i].fullName);
			//array[i] = decodeURI (array[i].name)
		}
		list.sort();
	}
	return list;
}



function read_history (f) {
	if (f.exists) {
		f.open ('r');
		var temp = f.read ();
		f.close ();
		if (temp.length > 0) {
			return temp.split (/[\r\n]/);
		}
	}
	return [];
}


function write_history (f, list /*list object*/, new_mask /*string*/)
    {
    list.remove (list.find (new_mask));
    list.add ("item", new_mask, 0);
    var str = "";
    var stop = Math.min (list.items.length, 8)-1;
    for (var i = 0; i < stop; i++)
		{
        str += list.items[i].text + "\r";
		}
    str += list.items[i].text;
    f.open ("w"); f.write (str); f.close ()
    }


function script_dir()
	{
	try {return File (app.activeScript).path}
    catch(e) {return File (e.fileName).path}
	}


function apply_import_preferences ()
	{
	var f = File ('/d/import.txt');
	if (f.exists)
		{
		f.open ('r'); var txt = f.read(); f.close;
		txt = txt.replace (/^\/\/.+/mg, "");
		lines = txt.split (/[\n\r]+/mg);
		for (var i = 0; i < lines.length; i++)
			{
			eval (lines[i]);
			}
		}
	}

function folder_icon () {
	return "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x16\x00\x00\x00\x12\b\x06\x00\x00\x00_%.-\x00\x00\x00\tpHYs\x00\x00\x0B\x13\x00\x00\x0B\x13\x01\x00\u009A\u009C\x18\x00\x00\x00\x04gAMA\x00\x00\u00B1\u008E|\u00FBQ\u0093\x00\x00\x00 cHRM\x00\x00z%\x00\x00\u0080\u0083\x00\x00\u00F9\u00FF\x00\x00\u0080\u00E9\x00\x00u0\x00\x00\u00EA`\x00\x00:\u0098\x00\x00\x17o\u0092_\u00C5F\x00\x00\x02\u00DEIDATx\u00DAb\u00FC\u00FF\u00FF?\x03-\x00@\x0011\u00D0\b\x00\x04\x10\u00CD\f\x06\b \x16\x18CFR\x12L\u00CF*\u0092e\u00FE\u00F7\u009F!\u008C\u0097\u008By\x19\u0088\u00FF\u00F7\u00EF\x7F\u0086\u00CF\u00DF\u00FE\u00C6dOz\u00B2\x1C\u00C8\u00FD\x0F\u00C5\x04\x01@\x00\u00A1\u00B8\x18f(##C\u00AD\u009Ak9\u0083\u008E_\x17\u0083i\u00D4<\x06\x16f\u00C6\u009A\t\u00D9\u00D21@%\u00CC@\u00CCH\u008C\u00C1\x00\x01\u00C4\b\u008B<\u0090\u008Bg\x14\u00CAF212,\u00D3q\u00CDb\u00E0\x16Rf`\u00E3\x14f`\u00E5\x14d\u00F8\u00FF\u00E7'\u00C3\u00FE\u00D9a\x18\u009A\u00FF\u00FE\u00FB\u009Fq\u00F3\u00F1\u00CF%\x13\u00D6\u00BE\u00FE\u0086\u00EE\x13\u0080\x00bA\u00B6\x04d\u00A8\u00A1_\x15\u00D8@\u0098\u00A1\u00AC\u00EC\u00FC\f\u00CC<\\\f^\u00A5\u00A7P\f\u00FD\u00F6\u00EE.\u00C3\u00DD\x03\x1D3\u00BE\u00FF<\u00FF\f\u00C8\u00DD\x01\u00C4\x7F\u0090\r\x07\b \x14\u0083A\x04\u00CCP6\x0E!\u0086\u00A3s\x03\x18XY\x19\x19\u00FE\x01\u00C3\x07\x14\u00D6\x7F\u00A1\u00F4\u009F\u00BF\f`\fb\x03}\u00BC\u00A9+U\u0092\u00E1\u00F9\u009B\u00BF\u00BA\u00FD\u00EB_]\u0083\u00C5\x03@\x00\u00B1\u00A0\u00877\u00CC\u00A5\u00F7\x0F\u00F72\u00C8\x1B\x052p\n(\u0080\u00A5\u00FE\u00FD\u00F9\u00C5\u00F0\u00F7\u00F7o\u0086?\u00BF\x7F1\u00FC\u00F9\x05\u00A1\u00FF\u00FE\u00F9\r\u00C6\u009F\u009E_\x00\u00C6\u00C3\u00FDI@\u0085^@\u00FC\x1B\x14J\x00\x01\u00C4\u0084\u00EEb\u0090\u00A1\u00BF>\u00BFd\u00F8\u00FC\u00EA:\x03\u00A7\u00A0\"\u00C3\u00BF\u00BF\u00BF\x19\u00FE\u00FF\u00FD\x034\u00F8\x0F\u00D8\u0090\x7F\u00BFAl \u00FD\u00EF/P\u00EE\x0FX\u00FE\u00C0\u00B1+\f\u008F^\u00FD<\b\u00D4\u00CE\x01\u008B`\u0080\x00\u00C2\b\n\x0E\x1EI\u0086\u009B\u00DB\u00CA\x19\u0084\u0094\u00EC\u0081\u0081\u00CE\u00CA\u00C0\u00C4\x04\u00F4\u00FE\u00AF_`\u0083A\u0086\u0082]\u00F9\x17j8\u0090\u00FE\u00F1\u00E9)\u00C3\u00D6\x13/\x19\u00EE\u00BFa\u00D8\u00C2\u00CE\u00C6\u00CE\n5\u00F8\x0F@\x00ad\u0090W7\u00B60\u00FC\u00FB\u00FF\u0087\u0081KX\x05\u00E8\u00D2\u00DF`\x03\u00FE\u0082]\x0Bq\u00DD\u00BF\u00BF0\u0097\u00FE\x05\u0086\u00EF_\u0086\u00C3G\u008E1\u00DCy\u00FE}9\u00D0\u00D0O\u00C8I\x11 \u00800\f~xr\x06\u0083\u00A0\u00825\u00C3\u00FF\x7FPW\x01\r\x04Y\x00q\u00E9_ \u0086\x1A\x0E\u0094\u00FF\t\f\u00B2\u0095\u00FB\u009F20\u00B3p\u00CC\u0082\u00A6\n\x10\u00FE\x07\u008A<\u0080\x00\u00C20\u0098\u009DO\u0082\u0081\u009DG\x02\x12\u00AE@\u00CD \u0083\u00C0^\x07bP\u00E4\u00FD\u0083\x1A\u00FE\x1F\u00E8\u00ABS'\u008F2\u00DC{\u00FE}\x1D;;\u00C7\x0B\u00A0\u00D6\u009F@\u00FC\x0B\x14q \u0083\x01\x02\u0088\x05\u00C5P6&\u0086\u00F6i\u00DB\x18^\u00BE[\x0FNJ\u00BF\u00FF\u00FCc\x00&\x00\u0086\u00DF\u00BF!l`\x10\x03\u0093\u00D9\x7F0\u00FE\x0B\u00CCX\u00DF\x7F\u00FEe`e\u00E3\u009C\t5\u00F0'\u0092\u008B\x19\x00\x02\b9\u00E7\u0081\x02\u009E\x0B\u0088\u00F9\u00A14+\x119\u00F7\x1F\u00D4\u00D0/P\u00FC\x1Dj8\x03@\x00!\u00BB\u00F8?T\u00F0'\u0096\u00CCC\u00C8\u00E0\u00EFP\u00FA\x1FL\x02 \u0080X\u00D0\x14\u00FD\u0086\u00DA\u00FC\u0083\u00C8\"\x15\u00E6\u0098\u00DF\u00C8\u00C1\x00\x02\x00\x01\x06\x000\u00B2{\u009A\u00B3\x1C#o\x00\x00\x00\x00IEND\u00AEB`\u0082";
}

//=====================================================================================

function set_Word_import_preferences ()
    {
    app.wordRTFImportPreferences.useTypographersQuotes = true;

    app.wordRTFImportPreferences.convertPageBreaks = ConvertPageBreaks.none;
    //~ app.wordRTFImportPreferences.convertPageBreaks = ConvertPageBreaks.columnBreak;
    //~ app.wordRTFImportPreferences.convertPageBreaks = ConvertPageBreaks.pageBreak;

    app.wordRTFImportPreferences.importEndnotes = true;
    app.wordRTFImportPreferences.importFootnotes = true;
    app.wordRTFImportPreferences.importIndex = true;
    app.wordRTFImportPreferences.importTOC = false;
    app.wordRTFImportPreferences.importUnusedStyles = false;
    app.wordRTFImportPreferences.preserveGraphics = true;
    app.wordRTFImportPreferences.convertBulletsAndNumbersToText = true;

    app.wordRTFImportPreferences.removeFormatting = false;
    // If removeFormatting is true, these two can be set as well:
    //~ app.wordRTFImportPreferences.convertTablesTo = ConvertTablesOptions.unformattedTabbedText;
    //~ app.wordRTFImportPreferences.convertTablesTo = ConvertTablesOptions.unformattedTable;
    //~ app.wordRTFImportPreferences.preserveLocalOverrides = true

    app.wordRTFImportPreferences.preserveTrackChanges = false;

    //~ app.wordRTFImportPreferences.resolveCharacterStyleClash = ResolveStyleClash.resolveClashAutoRename;
    //~ app.wordRTFImportPreferences.resolveCharacterStyleClash = ResolveStyleClash.resolveClashUseExisting;
    //~ app.wordRTFImportPreferences.resolveCharacterStyleClash = ResolveStyleClash.resolveClashUseNew;

    //~ app.wordRTFImportPreferences.resolveParagraphStyleClash = ResolveStyleClash.resolveClashAutoRename;
    //~ app.wordRTFImportPreferences.resolveParagraphStyleClash = ResolveStyleClash.resolveClashUseExisting;
    //~ app.wordRTFImportPreferences.resolveParagraphStyleClash = ResolveStyleClash.resolveClashUseNew;
    }