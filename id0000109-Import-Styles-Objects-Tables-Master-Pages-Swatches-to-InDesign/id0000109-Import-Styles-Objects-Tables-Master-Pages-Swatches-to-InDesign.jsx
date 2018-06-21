#target indesign
//=============================================================
//  Script by Luis Felipe Corullón
//  Contato: lf@corullon.com.br
//  Site: http://lf.corullon.com.br/scripts_id_lfc/
//=============================================================

if (!app.documents.length || (app.documents.length && !app.documents[0].visible)) {
    alert("There is no document(s) opened.","Script by LFCorullón");}
else {
    var myDialogImportar = new Window ("dialog","Script by LFCorullón");
    var myStaticGroup = myDialogImportar.add ("group");
    //myDialogImportar.orientation = "row";
    myStaticGroup.add ("statictext", undefined, "Select what you want to import:");
    
    var myCheckGroup = myDialogImportar.add ("group");
    myCheckGroup.orientation = "column";
    myCheckGroup.alignment = "left";
    myCheckGroup.alignChildren = "left";
    var myTextStyles = myCheckGroup.add ("checkbox", undefined, "Paragraphs and Character styles");
    var myObjStyles = myCheckGroup.add ("checkbox", undefined, "Objects styles");
    var myTableStyles = myCheckGroup.add ("checkbox", undefined, "Tables and Cells styles");
    var myMasterPages = myCheckGroup.add ("checkbox", undefined, "Master pages");
    var mySwatches = myCheckGroup.add ("checkbox", undefined, "Swatches");
    
//~     myTextStyles.value = true;
//~     myObjStyles.value = true;
    
    var mySpaceGroup_1 = myDialogImportar.add ("group");
    
    var myButtonGroup = myDialogImportar.add ("group");
    //myButtonGroup.orientation = "row";
    var myButtonOK = myButtonGroup.add ("button", undefined, "Confirm", {name:"OK"});
    var myButtonCancel = myButtonGroup.add ("button", undefined, "Cancel", {name:"Cancel"});
    
    var mySpaceGroup_2 = myDialogImportar.add ("group");
    
    var myCheckGroup_2 = myDialogImportar.add ("group");
    myCheckGroup_2.orientation = "column";
    myCheckGroup_2.alignment = "left";
    myCheckGroup_2.alignChildren = "left";
    var mySortByName = myCheckGroup_2.add ("checkbox", undefined, "Sort styles by name");
    
    mySortByName.value = true;
    
    var myResultImportar = myDialogImportar.show();
    
    if (myResultImportar == 2) {
        exit();
//~         alert ("Operation canceled.","Script by LFCorullón");
        }
    else {
        if (myTextStyles.value == false && myObjStyles.value == false && myTableStyles.value == false && myMasterPages.value == false && mySwatches.value == false) {
            alert ("Nothing selected.");
            exit();
            }
        else {
            app.scriptPreferences.userInteractionLevel = UserInteractionLevels.NEVER_INTERACT;
//~             alert ("In the next Window, select the source file where you want to import styles from. If you want to cancel press the 'Cancel' button.","Script by LFCorullón");
            var myDialogFile = File.openDialog("Select the source file where you want to import styles from", "InDesign files:*indd;*indt");
            if (myDialogFile == null) {
                alert ("Operation canceled.","Script by LFCorullón");
                }
            else {
                
                if (myTextStyles.value == true) {
    //                alert ("Importar estilos de texto","Script by LFCorullón");
                    app.activeDocument.importStyles(ImportFormat.textStylesFormat, myDialogFile, GlobalClashResolutionStrategy.loadAllWithOverwrite);
                    }
                if (myObjStyles.value == true) {
    //                alert ("Importar estilos de objeto","Script by LFCorullón");
                    app.activeDocument.importStyles(ImportFormat.OBJECT_STYLES_FORMAT, myDialogFile, GlobalClashResolutionStrategy.loadAllWithOverwrite);
                    }
                if (myTableStyles.value == true) {
    //                alert ("Importar estilos de tabela","Script by LFCorullón");
                    app.activeDocument.importStyles(ImportFormat.TABLE_STYLES_FORMAT, myDialogFile, GlobalClashResolutionStrategy.loadAllWithOverwrite);
                    app.activeDocument.importStyles(ImportFormat.CELL_STYLES_FORMAT, myDialogFile, GlobalClashResolutionStrategy.loadAllWithOverwrite);
                    }
                if (myMasterPages.value == true) {
    //                alert ("Importar páginas-mestras","Script by LFCorullón");
                    app.activeDocument.loadMasters(myDialogFile, GlobalClashResolutionStrategyForMasterPage.LOAD_ALL_WITH_OVERWRITE);
                    }
                if (mySwatches.value == true) {
    //                alert ("Importar páginas-mestras","Script by LFCorullón");
                    app.activeDocument.loadSwatches (myDialogFile);
                    }
                if (mySortByName.value == true) {
    //                alert ("Classificar estilos por nome","Script by LFCorullón");
                    app.menuActions.itemByID(8505).invoke();
                    app.menuActions.itemByID(8511).invoke();
                    app.menuActions.itemByID(113168).invoke();
                    app.menuActions.itemByID(132113).invoke();
                    app.menuActions.itemByID(132133).invoke();
                    }
                alert ("Success!","Script by LFCorullón");
                app.scriptPreferences.userInteractionLevel = UserInteractionLevels.INTERACT_WITH_ALL;
                }
            }
        }
    }