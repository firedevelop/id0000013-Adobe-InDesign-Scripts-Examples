#target indesign
//=============================================================
//  Script by Luis Felipe Corullón
//  Contato: lf@corullon.com.br
//  Site: http://lf.corullon.com.br
//=============================================================

var myDialogSearch = new Window ("dialog","Script by LFCorullón");
var myStaticGroup = myDialogSearch.add ("group");

myStaticGroup.add ("statictext", undefined, "Rename styles using FIND/CHANGE");
var myFindGroup = myDialogSearch.add ("group");
myFindGroup.orientation = "row";
myFindGroup.alignment = "left";
myFindGroup.alignChildren = "left";
myFindGroup.add ("statictext", undefined, "FIND:");
var myFind = myFindGroup.add("edittext", undefined, "");
myFind.characters = 35;
myFind.active = true;
var myChangeGroup = myDialogSearch.add ("group");
myChangeGroup.orientation = "row";
myChangeGroup.alignment = "left";
myChangeGroup.alignChildren = "left";
myChangeGroup.add ("statictext", undefined, "CHANGE:");
var myChange = myChangeGroup.add("edittext", undefined, "");
myChange.characters = 32;
var myChoicesGroup = myDialogSearch.add ("group");
myChoicesGroup.orientation = "column";
myChoicesGroup.alignment = "left";
myChoicesGroup.alignChildren = "left";
var myRepeat = myChoicesGroup.add ("checkbox", undefined, "Search only the first instance of FIND field");
var myUpper = myChoicesGroup.add ("checkbox", undefined, "Convert style name to UpperCase (except prefix)");

var myCheckGroup = myDialogSearch.add("panel");
myCheckGroup.preferredSize = [undefined,70];
myCheckGroup.orientation = "row";
var myCheckGroup1 = myCheckGroup.add ("group");
myCheckGroup1.preferredSize = [130,undefined];
myCheckGroup1.orientation = "column";
myCheckGroup1.alignment = "left";
myCheckGroup1.alignChildren = "left";
var myParaStyles = myCheckGroup1.add ("checkbox", undefined, "Paragraphs");
var myCharStyles = myCheckGroup1.add ("checkbox", undefined, "Characters");
var myCheckGroup2 = myCheckGroup.add ("group");
myCheckGroup2.preferredSize = [130,undefined];
myCheckGroup2.orientation = "column";
myCheckGroup2.alignment = "right";
myCheckGroup2.alignChildren = "left";
var myObjStyles = myCheckGroup2.add ("checkbox", undefined, "Objects");
var myTableStyles = myCheckGroup2.add ("checkbox", undefined, "Tables and Cells");

myParaStyles.value = true;
myCharStyles.value = true;
myObjStyles.value = false;
myTableStyles.value = false;
myRepeat.value = false;
myUpper.value = true;

var myButtonGroup = myDialogSearch.add ("group");
//myButtonGroup.orientation = "row";
var myButtonOK = myButtonGroup.add ("button", undefined, "OK", {name:"OK"});
var myButtonCancel = myButtonGroup.add ("button", undefined, "Cancel", {name:"Cancel"});

var myResultImportar = myDialogSearch.show();

if (myResultImportar == 2) {
//~     alert ("Operação cancelada.","Script by LFCorullón");
    }
else {
    if (myUpper.value == false && myFind.text == "" && myChange.text != "") {
        alert ("FIND field is empty, but CHANGE field has text.","Script by LFCorullón");
        }
    else if (myUpper.value == false && myFind.text == "") {
        alert ("FIND field is empty.","Script by LFCorullón");
        }
    else {
        if (myParaStyles.value == true) {
            changePara();
            }
        if (myCharStyles.value == true) {
            changeChar();
            }
        if (myObjStyles.value == true) {
            changeObj();
            }
        if (myTableStyles.value == true) {
            changeTables();
            }
        alert("Done!");
        }
    }

function changePara() {
    for (var i = 0; i < app.activeDocument.allParagraphStyles.length; i++){
        if (i > 1) {
//~         .REPLACE(FIND , REPLACE). PARA USAR GREP /xxx/g PARA USAR STRING "xxx"
            if (myRepeat.value == true) {
                app.activeDocument.allParagraphStyles[i].name = app.activeDocument.allParagraphStyles[i].name.replace(RegExp(myFind.text, "i") , myChange.text);
                }
            else {
                app.activeDocument.allParagraphStyles[i].name = app.activeDocument.allParagraphStyles[i].name.replace(RegExp(myFind.text, "gi") , myChange.text);
                }
            if (myUpper.value == true) {
                app.activeDocument.allParagraphStyles[i].name = app.activeDocument.allParagraphStyles[i].name.toUpperCase();
                var paraStyleName = app.activeDocument.allParagraphStyles[i].name;
                var paraNamePrefix = paraStyleName.substr(0,paraStyleName.indexOf("_"));
                var paraNamePrefixLower = paraNamePrefix.toLowerCase();
//~         PREFIXO ATÉ O PRIMEIRO _ EM CAIXA BAIXA
                app.activeDocument.allParagraphStyles[i].name = app.activeDocument.allParagraphStyles[i].name.replace(paraNamePrefix , paraNamePrefixLower);
                }
            }
        }
    for (var i = 0; i < app.activeDocument.paragraphStyleGroups.length; i++){
        try {
            app.activeDocument.paragraphStyleGroups[i].name = app.activeDocument.paragraphStyleGroups[i].name.replace(RegExp(myFind.text, "gi") , myChange.text);
            }
        catch(e) {}
        }
    }
function changeChar() {
    for (var i = 0; i < app.activeDocument.allCharacterStyles.length; i++){
        if (i > 0) {
//~         .REPLACE(FIND , REPLACE). PARA USAR GREP /xxx/g PARA USAR STRING "xxx"
            if (myRepeat.value == true) {
                app.activeDocument.allCharacterStyles[i].name = app.activeDocument.allCharacterStyles[i].name.replace(RegExp(myFind.text, "i") , myChange.text);
                }
            else {
                app.activeDocument.allCharacterStyles[i].name = app.activeDocument.allCharacterStyles[i].name.replace(RegExp(myFind.text, "gi") , myChange.text);
                }
            if (myUpper.value == true) {
                app.activeDocument.allCharacterStyles[i].name = app.activeDocument.allCharacterStyles[i].name.toUpperCase();
                var charStyleName = app.activeDocument.allCharacterStyles[i].name;
                var charNamePrefix = charStyleName.substr(0,charStyleName.indexOf("_"));
                var charNamePrefixLower = charNamePrefix.toLowerCase();
//~         PREFIXO ATÉ O PRIMEIRO _ EM CAIXA BAIXA
                app.activeDocument.allCharacterStyles[i].name = app.activeDocument.allCharacterStyles[i].name.replace(charNamePrefix , charNamePrefixLower);
                }
            }
        }
    }
function changeObj() {
    for (var i = 0; i < app.activeDocument.objectStyles.length; i++){
        if (i > 4) {
//~         .REPLACE(FIND , REPLACE). PARA USAR GREP /xxx/g PARA USAR STRING "xxx"
            if (myRepeat.value == true) {
                app.activeDocument.objectStyles[i].name = app.activeDocument.objectStyles[i].name.replace(RegExp(myFind.text, "i") , myChange.text);
                }
            else {
                app.activeDocument.objectStyles[i].name = app.activeDocument.objectStyles[i].name.replace(RegExp(myFind.text, "gi") , myChange.text);
                }
            if (myUpper.value == true) {
                app.activeDocument.objectStyles[i].name = app.activeDocument.objectStyles[i].name.toUpperCase();
                var objStyleName = app.activeDocument.objectStyles[i].name;
                var objNamePrefix = objStyleName.substr(0,objStyleName.indexOf("_"));
                var objNamePrefixLower = objNamePrefix.toLowerCase();
//~         PREFIXO ATÉ O PRIMEIRO _ EM CAIXA BAIXA
                app.activeDocument.objectStyles[i].name = app.activeDocument.objectStyles[i].name.replace(objNamePrefix , objNamePrefixLower);
                }
            }
        }
    }
function changeTables() {
    for (var i = 0; i < app.activeDocument.tableStyles.length; i++){
        if (i > 1) {
//~         .REPLACE(FIND , REPLACE). PARA USAR GREP /xxx/g PARA USAR STRING "xxx"
            if (myRepeat.value == true) {
                app.activeDocument.tableStyles[i].name = app.activeDocument.tableStyles[i].name.replace(RegExp(myFind.text, "i") , myChange.text);
                }
            else {
                app.activeDocument.tableStyles[i].name = app.activeDocument.tableStyles[i].name.replace(RegExp(myFind.text, "gi") , myChange.text);
                }
            if (myUpper.value == true) {
                app.activeDocument.tableStyles[i].name = app.activeDocument.tableStyles[i].name.toUpperCase();
                var tableStyleName = app.activeDocument.tableStyles[i].name;
                var tableNamePrefix = tableStyleName.substr(0,tableStyleName.indexOf("_"));
                var tableNamePrefixLower = tableNamePrefix.toLowerCase();
//~         PREFIXO ATÉ O PRIMEIRO _ EM CAIXA BAIXA
                app.activeDocument.tableStyles[i].name = app.activeDocument.tableStyles[i].name.replace(tableNamePrefix , tableNamePrefixLower);
                }
            }
        }
    for (var i = 0; i < app.activeDocument.cellStyles.length; i++){
        if (i > 0) {
//~         .REPLACE(FIND , REPLACE). PARA USAR GREP /xxx/g PARA USAR STRING "xxx"
            if (myRepeat.value == true) {
                app.activeDocument.cellStyles[i].name = app.activeDocument.cellStyles[i].name.replace(RegExp(myFind.text, "i") , myChange.text);
                }
            else {
                app.activeDocument.cellStyles[i].name = app.activeDocument.cellStyles[i].name.replace(RegExp(myFind.text, "gi") , myChange.text);
                }
            if (myUpper.value == true) {
                app.activeDocument.cellStyles[i].name = app.activeDocument.cellStyles[i].name.toUpperCase();
                var cellStyleName = app.activeDocument.cellStyles[i].name;
                var cellNamePrefix = cellStyleName.substr(0,cellStyleName.indexOf("_"));
                var cellNamePrefixLower = cellNamePrefix.toLowerCase();
//~         PREFIXO ATÉ O PRIMEIRO _ EM CAIXA BAIXA
                app.activeDocument.cellStyles[i].name = app.activeDocument.cellStyles[i].name.replace(cellNamePrefix , cellNamePrefixLower);
                }
            }
        }
    }