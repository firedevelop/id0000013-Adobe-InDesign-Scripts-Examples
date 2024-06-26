/*
 This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program; if not, write to the Free Software
    Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
*/

// Description: Scrips to add page range index topic levels. You can select the paragraph style level. Works with latin characters.
// InDesign Menu Location: > Index > Topic Levels > Type > For Next of # Paragraphs > x number
// Sintaxis: paragraphStyle, keyword, position, addValue(position + x number)
// Code: (IndexLevel01Roman, "action", 3, 5);
// Comment: the number 3 indicate the position, and 5 is the sum for position. Sum = position + addValue = 30 + 5 = 35
// Position Explanation: Number 10 is position 1, number 20 is position 2, etc...
// Before Script: Action 10, 20, 30, 40
// After Script: Action 10, 20, 30-35, 40

var myDoc = app.documents[0];

// Define the paragraph styles
var IndexLevel01Roman = myDoc.paragraphStyleGroups.itemByName("INDEX").paragraphStyles.itemByName("Index Level 01 Roman");
var IndexLevel02Roman = myDoc.paragraphStyleGroups.itemByName("INDEX").paragraphStyles.itemByName("Index Level 02 Roman");
var IndexLevel03Roman = myDoc.paragraphStyleGroups.itemByName("INDEX").paragraphStyles.itemByName("Index Level 03 Roman");
var IndexLevel04Roman = myDoc.paragraphStyleGroups.itemByName("INDEX").paragraphStyles.itemByName("Index Level 04 Roman");

// Function to modify number lists after the keyword in specific paragraph style
function modifyActionNumbers(paragraphStyle, keyword, position, addValue) {
    // Clear any existing find/change preferences
    app.findGrepPreferences = null;
    app.changeGrepPreferences = null;

    // Set the GREP find pattern to search for paragraphs starting with the exact keyword with word boundaries
    var escapedKeyword = escapeRegExp(keyword);
    app.findGrepPreferences.findWhat = "(?m)^\\b" + escapedKeyword + "\\b.*";

    // Get all found items
    var foundItems = myDoc.findGrep();
    $.writeln("Found items: " + foundItems.length);

    // Loop through all found items
    for (var i = 0; i < foundItems.length; i++) {
        var foundItem = foundItems[i];

        // Check if the found item's paragraph style matches the specified style
        if (foundItem.paragraphs[0].appliedParagraphStyle == paragraphStyle) {
            var text = foundItem.contents; // Get the contents of the found text
            $.writeln("Processing item: " + text);

            var numberPattern = /(\d+)/g;
            var numbers = text.match(numberPattern);
            if (numbers && position > 0 && position <= numbers.length) {
                var num = parseInt(numbers[position - 1], 10);
                var newNum = num + addValue;
                var rangeText = num + '–' + newNum; // Use en dash for range

                // Replace the specific number with the range text, ensuring only the first instance is replaced
                var regex = new RegExp('\\b' + num + '(?!–' + newNum + ')\\b');
                text = text.replace(regex, rangeText);

                $.writeln("Modified text: " + text);
                foundItem.contents = text; // Set the modified text back
            } else {
                $.writeln("Position is out of bounds or invalid.");
            }
        }
    }

    // Clear find/change preferences after the operation
    app.findGrepPreferences = null;
    app.changeGrepPreferences = null;
}

// Function to escape special characters for regex
function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

// Example usage:
modifyActionNumbers(IndexLevel01Roman, "ÁCE", 3, 5);
modifyActionNumbers(IndexLevel01Roman, "Ñamo", 3, 5);
modifyActionNumbers(IndexLevel01Roman, "Áction", 3, 5);
modifyActionNumbers(IndexLevel01Roman, "action", 3, 5);
modifyActionNumbers(IndexLevel01Roman, "action super", 3, 5);
modifyActionNumbers(IndexLevel01Roman, "España", 3, 5);
modifyActionNumbers(IndexLevel01Roman, "Éspaña", 3, 5);
modifyActionNumbers(IndexLevel01Roman, "españa", 3, 5);
modifyActionNumbers(IndexLevel01Roman, "España super", 3, 5);
modifyActionNumbers(IndexLevel02Roman, "Second Level", 3, 5);
modifyActionNumbers(IndexLevel03Roman, "Third Level", 3, 5);
modifyActionNumbers(IndexLevel04Roman, "Fourth Level", 3, 5);



/*
paste the next words on your inDesign document to testing:
input:
ÁCE  10, 20, 30, 40
Ñamo  10, 20, 30, 40
Áction  10, 20, 30, 40
action  10, 20, 30, 40
action  10, 20, 30, 40
action super  10, 20, 30, 40
España  10, 20, 30, 40
Éspaña  10, 20, 30, 40
españa  10, 20, 30, 40
España super  10, 20, 30, 40
Second Level 10, 20, 30, 40
Third Level 10, 20, 30, 40
Fourth Level 10, 20, 30, 40

output:
ÁCE  10, 20, 30–35, 40
Ñamo  10, 20, 30–35, 40
Áction  10, 20, 30–35, 40
action  10, 20, 30–35, 40
action  10, 20, 30–35, 40
action super  10, 20, 30–35, 40
España  10, 20, 30–35, 40
Éspaña  10, 20, 30–35, 40
españa  10, 20, 30–35, 40
España super  10, 20, 30–35, 40
Second Level 10, 20, 30–35, 40
Third Level 10, 20, 30–35, 40
Fourth Level 10, 20, 30–35, 40
*/
