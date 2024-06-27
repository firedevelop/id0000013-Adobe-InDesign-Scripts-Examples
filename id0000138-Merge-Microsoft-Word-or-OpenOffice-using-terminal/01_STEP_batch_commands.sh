#!/bin/bash

# Define your commands
commands=(
    "./02_STEP_rename_underscore_to_zero.sh"
    "./03_STEP_rename_all_words.sh"
    "soffice --headless --convert-to odt 01_files_original_in_Word_format/*.docx --outdir 02_files_openOffice_converted/"
    "python3 ./04_01_STEP_remove_headers_annotations.py 02_files_openOffice_converted/ 03_files_openOffice_clean/"
    "python3 ./04_02_STEP_convert_odt_to_docx.py"
    "node 05_STEP_merge_docx_files.js"
)

# Iterate through the commands
for cmd in "${commands[@]}"; do
    echo "Executing: $cmd"
    $cmd
    if [ $? -ne 0 ]; then
        echo "Command failed: $cmd"
        exit 1
    fi
    echo "Waiting for 5 seconds..."
    sleep 5
done

echo "All commands executed."
