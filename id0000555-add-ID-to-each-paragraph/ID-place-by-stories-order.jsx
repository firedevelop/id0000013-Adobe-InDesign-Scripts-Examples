#target indesign

function extraerInglesVisual() {
    if (app.documents.length === 0) {
        alert("Abre tu documento de InDesign en inglés primero.");
        return;
    }

    var doc = app.activeDocument;
    
    if (!doc.saved) {
        alert("Por favor, guarda el documento de InDesign primero para poder generar el JSON en esa misma carpeta.");
        return;
    }

    var contador = 1;
    var jsonString = "{\n";
    
    // Función para limpiar el texto para el JSON
    function limpiarParaJSON(texto) {
        return texto.replace(/\\/g, '\\\\')
                    .replace(/"/g, '\\"')
                    .replace(/\r/g, '')
                    .replace(/\n/g, '')
                    .replace(/\t/g, ' ');
    }

    // Función de ordenación visual (Arriba hacia abajo, Izquierda a derecha)
    function ordenarCajasVisualmente(a, b) {
        var boundsA = a.geometricBounds; // [y1, x1, y2, x2]
        var boundsB = b.geometricBounds;
        
        var y1A = boundsA[0];
        var x1A = boundsA[1];
        var y1B = boundsB[0];
        var x1B = boundsB[1];
        
        var toleranciaY = 15; // Margen de error en puntos (puedes ajustarlo)
        
        // Si están a una altura similar (misma fila visual)
        if (Math.abs(y1A - y1B) < toleranciaY) {
            return x1A - x1B; // Ordenar de izquierda a derecha
        } else {
            return y1A - y1B; // Ordenar de arriba hacia abajo
        }
    }

    // Recorremos el documento PÁGINA por PÁGINA
    for (var p = 0; p < doc.pages.length; p++) {
        var pagina = doc.pages[p];
        var cajasDeTexto = [];
        
        // Extraemos solo las cajas de texto (TextFrames) de esta página
        for (var i = 0; i < pagina.textFrames.length; i++) {
            cajasDeTexto.push(pagina.textFrames[i]);
        }
        
        // Ordenamos las cajas de esta página usando nuestra lógica visual
        cajasDeTexto.sort(ordenarCajasVisualmente);
        
        // Ahora procesamos los párrafos en el orden visual correcto
        for (var c = 0; c < cajasDeTexto.length; c++) {
            var caja = cajasDeTexto[c];
            
            for (var par = 0; par < caja.paragraphs.length; par++) {
                var parrafo = caja.paragraphs[par];
                var textoCrudo = parrafo.contents;
                
                // Ignoramos vacíos
                if (textoCrudo.replace(/\s|\r|\n/g, '').length > 0) {
                    // Evitamos inyectar IDs duplicados si la caja está enlazada y ya la procesamos
                    if (textoCrudo.indexOf("[[EN_ID:") === -1) {
                        var marcador = "[[EN_ID:" + contador + "]]";
                        
                        // Inyectamos el marcador
                        parrafo.insertionPoints[0].contents = marcador;
                        
                        // Añadimos al JSON
                        var textoLimpio = limpiarParaJSON(textoCrudo);
                        jsonString += '    "' + marcador + '": "' + textoLimpio + '",\n';
                        
                        contador++;
                    }
                }
            }
        }
    }

    // Cerramos el JSON
    if (contador > 1) {
        jsonString = jsonString.slice(0, -2) + "\n}";
    } else {
        jsonString += "}";
    }

    // Guardado del archivo
    var rutaJSON = doc.filePath.fsName + "/db_english_extracted.json";
    var archivoSalida = new File(rutaJSON);
    archivoSalida.encoding = "UTF-8";
    archivoSalida.open("w");
    archivoSalida.write(jsonString);
    archivoSalida.close();

    alert("¡Éxito Visual! Se marcaron " + (contador - 1) + " párrafos ordenados geométricamente. Archivo creado: db_english_extracted.json");
}

app.doScript(extraerInglesVisual, ScriptLanguage.JAVASCRIPT, [], UndoModes.ENTIRE_SCRIPT, "Extraer Inglés (Modo Visual)");