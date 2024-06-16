var doc = app.documents[0]; // Assuming there's an open document

if (doc && doc.characterStyles.length > 0) {
    var characterStyles = doc.characterStyles;

    for (var i = 0; i < characterStyles.length; i++) {
        var style = characterStyles[i];

        // Check if there are export tag maps
        if (style.styleExportTagMaps.length > 0) {
            var exportTagMaps = style.styleExportTagMaps;

            for (var j = 0; j < exportTagMaps.length; j++) {
                var tagMap = exportTagMaps[j];

                // Delete export tag maps that have exportType "EPUB"
                if (tagMap.exportType === "EPUB") {
                    try {
                        tagMap.exportClass = "";
                    } catch (e) {
                        alert("Error deleting export tag map: " + e.message);
                    }
                }
            }
        }
    }

    alert("Character Style Export Tag Maps have been deleted.");
} else {
    alert("No character styles found in the document.");
}
