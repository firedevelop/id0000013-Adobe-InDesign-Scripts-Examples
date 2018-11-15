#target InDesign;

var doc = app.activeDocument;
var xmlTag = doc.xmlElements[0];
var vTag = xmlTag.evaluateXPathExpression("//ix")
for(var i=0;i<vTag.length;i++)
{
    try
    {
        vTag[i].xmlAttributes.add("id",  vTag[i].xmlContent.contents)
     }
    catch(e){}
}