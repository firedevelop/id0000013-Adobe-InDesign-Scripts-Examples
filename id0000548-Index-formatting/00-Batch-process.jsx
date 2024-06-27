// http://www.rorohiko.com/wordpress/batch-textexport/
// https://www.indesignjs.de/extendscriptAPI/indesign-latest/#ScriptPreference.html

var thisScript = new File($.fileName);
var containingFolder = new Folder(thisScript.parent.absoluteURI);
//alert("This script is in " + containingFolder.absoluteURI);
var path = containingFolder.absoluteURI;
var appFolder = new Folder(Folder.appPackage.parent.absoluteURI);
//alert("The app folder is at " + Folder.decode(appFolder.absoluteURI));

function batch()
{
    var f1 = File ( path+"/01-Add-G-glosary-and-cross-references-1-Level.jsx" );
    var f2 = File ( path+"/02-Add-G-glosary-and-cross-references-2-3-4-Level.jsx" );
    var f3 = File ( path+"/03-Fix-general-errors.jsx" );
    var f4 = File ( path+"/04-Apply-Character-Style-Italics.jsx" );
    var f5 = File ( path+"/05-Apply-Character-Style-Roman.jsx" );
    var f6 = File ( path+"/06-Apply-Paragraph-Style-Index-Section-Head.jsx" );
    var f7 = File ( path+"/07-Add-Tracking.jsx" );
    var f8 = File ( path+"/08-Add-Column-Break.jsx" );
    var f9 = File ( path+"/09-Clean-all-overrides.jsx" );
    var f10 = File ( path+"/10-Find-errors.jsx" );

   app.doScript ( f1 );
   app.doScript ( f2 );
   app.doScript ( f3 );
   app.doScript ( f4 );
   app.doScript ( f5 );
   app.doScript ( f6 );
   app.doScript ( f7 );
   app.doScript ( f8 );
   app.doScript ( f9 );
   app.doScript ( f10 );

}
 
batch();