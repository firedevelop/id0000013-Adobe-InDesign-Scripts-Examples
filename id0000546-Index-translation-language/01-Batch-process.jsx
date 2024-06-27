// http://www.rorohiko.com/wordpress/batch-textexport/
// https://www.indesignjs.de/extendscriptAPI/indesign-latest/#ScriptPreference.html
// Batch to repeat many times the same script

var thisScript = new File($.fileName);
var containingFolder = new Folder(thisScript.parent.absoluteURI);
//alert("This script is in " + containingFolder.absoluteURI);
var path = containingFolder.absoluteURI;
var appFolder = new Folder(Folder.appPackage.parent.absoluteURI);
//alert("The app folder is at " + Folder.decode(appFolder.absoluteURI));

function batch()
{
   var f1 = File ( path+"/02-Translation-from-UK-to-ES.jsx" );
   var f2 = File ( path+"/02-Translation-from-UK-to-ES.jsx" );
   var f3 = File ( path+"/02-Translation-from-UK-to-ES.jsx" );
   var f4 = File ( path+"/02-Translation-from-UK-to-ES.jsx" );
   var f5 = File ( path+"/02-Translation-from-UK-to-ES.jsx" );

   app.doScript ( f1 );
   app.doScript ( f2 );
   app.doScript ( f3 );
   app.doScript ( f4 );
   app.doScript ( f5 );
}
 
batch();