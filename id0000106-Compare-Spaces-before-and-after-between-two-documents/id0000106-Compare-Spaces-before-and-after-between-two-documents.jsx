function compareParagraphSpacing(/*Document*/doc0,/*Document*/doc1,  a,i,n,t,j,bf0,af0,bf1,af1)  
//----------------------------------  
// Assuming than `doc1` and `doc2` share the *same story structure*,  
// this function tells whether they also share the same basic 'spacing  
// structure' between paragraphs (disregarding particular spacing values.)  
// That is, considering any successive indices `i` and `i+1`, and their  
// corresponding paragraphs P_i, P_i+1 (in doc0) and Q_i, Q_i+1 (in doc1),  
// the comparison succeeds under the following assertions:  
// (a) If there is any space between P_i and P_i+1 --due to either  
//     P_i.spaceAfter > 0 or P_i+1.spaceBefore > 0 (or both)-- then  
//     that statement must hold for (Q_i, Q_i+1) as well.  
// (b) If there is no space between P_i and P_i+1 --i.e P_i.spaceAfter = 0  
//     and P_i+1.spaceBefore = 0-- then the same holds for (Q_i, Q_i+1).  
// [REM] If one of the two documents has less paragraphs than the other, the  
// comparison is performed on common paragraph indices using the lowest number.  
{  
    const SEP = '§';  
    const R_SEP = RegExp(SEP,'g');  
    const R_ONE =  RegExp(localize("%1([^0]|0[^%1])[^%1]*",SEP),'g');  
  
    if( !(doc0||0).isValid || !(doc1||0).isValid ){ alert("Invalid documents."); return; }  
      
    // Space before and space after arrays.  
    // ---  
    for( a=[doc0,doc1], i=a.length, n=1/0 ; i-- ; )  
    {  
        t = a[i] = a[i].stories.everyItem().paragraphs.everyItem();  
        if( !(t||0).isValid ){ alert("Invalid paragraphs."); return; }  
        t = a[i] = [t.spaceBefore,t.spaceAfter];  
        (t=t[0].length) < n && (n=t);  
    }  
      
    // Convert each space array into a trace string :: <1|0>+  
    // E.g  "01101" in `spaceBefore` trace means:  
    //      0_PAR_? 1_PAR_? 1_PAR_? 0_PAR_? 1_PAR_? . . .  
    // E.g  "11001" in `spaceAfter` trace means:  
    //      ?_PAR_1 ?_PAR_1 ?_PAR_0 ?_PAR_0 ?_PAR_1 . . .  
    //  
    // ---  
    for( i=a.length ; i-- ; )  
    {  
        n < (t=a[i])[0].length && (t[0].length=t[1].length=n);  
        for( j=2 ; j-- ; t[j]=(SEP+t[j].join(SEP)).replace(R_ONE,SEP+'1').replace(R_SEP,'') );  
          
        // Add dummy zeroes to allow in-sync merging.  
        // ---  
        t[0] = t[0]+'0'; // dummy trailing zero (before string.)  
        t[1] = '0'+t[1]; // dummy leading zero (after string.)  
    }  
      
    // Merge and compare through a 32-bit buffer.  
    // ---  
    bf0=a[0][0]; af0=a[0][1];  
    bf1=a[1][0]; af1=a[1][1];  
    for( t=i=0 ; (!t) && i < n ; i+=32 )  
    {  
        // Merge before/after for each stream, then XOR.  
        // ---  
        t = (parseInt(bf0.substr(i,32),2)|parseInt(af0.substr(i,32),2))  
          ^ (parseInt(bf1.substr(i,32),2)|parseInt(af1.substr(i,32),2));  
    }  
      
    if( !t ){ alert("Paragraph spacing structure of the two documents match :-)"); return; }  
      
    // t != 0 indicates a mismatch at some point.  
    // ---  
    t = Math.min(32,n-i)-(t>>>0).toString(2).length; // First bit set (from left=0 to right=31)  
    i = 1+i+t;  
  
    alert( "Spacing mismatch at paragraph #" + i + " :-(" );  
}  
  
  
// Your stuff:  
// ---  
var docs = app.documents;  
compareParagraphSpacing(docs[0],docs[1]);  