import os
import subprocess

def convert_odt_to_docx(input_folder, output_folder):
    # Ensure the input folder exists
    if not os.path.exists(input_folder):
        print(f"Input folder {input_folder} does not exist.")
        return

    # Ensure the output folder exists
    os.makedirs(output_folder, exist_ok=True)

    # Get the list of .odt files in the input folder
    odt_files = [f for f in os.listdir(input_folder) if f.endswith('.odt')]

    # Check if there are .odt files in the directory
    if not odt_files:
        print("No .odt files found in the directory.")
        return

    # Loop through each .odt file and convert it to .docx
    for odt_file in odt_files:
        input_path = os.path.join(input_folder, odt_file)
        output_path = os.path.join(output_folder, os.path.splitext(odt_file)[0] + '.docx')
        
        # Convert the file using LibreOffice
        subprocess.run([
            'soffice', '--headless', '--convert-to', 'docx', '--outdir', output_folder, input_path
        ])

        print(f"Converted {odt_file} to {os.path.basename(output_path)}")

# Define input and output folders
input_folder = './03_files_openOffice_clean'
output_folder = './04_files_openOffice_merged'

# Convert the .odt files to .docx
convert_odt_to_docx(input_folder, output_folder)
