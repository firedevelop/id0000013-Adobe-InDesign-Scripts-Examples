/*clean Adobe ExtendScript Console Javascript*/  
//https://forums.adobe.com/thread/2505091  
if (app.name === "ExtendScript Toolkit")   
        {  
            app.clc();  
            } else {  
                var estApp= BridgeTalk.getSpecifier("estoolkit");  
            if(estApp) {  
                var bt = new BridgeTalk;   
                bt.target = estApp;   
                bt.body = "app.clc()";   
                bt.send();  
                }  
            }    
 var thisScript = File($.fileName);    
  
$.writeln("thisScript " + thisScript.name);  
$.writeln("thisScript " + thisScript.path);  
  
var containingFolder = Folder(thisScript.path+"/Index/");    
  
    
function batch()    
{    
    list = containingFolder.getFiles ("*.jsx");  // list is an ARRAY     
    $.writeln("  list " +  list.length);  
    list.sort();     
        for (i=0; i < list.length; i++){    
                var f = File (list[i] );  
                $.writeln("\n_________ Running the Script: " + f.name + " ________");    
                app.doScript ( f );    
            }    
                  
}      
batch(); 