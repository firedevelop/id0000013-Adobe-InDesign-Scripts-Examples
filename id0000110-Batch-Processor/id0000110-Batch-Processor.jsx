/* Copyright 2017, Kasyan Servetsky
April 4, 2017
Written by Kasyan Servetsky
http://www.kasyan.ho.com.ua
e-mail: askoldich@yahoo.com */
//======================================================================================
var gErrorLog = [], // log error messages
gEventLog = []; // log non-error messages

var gKasBatchPprocessScripts = {
					scriptName: "Batch processor - 2.2",
					count: 0, // counter of processed documents
					docsFolder: null,
					scriptFile: null,
					scriptFolder: null,
					openDocsList: []
				};
//===================================== FUNCTIONS  ======================================
gKasBatchPprocessScripts.Main = function() {
	var doc, inddFiles,
	startTime = new Date();

	for (var d = 0; d < app.documents.length; d++) { // get the list of open documents
		gKasBatchPprocessScripts.openDocsList.push(app.documents[d].id);
	}

	if (gKasBatchPprocessScripts.set.log) {
		gEventLog.push("Date & time: " + gKasBatchPprocessScripts.GetDate());
		if (gKasBatchPprocessScripts.set.rbScript == 0) {
			gEventLog.push("Running script: " + gKasBatchPprocessScripts.scriptFile.displayName);
		}
		else if (gKasBatchPprocessScripts.set.rbScript == 1) {
			gEventLog.push("Running scripts:");
			var jsxFiles = gKasBatchPprocessScripts.scriptFolder.getFiles("*.jsx");
			for (var i = 0; i < jsxFiles.length; i++) {
				gEventLog.push(jsxFiles[i].displayName);
			}
		}
	}

	if (gKasBatchPprocessScripts.set.rbScope == 0 || gKasBatchPprocessScripts.set.rbScope == 1) {
		if (gKasBatchPprocessScripts.set.rbScope == 0) { // active document
			doc = app.activeDocument;
			gKasBatchPprocessScripts.ProcessDocument(doc);
		}
		else if (gKasBatchPprocessScripts.set.rbScope == 1) { // all open documents
			for (var d = 0; d < app.documents.length; d++) {
				doc = app.documents[d];
				gKasBatchPprocessScripts.ProcessDocument(doc);
			}
		}
	}
	else if (gKasBatchPprocessScripts.set.rbScope == 2) { // active book
		inddFiles = gKasBatchPprocessScripts.GetFilesFromBook();
		if (inddFiles.length == 0) gKasBatchPprocessScripts.ErrorExit("Found no InDesign documents in the active book.", true);
		gKasBatchPprocessScripts.ProcessAllInddDocs(inddFiles);
	}
	else if (gKasBatchPprocessScripts.set.rbScope == 3 || gKasBatchPprocessScripts.set.rbScope == 4) {// folder, or folder with all subfolders
		inddFiles = gKasBatchPprocessScripts.GetAllInddFiles(gKasBatchPprocessScripts.docsFolder);
	
		if (inddFiles.length == 0) gKasBatchPprocessScripts.ErrorExit("Found no InDesign documents in the selected folder.", true);
		gKasBatchPprocessScripts.ProcessAllInddDocs(inddFiles);
	}
	
	var endTime = new Date();
	var duration = gKasBatchPprocessScripts.GetDuration(startTime, endTime);
	
	var report = gKasBatchPprocessScripts.count + ((gKasBatchPprocessScripts.count == 1) ? " document was" : " documents were") + " processed.\rTime elapsed: " + duration + ". ";
	if (gErrorLog.length > 0) { // if errors occur, add their number to the final alert
		report += "\r" + gErrorLog.length + " error" + ((gErrorLog.length > 1) ? "s" : "") + " occured.";
	}

	if (gKasBatchPprocessScripts.set.log) {
		if (gErrorLog.length > 0) { // if errors occur, add them to the report
			gEventLog.push("=========================================================\rERRORS:");
			gEventLog = gEventLog.concat(gErrorLog);
		}
		gEventLog.push("=========================================================\r" + report + "\r=========================================================\r\r");
		var text = gEventLog.join("\r");
		gKasBatchPprocessScripts.WriteToFile(text);
	}
	
	alert("Finished. " + report, gKasBatchPprocessScripts.scriptName);
}
//--------------------------------------------------------------------------------------------------------------------------------------------------------
gKasBatchPprocessScripts.ProcessAllInddDocs = function(inddFiles) {
	var doc, inddFile;
	
	if (gKasBatchPprocessScripts.set.log) {
		if (gKasBatchPprocessScripts.set.rbScope == 2) gEventLog.push("Book name: " + app.activeBook.name);
	}

	var progressWin = gKasBatchPprocessScripts.CreateProgressBar();
	progressWin.show();
	progressWin.pb.minvalue = 0;
	progressWin.pb.maxvalue = inddFiles.length;
	
	app.scriptPreferences.userInteractionLevel = UserInteractionLevels.NEVER_INTERACT;	
	
	for (var i = 0; i < inddFiles.length; i++) {
		try {
			inddFile = inddFiles[i];
			progressWin.pb.value = (i + 1);
			progressWin.st.text = "Processing file - " + inddFile.displayName;

			doc = app.open(inddFile);
			gKasBatchPprocessScripts.ProcessDocument(doc);
			
			if (gKasBatchPprocessScripts.set.saveOnClosing) {
				if (gKasBatchPprocessScripts.set.rbScope == 2 || gKasBatchPprocessScripts.set.rbScope == 3 || gKasBatchPprocessScripts.set.rbScope == 4) {
					if (gKasBatchPprocessScripts.GetArrayIndex(gKasBatchPprocessScripts.openDocsList, doc.id) == -1) { // if it wasn't open before running the script, save & close
						doc.close(SaveOptions.YES);
					}
					else { // otherwise save and don't close
						doc.save();
					}
				}
			}		
			else {
				doc.close(SaveOptions.NO);
			}
		}  
		catch(err) {
			gErrorLog.push(inddFile.name + ": " + err.message + ", line: " + err.line);
			$.writeln(err.message + ", line: " + err.line);
			app.scriptPreferences.userInteractionLevel = UserInteractionLevels.INTERACT_WITH_ALL;
		} 
	} // end For

	app.scriptPreferences.userInteractionLevel = UserInteractionLevels.INTERACT_WITH_ALL;
			
	progressWin.close();
}
//--------------------------------------------------------------------------------------------------------------------------------------------------------
gKasBatchPprocessScripts.ProcessDocument = function(doc) { // Make backup and trigger script(s)
	if (doc.name.match(/^Backup/) != null) return; // Skip backups	
	if (gKasBatchPprocessScripts.set.log) gEventLog.push("------------------------------------------\rDocument name: " + doc.name + "\rDocument path: " + File(doc.filePath).fsName);
	var oldDocPath = doc.filePath.absoluteURI;
	
	if (gKasBatchPprocessScripts.set.saveOnClosing && gKasBatchPprocessScripts.set.backUp) { // Create a backup copy
		var newDocFile = new File(oldDocPath + "/Backup_" + doc.name);
		
		if (newDocFile.exists) { // Don't overwrite existing files
			var increment = 1;
			while (newDocFile.exists) {
				newDocFile = new File(oldDocPath + "/Backup" + "(" + increment++ + ")_" + doc.name);
			}
		}
		doc.fullName.copy(newDocFile.absoluteURI);
	}

	gKasBatchPprocessScripts.count++;
	gKasBatchPprocessScripts.RunScripts();
}
//--------------------------------------------------------------------------------------------------------------------------------------------------------
gKasBatchPprocessScripts.RunScripts = function() {
	var jsxFile;
	
	if (gKasBatchPprocessScripts.set.rbScript == 0) {
		app.doScript(gKasBatchPprocessScripts.scriptFile, ScriptLanguage.JAVASCRIPT, undefined, UndoModes.ENTIRE_SCRIPT, "\"" + gKasBatchPprocessScripts.scriptName + "\" Script");
	}
	else {
		var jsxFiles = gKasBatchPprocessScripts.scriptFolder.getFiles("*.jsx");
	
		for (var i = 0; i < jsxFiles.length; i++) {
			jsxFile = jsxFiles[i];
			app.doScript(jsxFile, ScriptLanguage.JAVASCRIPT, undefined, UndoModes.ENTIRE_SCRIPT, "\"" + gKasBatchPprocessScripts.scriptName + "\" Script");
		}
	}
}
//--------------------------------------------------------------------------------------------------------------------------------------------------------
gKasBatchPprocessScripts.GetAllInddFiles = function(folder) {
	var files = [],
	fileList = folder.getFiles(),
	i, file;
	
	for (i = 0; i < fileList.length; i++) {
		file = fileList[i];
		if (file instanceof Folder && gKasBatchPprocessScripts.set.rbScope == 4) {
			files = files.concat(gKasBatchPprocessScripts.GetAllInddFiles(file));
		}
		else if (file instanceof File && file.name.match(/\.indd$/i) && file.name.match(/^Backup/) == null) {
			files.push(file);
		}
	}

	return files;
}
//--------------------------------------------------------------------------------------------------------------------------------------------------------
gKasBatchPprocessScripts.GetArrayIndex = function(arr, val) {
	for (var i = 0; i < arr.length; i++) {
		if (arr[i] == val) {
			return i;
		}
	}
	return -1;
}
//--------------------------------------------------------------------------------------------------------------------------------------------------------
gKasBatchPprocessScripts.GetFilesFromBook = function() {
	var bookContent, file,
	activeBook = app.activeBook,
	files = [];
	
	for (var i = 0; i < activeBook.bookContents.length; i++) {
		bookContent = activeBook.bookContents[i];
		if (bookContent.status != BookContentStatus.MISSING_DOCUMENT && bookContent.status != BookContentStatus.DOCUMENT_IN_USE) {
			file = new File(bookContent.fullName);
			files.push(file);
		}
		else if (bookContent.status == BookContentStatus.MISSING_DOCUMENT && gKasBatchPprocessScripts.set.log) {
			gErrorLog.push("'" + bookContent.fullName + "' is missing because it has been moved, renamed, or deleted.");
		}
		else if (bookContent.status == BookContentStatus.DOCUMENT_IN_USE && gKasBatchPprocessScripts.set.log) {
			gErrorLog.push("'" + bookContent.fullName + "' is being used by someone else and is therefore locked.");
		}
	}
	
	return files;
}
//--------------------------------------------------------------------------------------------------------------------------------------------------------
gKasBatchPprocessScripts.CreateDialog = function() {
	var jsxFiles;
	gKasBatchPprocessScripts.GetDialogSettings();
	var isFile = (gKasBatchPprocessScripts.set.rbScript == 0) ? true : false; // file, or gKasBatchPprocessScripts.set of scripts in the folder
	if (gKasBatchPprocessScripts.scriptFolder != null) {
		jsxFiles = gKasBatchPprocessScripts.scriptFolder.getFiles("*.jsx");
	}

	var w = new Window("dialog", gKasBatchPprocessScripts.scriptName);
	
	w.p = w.add("panel", undefined, "Process:");
	w.p.orientation = "column";
	w.p.alignment = "fill";
	w.p.alignChildren = "left";

	// Scope
	w.p.rb = w.p.add("radiobutton", undefined, "active document");
	if (app.documents.length == 0) w.p.rb.enabled = false;
	w.p.rb1 = w.p.add("radiobutton", undefined, "all open documents");
	if (app.documents.length < 2) w.p.rb1.enabled = false;
	w.p.rb2 = w.p.add("radiobutton", undefined, "active book");
	if (app.books.length == 0) w.p.rb2.enabled = false;
	w.p.rb3 = w.p.add("radiobutton", undefined, "documents in the selected folder");
	w.p.rb4 = w.p.add("radiobutton", undefined, "documents in the selected folder and its subfolders");
	w.p.rb.onClick = w.p.rb1.onClick = w.p.rb2.onClick = w.p.rb3.onClick = w.p.rb4.onClick = function() {
		if (this.text.match(/^documents in the selected folder/) != null) {
			w.p4.cb1.enabled = w.p1.enabled = true;
		}
		else if (this.text == "active book") {
			w.p4.cb1.enabled = true;
			w.p1.enabled = false;			
		}
		else {
			w.p4.cb1.enabled = w.p1.enabled = false;
		}
	}
	
	if (gKasBatchPprocessScripts.set.rbScope == 0 && app.documents.length != 0) { // active document
		w.p.rb.value = true;
	}
	else if (gKasBatchPprocessScripts.set.rbScope == 1 && app.documents.length > 1) { // all open documents
		w.p.rb1.value = true;
	}
	else if (gKasBatchPprocessScripts.set.rbScope == 2 && app.books.length != 0) { // active book
		w.p.rb2.value = true;
	}
	else if (gKasBatchPprocessScripts.set.rbScope == 3) { // documents in the selected folder
		w.p.rb3.value = true;
	}
	else  { // documents in the selected folder and its subfolders
		w.p.rb4.value = true;
	}

	// Documents folder
	w.p1 = w.add("panel", undefined, "Documents folder:");
	w.p1.alignment = "fill";
	w.p1.st = w.p1.add("statictext");
	w.p1.st.alignment = "left";
	if (gKasBatchPprocessScripts.docsFolder == null || !gKasBatchPprocessScripts.docsFolder.exists) { 
		w.p1.st.text = "No folder has been selected";
	}
	else {
		w.p1.st.text = gKasBatchPprocessScripts.TrimPath(gKasBatchPprocessScripts.docsFolder.absoluteURI);
		w.p1.st.helpTip = gKasBatchPprocessScripts.docsFolder.fsName;
	}
	w.p1.bt = w.p1.add("button", undefined, "Select ...");
	w.p1.bt.onClick = function() {
		gKasBatchPprocessScripts.docsFolder = gKasBatchPprocessScripts.SelectFolder(this, "Pick a folder with documents.");
	}

	if (w.p.rb3.value || w.p.rb4.value) {
		w.p1.enabled = true;
	}
	else {
		w.p1.enabled = false;
	}

	// What to run: a script or gKasBatchPprocessScripts.set of scripts
	w.p2 = w.add("panel", undefined, "What to run:");
	w.p2.alignChildren = "left";
	w.p2.alignment = "fill";
	w.p2.rb = w.p2.add("radiobutton", undefined, "single script");
	w.p2.rb.onClick = UpdateScriptPanel;
	w.p2.rb1 = w.p2.add("radiobutton", undefined, "set of scripts");
	w.p2.rb1.onClick = UpdateScriptPanel;

	function UpdateScriptPanel() { // clicking a radio button switches between "scipt" and "gKasBatchPprocessScripts.set of scripts"
		var fileObj;

		if (this.text == "single script") {
			isFile = true;
			fileObj = gKasBatchPprocessScripts.scriptFile;
			w.p3.text = "Script:";
			
			if (fileObj == undefined || !fileObj.exists) {
				w.p3.st.text = "No file has been selected";
			}
		}
		else {
			isFile = false;
			fileObj = gKasBatchPprocessScripts.scriptFolder;
			w.p3.text = "Folder with scripts:";
			
			if (fileObj == undefined || !fileObj.exists) {
				w.p3.st.text = "No folder has been selected";
			}
		}
		
		UpdateWindow(fileObj);
	}
	
	if (isFile) {
		w.p2.rb.value = true;
	}
	else  {
		w.p2.rb1.value = true;
	}
	
	var fileObj = (isFile) ? gKasBatchPprocessScripts.scriptFile : gKasBatchPprocessScripts.scriptFolder;
	
	// Scripts folder or a script panel
	w.p3 = w.add("panel", undefined, ((isFile) ? "Script:": "Folder with scripts:"));
	w.p3.alignment = "fill";
	w.p3.st = w.p3.add("statictext");
	w.p3.st.alignment = "left"; // center

	if (fileObj == undefined || !fileObj.exists) {
		w.p3.st.text = "No " + ((isFile) ? "file": "folder") + " has been selected";
	}
	else {
		w.p3.st.text = gKasBatchPprocessScripts.TrimPath(fileObj.fsName);
		w.p3.st.helpTip = fileObj.fsName;
	}

	w.p3.bt = w.p3.add("button", undefined, "Select ...");
	w.p3.bt.onClick = SelectScript;
	
	function SelectScript() {
		if (isFile) {
			gKasBatchPprocessScripts.scriptFile = File.openDialog("Pick a script", "*.jsx");
			if (gKasBatchPprocessScripts.scriptFile != null) {
				UpdateWindow(gKasBatchPprocessScripts.scriptFile);
			}
		}
		else {
			gKasBatchPprocessScripts.scriptFolder = Folder.selectDialog("Pick a folder with scripts");
			
			if (gKasBatchPprocessScripts.scriptFolder != null) {
				jsxFiles = gKasBatchPprocessScripts.scriptFolder.getFiles("*.jsx");
				if (jsxFiles.length == 0) {
					alert("There are no scripts in the selected folder.", gKasBatchPprocessScripts.scriptName, true);
					gKasBatchPprocessScripts.scriptFolder = null;
					w.p3.st.text = "No " + ((isFile) ? "file": "folder") + " has been selected";
				}
				else {
					UpdateWindow(gKasBatchPprocessScripts.scriptFolder);
				}
			}
		}
	}

	function UpdateWindow(fileObj) {
		if (fileObj != null && fileObj.exists) {
			w.p3.remove(w.p3.st);
			w.p3.remove(w.p3.bt);
			w.p3.st = w.p3.add("statictext");
			w.p3.st.text = gKasBatchPprocessScripts.TrimPath(fileObj.fsName);
			w.p3.st.helpTip = fileObj.fsName;
			w.p3.bt = w.p3.add("button", undefined, "Select ...");
			w.p3.bt.onClick = SelectScript;
			w.layout.layout(true);
		}
	}

	w.p4 = w.add("panel", undefined, "Settings:");
	w.p4.alignChildren = "left";
	w.p4.alignment = "fill";
	
	// Check boxes
	w.p4.cb = w.p4.add("checkbox", undefined, "Create log file on the desktop");
	w.p4.cb.alignment = "left";
	w.p4.cb.value = gKasBatchPprocessScripts.set.log;
	
	w.p4.cb1 = w.p4.add("checkbox", undefined, "Save documents on closing");
	w.p4.cb1.alignment = "left";
	w.p4.cb1.value = gKasBatchPprocessScripts.set.saveOnClosing;
	w.p4.cb1.helpTip = "Saves documents before closing. Works only for documents in the selected folder. The documents that have already been opened before running the script will be saved and remain open.";
	w.p4.cb1.onClick = function() {
		if (this.value) {
			w.p4.cb2.enabled = true;
		}
		else {
			w.p4.cb2.enabled = false;
		}
	}

	if (w.p.rb2.value || w.p.rb3.value || w.p.rb4.value) {
		w.p4.cb1.enabled = true;
	}
	else {
		w.p4.cb1.enabled = false;
	}
	
	w.p4.cb2 = w.p4.add("checkbox", undefined, "Backup original InDesign documents");
	w.p4.cb2.alignment = "left";
	w.p4.cb2.value = gKasBatchPprocessScripts.set.backUp;
	if (!gKasBatchPprocessScripts.set.saveOnClosing) {
		w.p4.cb2.enabled = false;
	}
	
	// Buttons
	w.g = w.add("group");
	w.g.orientation = "row";   
	w.g.alignment = "center";
	w.g.ok = w.g.add("button", undefined, "OK", {name: "ok" });
	w.g.ok.onClick = function() { // Use 'children[0]' because the panel is dynamically rebuilt on selecting a new folder so the original references become invalid
		if ((w.p.rb3.value || w.p.rb4.value) && w.p.children[0].text == "No folder has been selected") {
			alert("No 'Documents' folder has been selected.", gKasBatchPprocessScripts.scriptName, true);
			return;
		}
		else if (isFile) { // File
			if (gKasBatchPprocessScripts.scriptFile == null) {
				alert("No script has been selected", gKasBatchPprocessScripts.scriptName, true);
				return;
			}
			else if (!gKasBatchPprocessScripts.scriptFile.exists) {
				alert("Script '" + gKasBatchPprocessScripts.scriptFile.displayName + "' doesn't exist.", gKasBatchPprocessScripts.scriptName, true);
				return;
			}
		}
		else if (!isFile) { // Folder
			if (gKasBatchPprocessScripts.scriptFolder == null) {
				alert("No scripts folder has been selected", gKasBatchPprocessScripts.scriptName, true);
				return;
			}
			else if (!gKasBatchPprocessScripts.scriptFolder.exists) {
				alert("Folder '" + gKasBatchPprocessScripts.scriptFolder.displayName + "' doesn't exist.", gKasBatchPprocessScripts.scriptName, true);
				return;
			}
			else if (jsxFiles == undefined || jsxFiles.length == 0) {
				alert("There are no scripts in the scripts folder.", gKasBatchPprocessScripts.scriptName, true);
				return;
			}
		}

		w.close(1); // If we've reached here, everythin's OK
	}
	w.g.cancel = w.g.add("button", undefined, "Cancel", {name: "cancel"});
	
	var showDialog = w.show();
	
	if (showDialog == 1) {
		if (w.p.rb.value == true) { // active document
			gKasBatchPprocessScripts.set.rbScope = 0;
		}
		else if (w.p.rb1.value == true) { // all open documents
			gKasBatchPprocessScripts.set.rbScope = 1;
		}
		else if (w.p.rb2.value == true) { // active book
			gKasBatchPprocessScripts.set.rbScope = 2;
		}
		else if (w.p.rb3.value == true) { // documents in the selected folder
			gKasBatchPprocessScripts.set.rbScope = 3;
		}
		else if (w.p.rb4.value == true) { // documents in the selected folder and its subfolders
			gKasBatchPprocessScripts.set.rbScope = 4;
		}
	
		if (w.p2.rb.value == true) { // A script file
			gKasBatchPprocessScripts.set.rbScript = 0;
		}
		else if (w.p2.rb1.value == true) { // A folder of script files
			gKasBatchPprocessScripts.set.rbScript = 1;
		}
	
		if (gKasBatchPprocessScripts.scriptFile instanceof File) {
			gKasBatchPprocessScripts.set.scriptFilePath = gKasBatchPprocessScripts.scriptFile.fsName;
		}
		else {
			gKasBatchPprocessScripts.set.scriptFilePath = "";
		}
	
		if (gKasBatchPprocessScripts.scriptFolder instanceof Folder) {
			gKasBatchPprocessScripts.set.scriptFolderPath = gKasBatchPprocessScripts.scriptFolder.fsName;
		}
		else {
			gKasBatchPprocessScripts.set.scriptFolderPath = "";
		}
		
		gKasBatchPprocessScripts.set.docsFolderPath = (gKasBatchPprocessScripts.docsFolder != null) ? gKasBatchPprocessScripts.docsFolder.absoluteURI : ""; // if selected, remember the path; if not, empty string. e.g. for active doc we don't need this

		// Settings panel
		gKasBatchPprocessScripts.set.log = w.p4.cb.value;
		gKasBatchPprocessScripts.set.saveOnClosing = w.p4.cb1.value;
		gKasBatchPprocessScripts.set.backUp = w.p4.cb2.value;
		var tmp = gKasBatchPprocessScripts.set;
		app.insertLabel("Kas_" + gKasBatchPprocessScripts.scriptName, gKasBatchPprocessScripts.set.toSource());
		
		gKasBatchPprocessScripts.Main();
	}
}
//--------------------------------------------------------------------------------------------------------------------------------------------------------
gKasBatchPprocessScripts.GetDialogSettings = function() {
	gKasBatchPprocessScripts.set = eval(app.extractLabel("Kas_" + gKasBatchPprocessScripts.scriptName));
	
	if (gKasBatchPprocessScripts.set == undefined) {
		gKasBatchPprocessScripts.set = { rbScope: 0, rbScript: 0, docsFolderPath: "", scriptFilePath: "", scriptFolderPath: "", log: true, backUp: true, saveOnClosing: false };
	}

	gKasBatchPprocessScripts.docsFolder = new Folder(gKasBatchPprocessScripts.set.docsFolderPath);
	if (!gKasBatchPprocessScripts.docsFolder.exists) {
		gKasBatchPprocessScripts.docsFolder = null;
	}

	gKasBatchPprocessScripts.scriptFile = new File(gKasBatchPprocessScripts.set.scriptFilePath);
	if (!gKasBatchPprocessScripts.scriptFile.exists) {
		gKasBatchPprocessScripts.scriptFile = null;
	}

	gKasBatchPprocessScripts.scriptFolder = new Folder(gKasBatchPprocessScripts.set.scriptFolderPath);
	if (!gKasBatchPprocessScripts.scriptFolder.exists) {
		gKasBatchPprocessScripts.scriptFolder = null;
	}

	var tmp = gKasBatchPprocessScripts.set;
	
	return gKasBatchPprocessScripts.set;
}
//--------------------------------------------------------------------------------------------------------------------------------------------------------
gKasBatchPprocessScripts.CreateProgressBar = function() {
	var w = new Window("window", gKasBatchPprocessScripts.scriptName);
	w.pb = w.add("progressbar", [12, 12, 350, 24], 0, undefined);
	w.st = w.add("statictext");
	w.st.bounds = [0, 0, 340, 20];
	w.st.alignment = "left";
	return w;
}
//--------------------------------------------------------------------------------------------------------------------------------------------------------
gKasBatchPprocessScripts.GetDuration = function(startTime, endTime) {
	var str;
	var duration = (endTime - startTime)/1000;
	duration = Math.round(duration);
	if (duration >= 60) {
		var minutes = Math.floor(duration/60);
		var seconds = duration - (minutes * 60);
		str = minutes + ((minutes != 1) ? " minutes, " :  " minute, ") + seconds + ((seconds != 1) ? " seconds" : " second");
		if (minutes >= 60) {
			var hours = Math.floor(minutes/60);
			minutes = minutes - (hours * 60);
			str = hours + ((hours != 1) ? " hours, " : " hour, ") + minutes + ((minutes != 1) ? " minutes, " :  " minute, ") + seconds + ((seconds != 1) ? " seconds" : " second");
		}
	}
	else {
		str = duration + ((duration != 1) ? " seconds" : " second");
	}

	return str;
}
//--------------------------------------------------------------------------------------------------------------------------------------------------------
gKasBatchPprocessScripts.GetDate = function() {
	var date = new Date();
	if ((date.getYear() - 100) < 10) {
		var year = "0" + new String((date.getYear() - 100));
	}
	else {
		var year = new String((date.getYear() - 100));
	}
	var dateString = (date.getMonth() + 1) + "/" + date.getDate() + "/" + year + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
	return dateString;
}
//--------------------------------------------------------------------------------------------------------------------------------------------------------
gKasBatchPprocessScripts.SelectFolder = function(button, prompt) {
	var folder = Folder.selectDialog(prompt);
	
	if (folder != null) {
		var panel = button.parent;
		var window = panel.parent;
		var children = panel.children;
		var staticText = children[0];
		var button = button;
		panel.remove(staticText);
		panel.remove(button);
		staticText = panel.add("statictext", undefined, gKasBatchPprocessScripts.TrimPath(folder.absoluteURI));
		staticText.helpTip = folder.absoluteURI;
		button = panel.add("button", undefined, "Select ...");
		button.onClick = function() {
			gKasBatchPprocessScripts.SelectFolder(this);
		}
		window.layout.layout(true);
		return folder;		
	}
}
//--------------------------------------------------------------------------------------------------------------------------------------------------------
gKasBatchPprocessScripts.TrimPath = function(path) {
	var theFile = new File(path);
	if (File.fs == "Macintosh") {
		var trimPath = "..." + theFile.fsName.split("/").splice(-3).join("/");
	}
	else if (File.fs == "Windows" ) {
		var trimPath = ((theFile.fsName.split("\\").length > 3) ? "...\\" : "") + theFile.fsName.split("\\").splice(-3).join("\\");
	}
	return trimPath;
}
//--------------------------------------------------------------------------------------------------------------------------------------------------------
gKasBatchPprocessScripts.WriteToFile = function(text) {
	var file = new File("~/Desktop/" + gKasBatchPprocessScripts.scriptName + ".txt");
	file.encoding = "UTF-8";
	if (file.exists) {
		file.open("e");
		file.seek(0, 2);
	}
	else {
		file.open("w");
	}
	file.write(text); 
	file.close();
}
//--------------------------------------------------------------------------------------------------------------------------------------------------------
gKasBatchPprocessScripts.ErrorExit = function(error, icon) {
	alert(error, gKasBatchPprocessScripts.scriptName, icon);
	exit();
}
//======================================================================================
gKasBatchPprocessScripts.CreateDialog();