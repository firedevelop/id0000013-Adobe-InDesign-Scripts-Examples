
# 📖 InDesign Auto-TOC: Generador Dinámico de Índices

Este script de ExtendScript (`.jsx`) para Adobe InDesign automatiza la creación de un índice general (TOC) avanzado. Convierte un índice de texto plano importado de Word en un sistema de **Referencias Cruzadas Dinámicas**, garantizando que los números de página se actualicen automáticamente si el documento cambia o se añaden nuevas páginas.

## ✨ Características Principales

* **Radar Automático:** No requiere que el usuario seleccione la caja de texto manualmente. El script escanea el documento, localiza la frase exacta *"Índice general"* y atrapa automáticamente el marco de texto que lo contiene.
* **Limpieza Inteligente (Motor GREP):** Antes de inyectar nada, el script realiza un barrido de seguridad. Borra tabuladores antiguos, espacios en blanco residuales y números de página estáticos previos para garantizar una inyección limpia.
* **Inyección de Variables Nativas:** En lugar de escribir texto plano, el script genera "Anclas" (`HyperlinkTextDestinations`) en los títulos originales del libro y las enlaza con "Referencias Cruzadas" (`CrossReferenceSources`) en el índice.
* **Formato Seguro:** Inserta automáticamente el tabulador de sangría derecha (`\x08`) respetando los saltos de línea forzados (`\n`) y los retornos de carro (`\r`) originales de la maquetación.
* **Tolerancia a Fallos (Try/Catch):** Diseñado para saltarse amablemente cualquier título que no encuentre o que genere conflictos de ID interno (previniendo el clásico *Error 55* de InDesign), reportando los fallos al final de la ejecución.

---

## ⚙️ Requisitos Previos (Estructura del Documento)

Para que el script funcione correctamente, tu documento de InDesign debe cumplir con estas reglas exactas:

1. **El Título del Índice:** La caja de texto que contiene el índice debe incluir la frase exacta **`Índice general`**.
2. **Estilos de Párrafo de Destino:** El script busca los títulos a lo largo de todo el libro basándose *estrictamente* en estos dos estilos de párrafo:
   * `Titulo C-0 0 0 2`
   * `Titulo D 0-0-0-1`
3. **El Texto del Índice:** Las líneas del índice deben coincidir con el texto de los títulos en el interior del libro. El script ignora diferencias de espacios y saltos de línea forzados gracias a su búsqueda GREP flexible.

---

## 🚀 Instrucciones de Uso

### 1. Instalación
1. Guarda el código proporcionado en un archivo llamado `Generador_Numeros_Dinamicos.jsx`.
2. Copia este archivo en la carpeta de scripts de InDesign:
   * **Windows:** `C:\Usuarios\[TuUsuario]\AppData\Roaming\Adobe\InDesign\[Versión]\es_ES\Scripts\Scripts Panel\`
   * **Mac:** `Aplicaciones > Adobe InDesign [Versión] > Scripts > Scripts Panel`

### 2. Ejecución
1. Abre tu documento `.indd` en Adobe InDesign.
2. Asegúrate de que los estilos de párrafo de tu índice ya están aplicados (puedes usar el script `Formatear_Indice.jsx` previamente para esto).
3. Abre el panel de Scripts (`Ventana` > `Utilidades` > `Scripts`).
4. Haz doble clic sobre `Generador_Numeros_Dinamicos.jsx`.

### 3. Resultados
* El proceso tomará solo unos segundos.
* Al finalizar, aparecerá una alerta indicando cuántas variables se inyectaron con éxito (`✔`) y cuántos títulos no se encontraron (`⚠`).
* Los números de página insertados tendrán un sutil recuadro alrededor (visible en InDesign, pero invisible en el PDF final), indicando que son variables dinámicas.

---

## 🛠️ Solución de Problemas Comunes

* **Fallo: "No he podido encontrar el texto 'Índice general'"**
  * *Solución:* Revisa que el título de tu índice no tenga espacios extra, saltos de línea extraños en medio de la palabra, o esté escrito con minúsculas diferentes.
* **El script reporta muchos "Títulos no encontrados (revisar a mano)"**
  * *Solución:* Esto ocurre cuando el traductor o el maquetador alteró una palabra en el índice respecto al título real en el interior del libro. Busca esos títulos fallidos visualmente y corrige la discrepancia de texto, o inserta el número de página a mano.

***

