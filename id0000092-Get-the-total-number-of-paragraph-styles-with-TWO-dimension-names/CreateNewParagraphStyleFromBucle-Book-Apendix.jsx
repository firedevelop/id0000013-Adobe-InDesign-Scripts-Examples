// https://forums.adobe.com/thread/1099501
// https://forums.adobe.com/thread/1488484
// https://stackoverflow.com/questions/28486351/indesign-cc-script-to-apply-paragraph-styles-to-multiple-paragraphs
// http://jongware.mit.edu/idcs5/pc_ParagraphStyle.html
// NOTE: sometimes the fontFamily don't work and other font appear in your styles. To be sure works you can change the default Indesign font follow: https://indesignsecrets.com/3-ways-change-default-font-indesign-dont-edit-basic-paragraph.php

var doc = app.documents.item(0);
for(var i=1;i<22;i++)
{
    for(var j=1;j<8;j++){
    try{
        var paraStyleBodyText = doc.paragraphStyles.add({
            name: "Book Appendix "+i+"."+j, 
            fontFamily: "Palatino LT Std", 
            fontStyle: "Italic", 
            pointSize: 16.5,
            leading: 29.5,
            spaceBefore: 0,
            spaceAfter: 10,
            appliedLanguage: "Spanish",
            justification: Justification.CENTER_ALIGN,
            hyphenation: false,
            hyphenWeight: 5,
            hyphenateAfterFirst: 2,
            hyphenateBeforeLast: 2,
            hyphenateLadderLimit: 2,
            hyphenationZone: 0,
            hyphenateCapitalizedWords: false,
            hyphenateLastWord: false,
            hyphenateAcrossColumns: false,
            minimumWordSpacing:85,
            minimumLetterSpacing:-2,
            minimumGlyphScaling:97,
            desiredWordSpacing:100,
            desiredLetterSpacing:0,
            desiredGlyphScaling:100,
            maximumWordSpacing:110,
            maximumLetterSpacing:2,
            maximumGlyphScaling:103,
            autoLeading: 120,
            singleWordJustification: SingleWordJustification.FULLY_JUSTIFIED,
            composer: "Adobe Paragraph Composer",

            
        });
    }
    catch(e){
        //alert("The next Style already exist: " + "Book Appendix "+i+"."+j);
    }}
}