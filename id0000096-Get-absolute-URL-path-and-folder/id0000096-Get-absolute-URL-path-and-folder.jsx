var thisScript = new File($.fileName);
var containingFolder = new Folder(thisScript.parent.absoluteURI);
alert("This script is in " + containingFolder.absoluteURI);

var path = containingFolder.absoluteURI;

var appFolder = new Folder(Folder.appPackage.parent.absoluteURI);
alert("The app folder is at " + Folder.decode(appFolder.absoluteURI));

function batch()  
{  
   var f1 = File ( path+"/script_01.jsx" );  
   var f2 = File ( path+"/script_02.jsx" );  
   var f3 = File ( path+"/script_03.jsx" ); 
  
   app.doScript ( f1 );  
   app.doScript ( f2 );  
   app.doScript ( f3 );  
}  
  
batch();  