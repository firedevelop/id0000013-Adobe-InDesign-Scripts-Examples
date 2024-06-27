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
    var f1 = File ( path+"/01-Number-Header-to-all-pages.jsx" );
    var f2 = File ( path+"/02-Remove-Unused-Appendix-Paragraph-Styles.jsx" );
    var f3 = File ( path+"/03-Range-page-Appendix.jsx" );
    var f4 = File ( path+"/04-Range-page-Title-Final.jsx" );
    var f5 = File ( path+"/05-None-to-blank-pages.jsx" );
    var f6 = File ( path+"/06-Content.jsx" );
    var f7 = File ( path+"/07-Apply-Master-page-to-general-titles.jsx" );
    var f8 = File ( path+"/08-Parts.jsx" );
    var f9 = File ( path+"/09-Illustration.jsx" );
    var f10 = File ( path+"/10-Title.jsx" );
    var f11 = File ( path+"/11-Appendix-titles.jsx" );
    var f12 = File ( path+"/12-Appendix-titles-exceptions.jsx" );
    var f13 = File ( path+"/13-Title-Final.jsx" );
    var f14 = File ( path+"/14-Cover-page-sadhanas.jsx" );

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
   app.doScript ( f11 );
   app.doScript ( f12 );
   app.doScript ( f13 );
   app.doScript ( f14 );
}
 
batch();

