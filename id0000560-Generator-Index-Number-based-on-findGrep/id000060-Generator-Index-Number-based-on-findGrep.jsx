#target indesign

function inyectarVariablesIndice() {
    if (app.documents.length === 0) return;
    var doc = app.activeDocument;

    // --- 1. RADAR AUTOMÁTICO DEL ÍNDICE ---
    app.findTextPreferences = NothingEnum.nothing;
    app.findTextPreferences.findWhat = "Índice general";
    
    var titulosEncontrados = doc.findText();
    
    if (titulosEncontrados.length === 0) {
        alert("❌ No he podido encontrar el texto 'Índice general' en tu documento.");
        app.findTextPreferences = NothingEnum.nothing;
        return;
    }

    var marcoTOC = titulosEncontrados[0].parentTextFrames[0];
    app.findTextPreferences = NothingEnum.nothing;

    // --- 2. CREACIÓN DEL ESTILO DE CARÁCTER (Protección contra Cursivas) ---
    var cStyleNombre = "ia-indice-general-roman";
    var cStyleRoman = doc.characterStyles.itemByName(cStyleNombre);
    
    if (!cStyleRoman.isValid) {
        cStyleRoman = doc.characterStyles.add({name: cStyleNombre});
        try { cStyleRoman.fontStyle = "Regular"; } catch(e) {
            try { cStyleRoman.fontStyle = "Roman"; } catch(e2) {}
        }
    }

    // --- 3. CONFIGURACIÓN DEL FORMATO DE VARIABLE (CORREGIDO) ---
    var formatoRefNombre = "Pagina_Dinamica_IA";
    var formatoRef = doc.crossReferenceFormats.itemByName(formatoRefNombre);
    
    if (!formatoRef.isValid) {
        formatoRef = doc.crossReferenceFormats.add({name: formatoRefNombre});
        try {
            // Añadimos el bloque y le aplicamos el estilo DIRECTAMENTE al bloque
            var bloque = formatoRef.buildingBlocks.add(BuildingBlockTypes.PAGE_NUMBER_BUILDING_BLOCK);
            bloque.appliedCharacterStyle = cStyleRoman;
        } catch(e) {}
    } else {
        // Si el formato ya se había creado antes, nos aseguramos de actualizar su estilo
        if (formatoRef.buildingBlocks.length > 0) {
            formatoRef.buildingBlocks.item(0).appliedCharacterStyle = cStyleRoman;
        }
    }

    // --- 4. LIMPIEZA ABSOLUTA PREVIA ---
    app.findGrepPreferences = NothingEnum.nothing;
    app.changeGrepPreferences = NothingEnum.nothing;
    app.findGrepPreferences.findWhat = "\\s*[\\t~y].*$"; 
    app.changeGrepPreferences.changeTo = ""; 
    marcoTOC.changeGrep();
    app.findGrepPreferences = NothingEnum.nothing;
    app.changeGrepPreferences = NothingEnum.nothing;

    // --- 5. PREPARACIÓN DE BÚSQUEDA ---
    var parrafos = marcoTOC.paragraphs;
    var estilosValidos = {
        "Titulo C-0 0 0 2": true,
        "Titulo D 0-0-0-1": true,
        "Title Final 1.1": true
    };

    var exitos = 0;
    var fallos = 0;

    // --- 6. LECTURA Y VINCULACIÓN ---
    for (var i = 0; i < parrafos.length; i++) {
        var p = parrafos[i];
        var textoCrudo = p.contents;

        if (textoCrudo.length < 5 || textoCrudo.indexOf("Índice general") !== -1) continue;

        var textoBuscar = textoCrudo.replace(/\r/g, '').replace(/[\t\x08]/g, '');
        textoBuscar = textoBuscar.replace(/\n/g, ' ');
        textoBuscar = textoBuscar.replace(/^\s+|\s+$/g, ''); 

        if (textoBuscar === "") continue;

        var grepString = textoBuscar.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        grepString = grepString.replace(/\s+/g, '\\s+');

        app.findGrepPreferences.findWhat = grepString;
        var resultados = doc.findGrep();
        var parrafoDestino = null;

        for (var r = 0; r < resultados.length; r++) {
            var match = resultados[r];
            var estilo = match.paragraphs[0].appliedParagraphStyle.name;

            if (estilosValidos[estilo] === true) {
                parrafoDestino = match.paragraphs[0];
                break; 
            }
        }

        // --- 7. INYECCIÓN DE LA REFERENCIA CRUZADA ---
        if (parrafoDestino) {
            try {
                var nombreDestino = "TOC_Dest_" + i + "_" + Math.floor(Math.random() * 1000000);
                var destino = doc.hyperlinkTextDestinations.add(parrafoDestino.insertionPoints[0], {name: nombreDestino});

                var hasCR = (p.characters.length > 0 && p.characters.item(-1).contents === '\r');
                var puntoInsercion = hasCR ? p.insertionPoints.item(-2) : p.insertionPoints.item(-1);
                
                puntoInsercion.contents = "\x08";

                var puntoVariable = hasCR ? p.insertionPoints.item(-2) : p.insertionPoints.item(-1);

                var fuente = doc.crossReferenceSources.add(puntoVariable, formatoRef);
                doc.hyperlinks.add(fuente, destino);
                
                exitos++;
            } catch(e) {
                fallos++;
            }
        } else {
            fallos++;
        }
    }

    app.findGrepPreferences = NothingEnum.nothing;
    alert("¡Índice Dinámico Creado!\n\n✔ Variables insertadas con éxito: " + exitos + "\n⚠ Títulos no encontrados: " + fallos + "\n\nTipografía: Los números están protegidos contra cursivas gracias al estilo 'ia-indice-general-roman'.");
}

app.doScript(inyectarVariablesIndice, ScriptLanguage.JAVASCRIPT, [], UndoModes.ENTIRE_SCRIPT, "Inyectar Variables Índice con Roman");