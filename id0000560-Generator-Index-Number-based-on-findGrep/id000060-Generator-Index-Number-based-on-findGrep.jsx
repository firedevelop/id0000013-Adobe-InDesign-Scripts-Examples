#target indesign

function inyectarNumerosIndice() {
    if (app.documents.length === 0) return;
    var doc = app.activeDocument;

    // 1. Verificación de selección
    if (app.selection.length === 0 || app.selection[0].constructor.name !== "TextFrame") {
        alert("Por favor, selecciona con la flecha negra la caja de texto de tu Índice general antes de ejecutar.");
        return;
    }

    var marcoTOC = app.selection[0];
    var parrafos = marcoTOC.paragraphs;
    
    // Tus dos estilos estrictos
    var estilosValidos = ["Titulo C-0 0 0 2", "Titulo D 0-0-0-1"];

    app.findGrepPreferences = NothingEnum.nothing;

    var exitos = 0;
    var fallos = 0;

    // Función segura para obtener el número de página incluso si está agrupado
    function obtenerPagina(obj) {
        while (obj != null) {
            if (obj.constructor.name === "Page") return obj.name;
            if (obj.hasOwnProperty("parentPage") && obj.parentPage != null) return obj.parentPage.name;
            obj = obj.parent;
        }
        return null;
    }

    for (var i = 0; i < parrafos.length; i++) {
        var p = parrafos[i];
        var textoCrudo = p.contents;

        // Ignorar el título "Índice general" o líneas muy cortas/vacías
        if (textoCrudo.length < 5 || textoCrudo.indexOf("Índice general") !== -1) continue;

        // 2. Limpieza del texto del Índice para usarlo como motor de búsqueda
        // Quitamos retorno de carro y tabuladores (normal \t y de sangría derecha \x08)
        var textoBuscar = textoCrudo.replace(/\r/g, '').replace(/[\t\x08]/g, '');
        
        // Convertimos saltos de línea forzados (\n) en espacios temporales
        textoBuscar = textoBuscar.replace(/\n/g, ' ');
        textoBuscar = textoBuscar.replace(/^\s+|\s+$/g, ''); // Limpiar extremos

        if (textoBuscar === "") continue;

        // 3. Crear expresión regular (GREP) flexible
        // Escapamos símbolos raros que pueda tener el texto
        var grepString = textoBuscar.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
        // Convertimos los espacios en \s+ (así encontrará el texto aunque en el documento original haya un salto de línea en vez de un espacio)
        grepString = grepString.replace(/\\\s/g, '\\s+');

        app.findGrepPreferences.findWhat = grepString;
        var resultados = doc.findGrep();
        var numeroPagina = null;

        // 4. Filtrar por Estilos de Párrafo
        for (var r = 0; r < resultados.length; r++) {
            var match = resultados[r];
            var estilo = match.paragraphs[0].appliedParagraphStyle.name;

            if (estilosValidos.indexOf(estilo) !== -1) {
                try {
                    numeroPagina = obtenerPagina(match.parentTextFrames[0]);
                    if (numeroPagina) break; // Si lo encuentra, paramos de buscar este título
                } catch(e) {}
            }
        }

        // 5. Inyección Segura (sin romper cursivas ni formatos)
        if (numeroPagina) {
            var chars = p.characters;
            var foundTab = false;
            var numLength = 0;

            // Leemos el párrafo de atrás hacia adelante buscando el tabulador
            for (var c = chars.length - 2; c >= 0; c--) {
                var charVal = chars.item(c).contents;
                
                // Si encontramos el tabulador (sangría derecha o normal)
                if (charVal === '\t' || charVal === '\x08') {
                    foundTab = true;
                    // Si ya había un número de una ejecución anterior, lo borramos
                    if (numLength > 0) {
                        p.characters.itemByRange(c + 1, chars.length - 2).remove();
                    }
                    // Inyectamos el número de página justo después del tabulador
                    p.insertionPoints.item(c + 1).contents = numeroPagina;
                    break;
                } else {
                    numLength++;
                }
            }

            // Si por algún error de formato esa línea no tenía tabulador, se lo ponemos
            if (!foundTab) {
                p.insertionPoints.item(-2).contents = "\x08" + numeroPagina;
            }
            exitos++;
        } else {
            fallos++;
        }
    }

    app.findGrepPreferences = NothingEnum.nothing;
    alert("¡Índice automatizado!\n\n✔ Números inyectados: " + exitos + "\n⚠ Títulos no encontrados (revisar a mano): " + fallos);
}

// Entire Script Undo: Para deshacerlo todo con un solo Ctrl+Z si algo no te gusta
app.doScript(inyectarNumerosIndice, ScriptLanguage.JAVASCRIPT, [], UndoModes.ENTIRE_SCRIPT, "Inyectar Números Índice");