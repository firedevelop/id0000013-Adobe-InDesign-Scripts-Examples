/*This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.*/
    
    app.scriptPreferences.userInteractionLevel = UserInteractionLevels.interactWithAll;
    if(app.documents.length == 0){
    alert("No documents are open. Please open a document and try again.");
    exit();
    }
    var myParaStyleList = myGetParagraphStyleNames();
    myDialog = new Window('dialog', 'Input Parameters');
    myDialog.orientation = "column";
    myDialog.alignChildren = ['fill', 'fill'];
    myPStyle = myDialog.add ("dropdownlist", undefined, myParaStyleList);
    myPStyle.title = "Select Style for Find";
    myPStyle.selection=0;
    
    myGroup = myDialog.add( "group" );
    myGroup.orientation = 'row';
    myGroup.okButton = myGroup.add( "button", undefined, "OK" );
    myGroup.cancelButton = myGroup.add( "button", undefined, "Cancel" );
    myGroup.cancelButton.onClick = function() { myDialog = this.window.close( 0 ); }
    myGroup.okButton.onClick = function()
    {
    myParaStyleName=myPStyle.selection.text;
    myDialog= this.window.close( 1 );
    }
    if (myDialog.show()==1) {
        $.writeln("Selected Paragraph Style "+myParaStyleName);
        //alert("Selected Paragraph Style "+myParaStyleName);
    myStyleAsObj = getParagraphStyleByName(myParaStyleName);
    replaceTextUsingGREP ("(\^mera designación)((.+?)$)","mera designación  (véase designación)");
    replaceTextUsingGREP ("(\^vigilancia mental  )((.+?)$)","vigilancia mental  $2, g");
    replaceTextUsingGREP ("(\^attachment  )((.+?)$)","attachment  $2, g");
    replaceTextUsingGREP ("(\^bendiciones  )((.+?)$)","bendiciones  $2, g");
    replaceTextUsingGREP ("(\^bodhichita  )((.+?)$)","bodhichita  $2, g");
    replaceTextUsingGREP ("(\^Bodhisatva  )((.+?)$)","Bodhisatva  $2, g");
    replaceTextUsingGREP ("(\^Brahma  )((.+?)$)","Brahma  $2, g");
    replaceTextUsingGREP ("(\^Buda  )((.+?)$)","Buda  $2, g");
    replaceTextUsingGREP ("(\^Budadharma  )((.+?)$)","Budadharma  $2, g (véase también Dharma)");
    replaceTextUsingGREP ("(\^Budeidad  )((.+?)$)","Budeidad  $2 (véase iluminación)");
    replaceTextUsingGREP ("(\^naturaleza de Buda  )((.+?)$)","naturaleza de Buda  $2, g");
    replaceTextUsingGREP ("(\^Cuerpos de Buda  )((.+?)$)","Cuerpos de Buda  $2, g");
    replaceTextUsingGREP ("(\^Buda Shakyamuni  )((.+?)$)","Buda Shakyamuni  $2, g");
    replaceTextUsingGREP ("(\^enseñanzas de Buda  )((.+?)$)","enseñanzas de Buda  $2 (véase también Dharma)");
    replaceTextUsingGREP ("(\^budismo  )((.+?)$)","budismo  $2 (véase Budadharma)");
    replaceTextUsingGREP ("(\^canal central  )((.+?)$)","canal central  $2, g");
    replaceTextUsingGREP ("(\^rueda de canales  )((.+?)$)","rueda de canales  $2, g");
    replaceTextUsingGREP ("(\^clarividencia  )((.+?)$)","clarividencia  $2, g");
    replaceTextUsingGREP ("(\^luz clara  )((.+?)$)","luz clara  $2, g");
    replaceTextUsingGREP ("(\^compasión  )((.+?)$)","compasión  $2 (véase también gran compasión)");
    replaceTextUsingGREP ("(\^concentración  )((.+?)$)","concentración  $2 (véase también estabilización mental)");
    replaceTextUsingGREP ("(\^confesión  )((.+?)$)","confesión  $2, g");
    replaceTextUsingGREP ("(\^recta conducta  )((.+?)$)","recta conducta  $2, g");
    replaceTextUsingGREP ("(\^consideración por los demás  )((.+?)$)","consideración por los demás  $2");
    replaceTextUsingGREP ("(\^satisfacción  )((.+?)$)","satisfacción  $2, g");
    replaceTextUsingGREP ("(\^naturaleza convencional  )((.+?)$)","naturaleza convencional  $2");
    replaceTextUsingGREP ("(\^dedicación  )((.+?)$)","dedicación  $2, g");
    replaceTextUsingGREP ("(\^tiempos de degeneración  )((.+?)$)","tiempos de degeneración  $2, g");
    replaceTextUsingGREP ("(\^engaños\/perturbaciones mentales  )((.+?)$)","engaños\/perturbaciones mentales  $2, g");
    replaceTextUsingGREP ("(\^reino del deseo  )((.+?)$)","reino del deseo  $2, g");
    replaceTextUsingGREP ("(\^Dharma  )((.+?)$)","Dharma  $2, g (véanse también Budadharma, práctica de Dharma, Rueda del Dharma)");
    replaceTextUsingGREP ("(\^Dharmapala  )((.+?)$)","Dharmapala  g");
    replaceTextUsingGREP ("(\^Dharmakaya  )((.+?)$)","Dharmakaya  g");
    replaceTextUsingGREP ("(\^apariencias duales  )((.+?)$)","apariencias duales  $2, g");
    replaceTextUsingGREP ("(\^esfuerzo  )((.+?)$)","esfuerzo  $2 (véase también seis perfecciones)");
    replaceTextUsingGREP ("(\^vacuidad  )((.+?)$)","vacuidad  $2, g (véanse también naturaleza última, verdad última, sabiduría que realiza la vacuidad)");
    replaceTextUsingGREP ("(\^sabiduría exce  )((.+?)$)","sabiduría exce  $2, g");
    replaceTextUsingGREP ("(\^fe  )((.+?)$)","fe  $2, g");
    replaceTextUsingGREP ("(\^Destructor del enemigo  )((.+?)$)","Destructor del enemigo  $2, g");
    replaceTextUsingGREP ("(\^Cuerpo de la Forma  )((.+?)$)","Cuerpo de la Forma  $2, g");
    replaceTextUsingGREP ("(\^reino inmaterial  )((.+?)$)","reino inmaterial  $2, g");
    replaceTextUsingGREP ("(\^reino de la forma  )((.+?)$)","reino de la forma  $2, g");
    replaceTextUsingGREP ("(\^Cuatro nobles verdades  )((.+?)$)","Cuatro nobles verdades  $2, g");
    replaceTextUsingGREP ("(\^imagen genérica  )((.+?)$)","imagen genérica  $2, g");
    replaceTextUsingGREP ("(\^Gueshe Langri Tangpa  )((.+?)$)","Gueshe Langri Tangpa  $2");
    replaceTextUsingGREP ("(\^generosidad  )((.+?)$)","generosidad  $2 (véase también seis perfecciones)");
    replaceTextUsingGREP ("(\^dioses  )((.+?)$)","dioses  $2");
    replaceTextUsingGREP ("(\^gran compasión  )((.+?)$)","gran compasión  $2 (véase también compasión)");
    replaceTextUsingGREP ("(\^gran liberación  )((.+?)$)","gran liberación  $2, g");
    replaceTextUsingGREP ("(\^hinayana  )((.+?)$)","hinayana  $2");
    replaceTextUsingGREP ("(\^existencia humana  )((.+?)$)","existencia humana  $2 (véase también preciosa existencia humana)");
    replaceTextUsingGREP ("(\^ignorancia  )((.+?)$)","ignorancia  $2 (véase también ignorancia del aferramiento propio)");
    replaceTextUsingGREP ("(\^impresiones  )((.+?)$)","impresiones  $2, g");
    replaceTextUsingGREP ("(\^designación, mera  )((.+?)$)","designación, mera  $2, g");
    replaceTextUsingGREP ("(\^Indra  )((.+?)$)","Indra  $2, g");
    replaceTextUsingGREP ("(\^aires internos  )((.+?)$)","aires internos  $2, g");
    replaceTextUsingGREP ("(\^intención  )((.+?)$)","intención  $2, g");
    replaceTextUsingGREP ("(\^estado intermedio  )((.+?)$)","estado intermedio  $2, g");
    replaceTextUsingGREP ("(\^celos  )((.+?)$)","celos  $2, g");
    replaceTextUsingGREP ("(\^karma  )((.+?)$)","karma  $2 (véanse también acciones perjudiciales, acciones virtuosas, físico, verbal y mental)");
    replaceTextUsingGREP ("(\^Lamrim  )((.+?)$)","Lamrim  $2, g (véase también etapas del camino)");
    replaceTextUsingGREP ("(\^Tierra de los Treinta y Tres Cielos  )((.+?)$)","Tierra de los Treinta y Tres Cielos  $2, g");
    replaceTextUsingGREP ("(\^seres vivos  )((.+?)$)","seres vivos  $2, g");
    replaceTextUsingGREP ("(\^Maitreya  )((.+?)$)","Maitreya  $2, g");
    replaceTextUsingGREP ("(\^mantra  )((.+?)$)","mantra  $2");
    replaceTextUsingGREP ("(\^mara  )((.+?)$)","mara  $2, g");
    replaceTextUsingGREP ("(\^meditación estabilizada  )((.+?)$)","meditación estabilizada  $2, g");
    replaceTextUsingGREP ("(\^percepción mental  )((.+?)$)","percepción mental  $2, g");
    replaceTextUsingGREP ("(\^estabilización mental  )((.+?)$)","estabilización mental  $2 (véase también seis perfecciones)");
    replaceTextUsingGREP ("(\^méritos  )((.+?)$)","méritos  $2, g");
    replaceTextUsingGREP ("(\^mente  )((.+?)$)","mente  $2 (véanse también percepción mental, consciencias sensoriales)");
    replaceTextUsingGREP ("(\^retentiva mental  )((.+?)$)","retentiva mental  $2, g");
    replaceTextUsingGREP ("(\^disciplina moral  )((.+?)$)","disciplina moral  $2 (véase también seis perfecciones)");
    replaceTextUsingGREP ("(\^Nagaryhuna  )((.+?)$)","Nagaryhuna  $2, g");
    replaceTextUsingGREP ("(\^Nueva Tradición Kadampa \– Unión Internacional de Budismo Kadampa  )((.+?)$)","Nueva Tradición Kadampa \– Unión Internacional de Budismo Kadampa  $2, g");
    replaceTextUsingGREP ("(\^nueve permanencias mentales  )((.+?)$)","nueve permanencias mentales  $2, g");
    replaceTextUsingGREP ("(\^obstrucciones a la liberación  )((.+?)$)","obstrucciones a la liberación  $2, g");
    replaceTextUsingGREP ("(\^obstrucciones a la omnisciencia  )((.+?)$)","obstrucciones a la omnisciencia  $2, g");
    replaceTextUsingGREP ("(\^paciencia  )((.+?)$)","paciencia  $2 (véase también seis perfecciones)");
    replaceTextUsingGREP ("(\^Sutra de la perfección de la sabiduría  )((.+?)$)","Sutra de la perfección de la sabiduría  $2, g");
    replaceTextUsingGREP ("(\^mente primaria  )((.+?)$)","mente primaria  $2, g");
    replaceTextUsingGREP ("(\^postración  )((.+?)$)","postración  $2, g");
    replaceTextUsingGREP ("(\^puyha  )((.+?)$)","puyha  $2, g");
    replaceTextUsingGREP ("(\^tierra pura  )((.+?)$)","tierra pura  $2, g");
    replaceTextUsingGREP ("(\^purificación  )((.+?)$)","purificación  $2, g");
    replaceTextUsingGREP ("(\^realizaciones  )((.+?)$)","realizaciones  $2, g");
    replaceTextUsingGREP ("(\^renacimiento  )((.+?)$)","renacimiento  $2, (véanse también renacimiento superior, renacimiento inferior, reencarnación)");
    replaceTextUsingGREP ("(\^reencarnación  )((.+?)$)","reencarnación  $2 (véase también renacimiento)");
    replaceTextUsingGREP ("(\^Sangha  )((.+?)$)","Sangha  $2, g");
    replaceTextUsingGREP ("(\^estimación propia  )((.+?)$)","estimación propia  $2, g");
    replaceTextUsingGREP ("(\^ignorancia del aferramiento propio  )((.+?)$)","ignorancia del aferramiento propio  $2");
    replaceTextUsingGREP ("(\^consciencia sensorial  )((.+?)$)","consciencia sensorial  $2, g");
    replaceTextUsingGREP ("(\^Shantideva  )((.+?)$)","Shantideva  $2, g");
    replaceTextUsingGREP ("(\^seis reinos  )((.+?)$)","seis reinos  $2 (véanse también renacimiento superior, renacimiento inferior)");
    replaceTextUsingGREP ("(\^Guía Espiritual  )((.+?)$)","Guía Espiritual  $2, g");
    replaceTextUsingGREP ("(\^etapas del camino  )((.+?)$)","etapas del camino  $2 (véase también Lamrim)");
    replaceTextUsingGREP ("(\^Ser Superior  )((.+?)$)","Ser Superior  $2, g");
    replaceTextUsingGREP ("(\^visión superior  )((.+?)$)","visión superior  $2, g");
    replaceTextUsingGREP ("(\^flexibilidad  )((.+?)$)","flexibilidad  $2, g");
    replaceTextUsingGREP ("(\^Cuerpo de Emanación Supremo  )((.+?)$)","Cuerpo de Emanación Supremo  $2, g (véase también Cuerpos de Buda)");
    replaceTextUsingGREP ("(\^tantra  )((.+?)$)","tantra  $2 (véase también mantra secreto)");
    replaceTextUsingGREP ("(\^diez direcciones  )((.+?)$)","diez direcciones  $2, g");
    replaceTextUsingGREP ("(\^Tres Joyas  )((.+?)$)","Tres Joyas  $2, g");
    replaceTextUsingGREP ("(\^permanencia apacible  )((.+?)$)","permanencia apacible  $2, g");
    replaceTextUsingGREP ("(\^transferencia de consciencia  )((.+?)$)","transferencia de consciencia  $2, g");
    replaceTextUsingGREP ("(\^Cuerpo de la Verdad  )((.+?)$)","Cuerpo de la Verdad  $2, g");
    replaceTextUsingGREP ("(\^naturaleza última  )((.+?)$)","naturaleza última  $2, g (véanse también vacuidad, verdad última)");
    replaceTextUsingGREP ("(\^concentración semejante al vajra  )((.+?)$)","concentración semejante al vajra  $2, g");
    replaceTextUsingGREP ("(\^sabiduría  )((.+?)$)","sabiduría  $2 (véanse también seis perfecciones, visión superior, sabiduría que realiza la vacuidad)");
    replaceTextUsingGREP ("(\^sabiduría que realiza la vacuidad  )((.+?)$)","sabiduría que realiza la vacuidad  $2 (véanse también vacuidad, realización directa de la, visión superior)");

    
    }
    
    /* FUNCTIONS */
    function myGetParagraphStyleNames()
    {
    var result = [];
    var myParagraphStyles = app.activeDocument.allParagraphStyles;
    var myParagraphStyleName, obj;
    for(var i=0; i < myParagraphStyles.length ; i++)
    {
    myParagraphStyleName = myParagraphStyles[i].name;
    obj = myParagraphStyles[i];
    while(obj.parent instanceof ParagraphStyleGroup)
    {
    myParagraphStyleName = obj.parent.name + ":" + myParagraphStyleName;
    obj = obj.parent;
    }
    result.push(myParagraphStyleName);
    } // for
    result.shift(); // delete "No Paragraph Style"
    return result;
    } // fnc
    
    function getParagraphStyleByName(myStyleName)
    {
    var myParagraphStyles = app.activeDocument.allParagraphStyles;
    var myParagraphStyleName, obj;
    for(var i=0; i < myParagraphStyles.length ; i++)
    {
    myParagraphStyleName = myParagraphStyles[i].name;
    obj = myParagraphStyles[i];
    while(obj.parent instanceof ParagraphStyleGroup)
    {
    myParagraphStyleName = obj.parent.name + ":" + myParagraphStyleName;
    obj = obj.parent;
    }
    if(myParagraphStyleName == myStyleName) return myParagraphStyles[i];
    } // for
    
    } // fnc
    
    function replaceTextUsingGREP (input, output) {
    app.findGrepPreferences = app.changeGrepPreferences = NothingEnum.nothing;
    app.findGrepPreferences.findWhat = input;
    app.changeGrepPreferences.changeTo = output;
    app.findGrepPreferences.appliedParagraphStyle = myStyleAsObj;
    app.activeDocument.changeGrep();
    //var changedResults = app.activeDocument.changeGrep();
    app.findGrepPreferences = app.changeGrepPreferences = NothingEnum.nothing;
    }