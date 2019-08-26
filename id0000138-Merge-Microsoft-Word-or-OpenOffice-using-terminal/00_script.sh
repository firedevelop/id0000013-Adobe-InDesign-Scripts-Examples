#!/bin/sh



#____________ SETUP PERMISSIONS _______________________________
chmod 644 01_files_original_in_Word_format/*.docx
chmod 755 00_script.sh
chmod 755 00_script.py


#____________ REMOVE OLD FILES _______________________________
rm -v 02_files_openOffice_converted/*
rm -v 03_files_openOffice_clean/*
rm -v 04_files_openOffice_merged/*


#____________ REPLACE THE _ TO 0 (we do this for keep the right secuence of the files) _______________________________
cd 01_files_original_in_Word_format
for f in *_*.docx; do mv -- "$f" "${f//_/0}"; done
cd ..

#____________ RENAME FILES WITH SECUENCE _______________________________
# Rename all files in folder, with the format 001.docx, 002.docx, 003.docx, etc...
a=1
for i in 01_files_original_in_Word_format/*.docx; do
new=$(printf "01_files_original_in_Word_format/%03d.docx" "$a") #03 pad to length of 3
mv -if -- "$i" "$new"
let a=a+1
done



#____________ CHECK IF PYTHON3 IS INSTALLED _______________________________
if command -v python3 &>/dev/null; then
    echo "OK: Python 3 is installed"
else
    echo "ERROR: Python 3 is not installed"
fi



#____________ CHECK IF PYTHON2.7 IS INSTALLED _______________________________
if [[ $(python --version 2>&1) =~ 2\.7 ]]
    then
        echo "OK: Python 2.7 is installed"
    else
        echo "ERROR: Python 2.7 is not installed"
fi


#____________ CHECK THE PYTHON3 INSTALLATION PATH  _______________________________
OUTPUT="$(which python3)"
if [[ ${OUTPUT} == /usr/local/bin/python3 ]]
    then echo "OK: Python 3 path installation"; 
else
    echo "ERROR: change your python3 installation path in the script"
fi



#____________ CONVERT Microsoft .docx files to OpenOffice .odt files _______________________________
soffice --headless --convert-to odt 01_files_original_in_Word_format/*.docx --outdir 02_files_openOffice_converted/



#____________ Delete all instructions or notes from the translations departament, all of them finish on the sintaxix @end@  _______________________________
sudo ./00_script.py 02_files_openOffice_converted/ 03_files_openOffice_clean/


#____________ MERGE ALL .odt FILES TO ONE SINGLE FILE _______________________________
ooo_cat 03_files_openOffice_clean/*.odt > 04_files_openOffice_merged/finalMergeOpenOffice.odt



#____________ CONVERT finalMergeOpenOffice.odt TO finalMergeOpenOffice.doc _______________________________
soffice --headless --convert-to doc 04_files_openOffice_merged/finalMergeOpenOffice.odt
mv finalMergeOpenOffice.doc 04_files_openOffice_merged/