var doc = app.activeDocument;
var paragraphStyles = [
    "My Folder Paragraph Styles/My Paragraph Name",
    "My Folder Paragraph Styles/My Paragraph Name",
    "My Folder Paragraph Styles/My Paragraph Name",
    "My Folder Paragraph Styles/My Paragraph Name",
    "My Folder Paragraph Styles/My Paragraph Name"
]; 

var totalParagraphs = doc.pages[0].textFrames[0].paragraphs.length;

if (paragraphStyles.length !== totalParagraphs) {
    alert("Number of paragraph styles does not match the total number of paragraphs in the document.");
} else {
    for (var i = 0; i < paragraphStyles.length; i++) {
        var styleName = paragraphStyles[i];
        var paragraph = doc.pages[0].textFrames[0].paragraphs[i];
        
        // Extracting folder and style name
        var styleParts = styleName.split("/");
        var folderName = styleParts.slice(0, -1).join("/");
        var styleOnly = styleParts.pop();
        
        // Finding the style in the folder
        var folder = doc.paragraphStyleGroups.itemByName(folderName);
        var style;

        if (folder.isValid) {
            style = folder.paragraphStyles.itemByName(styleOnly);
        } else {
            style = doc.paragraphStyles.itemByName(styleName);
        }

        // Applying style
        try {
            paragraph.appliedParagraphStyle = style;
        } catch (e) {
            alert("Style '" + styleName + "' not found.");
        }
    }
}
