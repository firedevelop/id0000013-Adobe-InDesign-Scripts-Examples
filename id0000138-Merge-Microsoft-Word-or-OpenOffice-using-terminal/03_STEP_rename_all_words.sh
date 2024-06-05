#!/bin/bash

# Ensure the script is run with no arguments
if [ "$#" -ne 0 ]; then
    echo "Usage: $0 (no arguments required)"
    exit 1
fi

# Assign the target directory to a variable
target_directory="01_files_original_in_Word_format"

# Ensure the target directory exists
if [ ! -d "$target_directory" ]; then
    echo "Directory $target_directory does not exist."
    exit 1
fi

# Change to the target directory
cd "$target_directory" || exit

# Initialize a counter
counter=1

# Find all .docx files and rename them
for file in *.docx _*.docx; do
    # Check if the file exists to avoid errors with wildcards
    if [ -e "$file" ]; then
        # Format the counter as a three-digit number
        new_name=$(printf "%03d.docx" "$counter")

        # Rename the file
        mv -- "$file" "$new_name"

        # Increment the counter
        counter=$((counter + 1))
    fi
done

echo "Renaming complete!"
