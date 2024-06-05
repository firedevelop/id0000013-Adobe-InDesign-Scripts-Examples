// Ensure there is exactly one document open
if (app.documents.length !== 1) {
    alert("Open exactly one document!");
    exit();
}

// Get the active document
var doc = app.activeDocument;

// Initialize an empty string to store paragraph styles
var paragraphStylesList = "";

// Loop through each text frame in the document
for (var i = 0; i < doc.textFrames.length; i++) {
    var textFrame = doc.textFrames[i];

    // Loop through each paragraph in the text frame
    for (var j = 0; j < textFrame.paragraphs.length; j++) {
        var paragraph = textFrame.paragraphs[j];
        var paragraphStyle = paragraph.appliedParagraphStyle;
        var paragraphStylePath = getParagraphStylePath(paragraphStyle);

        // Append the paragraph style name with its folder structure to the list
        paragraphStylesList += "\"" + paragraphStylePath + "\"\,\n";
    }
}

// Save paragraph styles to a text file
var filePath = doc.filePath + "/" + doc.name.replace(/\..+$/, "") + "_ParagraphStyles.txt";
var file = new File(filePath);
file.open("w");
file.write(paragraphStylesList);
file.close();

alert("Paragraph styles applied in the document have been saved to:\n\n" + filePath);

// Function to get the full path of a paragraph style including parent folders
function getParagraphStylePath(paragraphStyle) {
    var path = paragraphStyle.name;
    var parent = paragraphStyle.parent;

    while (parent instanceof ParagraphStyleGroup) {
        path = parent.name + "/" + path;
        parent = parent.parent;
    }

    return path;
}
