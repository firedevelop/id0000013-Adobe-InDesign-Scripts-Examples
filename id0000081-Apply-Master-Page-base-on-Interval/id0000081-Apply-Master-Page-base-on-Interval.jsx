// APPLY MASTER TO EVERY NTH PAGE
// Copyright (c) 2017 Mads Wolff
// This script is distributed under the MIT License.
// https://graphicdesign.stackexchange.com/questions/102800/how-to-apply-a-master-page-to-every-nth-page


// MAIN FUNCTIONALITY

// Make a reference to the "pages" of the active document.
var pages = app.activeDocument.pages;

// Make a reference to the "masterSpreads" of the active document.
var masterSpreads = app.activeDocument.masterSpreads;

// Applies a master to every nth page starting at a certain page.
// Takes 3 arguments:
//   masterName   the name of the master spread
//   firstPage    the first page to apply the master to
//   interval     the interval (n) to apply the master at
function applyMasterToEveryNthPage(masterName, firstPage, interval) {

  // Make a reference to the "masterSpread" to apply.
  var masterSpread = masterSpreads.item(masterName);

  // Iterate through the "pages" at the chosen "interval", starting at the chosen "firstPage".
  for (var i = firstPage - 1; i < pages.length; i += interval) {

    // Make a reference to the "page".
    var page = pages.item(i);

    // Apply the "masterSpread" to the "page" by setting its "appliedMaster" attribute.
    page.appliedMaster = masterSpread;

  }

}


// DIALOG

// Stores all the names of the document's master spreads in an array.
function getMasterSpreadNames() {
    var masterSpreadNames = new Array;
    for(i = 0; i < masterSpreads.length; i++){
        masterSpreadNames.push(masterSpreads.item(i).name);
    }
    return masterSpreadNames;
}

// Displays the input dialog.
function displayDialog(){
    var dialog = app.dialogs.add({name:"Add Master To Every Nth Page"});
  var masterSpreadNames = getMasterSpreadNames();
    with (dialog) {
        with (dialogColumns.add()) {
      with (borderPanels.add()) {
        with (dialogColumns.add()) {
          staticTexts.add({staticLabel:"Master:"});
          staticTexts.add({staticLabel:"First page:"});
          staticTexts.add({staticLabel:"Interval:"});
        }
        with (dialogColumns.add()) {
          var masterNameDropdown = dropdowns.add({stringList: masterSpreadNames, selectedIndex: 0, minWidth: 200});
          var firstPageField = integerEditboxes.add({editValue: 1, minimumValue: 1, maximumValue: pages.length});
          var intervalField = integerEditboxes.add({editValue: 2, minimumValue: 1, maximumValue: pages.length});
        }
      }
    }
    }
    var dialogReturn = dialog.show();
    if (dialogReturn == true) {
        var masterName = masterSpreadNames[masterNameDropdown.selectedIndex];
        var firstPage = firstPageField.editValue;
        var interval = intervalField.editValue;
        dialog.destroy();
    applyMasterToEveryNthPage(masterName, firstPage, interval);
    } else {
        dialog.destroy();
    }
}

displayDialog();
