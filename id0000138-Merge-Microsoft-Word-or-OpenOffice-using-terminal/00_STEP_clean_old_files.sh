#!/bin/bash

# Directorios a limpiar
directories=(
    "./01_files_original_in_Word_format/"
    "./02_files_openOffice_converted/"
    "./03_files_openOffice_clean/"
    "./04_files_openOffice_merged/"
    "./05_library_to_merge_docx/"
)

# Archivo a eliminar
file_to_remove="./finalMergeOpenOffice.docx"

# Limpiar el contenido de los directorios
for dir in "${directories[@]}"; do
    if [ -d "$dir" ]; then
        rm -rf "$dir"/*
        echo "Limpiado el contenido de $dir"
    else
        echo "Directorio $dir no encontrado"
    fi
done

# Eliminar el archivo especificado
if [ -f "$file_to_remove" ]; then
    rm -f "$file_to_remove"
    echo "Archivo $file_to_remove eliminado"
else
    echo "Archivo $file_to_remove no encontrado"
fi
