/*
    Script para Adobe InDesign
    Propósito: Crear ESTILOS DE CARÁCTER con Tracking del -21 al 21
*/

main();

function main() {
    // 1. Verificación de documento abierto
    if (app.documents.length == 0) {
        alert("Por favor, abre un documento de InDesign antes de ejecutar el script.");
        return;
    }

    var doc = app.activeDocument;
    var groupName = "Tracking Carácter (-21 a 21)";
    var styleGroup;

    // 2. Crear (o buscar) el grupo para organizar los estilos
    try {
        styleGroup = doc.characterStyleGroups.itemByName(groupName);
        if (!styleGroup.isValid) {
            styleGroup = doc.characterStyleGroups.add({name: groupName});
        }
    } catch (e) {
        styleGroup = doc.characterStyleGroups.add({name: groupName});
    }

    // 3. Bucle para crear los estilos
    var contador = 0;
    
    for (var i = -21; i <= 21; i++) {
        // Nombre del estilo, ej: "Tracking -5"
        var styleName = "Tracking " + i;
        
        // Verificamos si ya existe para no duplicar
        var existingStyle = styleGroup.characterStyles.itemByName(styleName);
        
        if (!existingStyle.isValid) {
            // Creamos el estilo de carácter
            var newStyle = styleGroup.characterStyles.add();
            
            // Configuramos nombre y propiedad
            newStyle.name = styleName;
            newStyle.tracking = i;
            
            contador++;
        }
    }

    // 4. Confirmación
    alert("¡Listo!\nSe han creado los estilos de carácter dentro de la carpeta: '" + groupName + "'.");
}