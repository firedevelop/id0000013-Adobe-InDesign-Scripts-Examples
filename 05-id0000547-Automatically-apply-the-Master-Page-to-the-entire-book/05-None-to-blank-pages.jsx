
// (c) Harbs www.in-tools.com
var appVersion = parseFloat(app.version);
if(appVersion<6){main();}
else{app.doScript (main,undefined,undefined,UndoModes.FAST_ENTIRE_SCRIPT,"Apply None Master to Empty Pages")}

function main(){
	var emptyOption = true;
	var pages = app.documents[0].pages.everyItem().getElements();
	for(var i=0;i<pages.length;i++){
		var changeMaster = true;
		if(pages[i].pageItems.length>0){
	 		var items = pages[i].pageItems.everyItem().getElements();
	 		if(emptyOption==0){
	 			if(items.length>0){changeMaster=false}
	 		} else {
				for(var j=0;j<items.length;j++){
					if(!(items[j] instanceof TextFrame)){changeMaster=false;break}
					if(items[j].contents!=""){changeMaster=false;break}
				}
			}
		}
		if(changeMaster){pages[i].appliedMaster=null;}
	}
}














//_____________________________________________________________________________________
//        SCRIPT WITH THE POP UP WINDOW: START Reset all pages with the Master Page Default 


/* (c) Harbs www.in-tools.com
var appVersion = parseFloat(app.version);
if(appVersion<6){main();}
else{app.doScript (main,undefined,undefined,UndoModes.FAST_ENTIRE_SCRIPT,"Apply None Master to Empty Pages")}

function main(){
	var d=app.dialogs.add({name:"Define Empty Pages"});
	var radioBtns = d.dialogColumns.add().radiobuttonGroups.add();
	radioBtns.radiobuttonControls.add({staticLabel:"No Text (recomended)",checkedState:true});
	radioBtns.radiobuttonControls.add({staticLabel:"No Objects"});
	if(!d.show()){d.destroy();return}
	var emptyOption = radioBtns.selectedButton;
	d.destroy();
	var pages = app.documents[0].pages.everyItem().getElements();
	for(var i=0;i<pages.length;i++){
		var changeMaster = true;
		if(pages[i].pageItems.length>0){
	 		var items = pages[i].pageItems.everyItem().getElements();
	 		if(emptyOption==0){
	 			if(items.length>0){changeMaster=false}
	 		} else {
				for(var j=0;j<items.length;j++){
					if(!(items[j] instanceof TextFrame)){changeMaster=false;break}
					if(items[j].contents!=""){changeMaster=false;break}
				}
			}
		}
		if(changeMaster){pages[i].appliedMaster=null;}
	}
}
*/

