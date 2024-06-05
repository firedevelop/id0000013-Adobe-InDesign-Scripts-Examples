# https://askubuntu.com/questions/482277/how-to-merge-odt-documents-from-the-command-line
# https://github.com/Homebrew/homebrew-cask/issues/5328
# https://ask.libreoffice.org/en/question/2641/convert-to-command-line-parameter/
# https://forum.openoffice.org/en/forum/viewtopic.php?f=7&t=57972

# INSTRUCTIONS FOR WSL LINUX UBUNTU ON WINDOWS 11:
1º SETUP EXECUTION PERMISSION 

Be sure the script files have a execution permision. Type in terminal:
chmod -x yourNameFile.sh
chmod -x yourNameFile.py

to avoid issues you can give full permission. (be carefull, dont do this)
sudo chmod -R 755 yourFolder


2º REPLACE YOUR PYTHON3 PATH 

Be sure you have python3 installed. Copy this path and replace your python file with your new path at the beginning of the python script, is something like:
find the path on terminal:
which python3 

copy and replace your path, will be like:
#!/usr/bin/python3


3º INSTALL ooopy

We will use ooopy to merge files.
Download and install ooopy, from here:
https://sourceforge.net/projects/ooopy/

unzip de folder, go inside, and type in terminal:
sudo python setup.py install

also you can try:
pip install ooo_py


4º INSTALL LIBREOFFICE 

Now install libreoffice:
apt install libreoffice


5º COPY PASTE YOUR WORDS

Place all your worSd files on folder called:
01_files_original_in_Word_format


6º REPLACE UNDERSCORE NAMEFILE BY ZERO:
will change filenames like:
_1_fileName.docx
to 
01_fileName.docx


execute from terminal:
sh 02_STEP_rename_underscore_to_zero.sh


7º RENAME ALL WORD FILENAMES TO 001, 002, ...
sh 03_STEP_rename_all_words.sh


8º CONVERT .DOCX TO .ODT

type the next, to convert all your files .docx to the Openoffice format .odt: soffice  --headless --convert-to odt *.docx

execute terminal:
soffice --headless --convert-to odt 01_files_original_in_Word_format/*.docx --outdir 02_files_openOffice_converted/


9ª DELETE ANOTATION TRANSLATOR TEXT UNTIL @end@

Delete all instructions or notes from the translations departament, all of them finish on the sintaxix @end@.
Output folder: 03_files_openOffice_clean

execute terminal:
python3 ./04_01_STEP_remove_headers_annotations.py 02_files_openOffice_converted/ 03_files_openOffice_clean/


10º CONVERT .ODT FILE TO.DOCX
execute terminal:
python3 ./04_02_STEP_convert_odt_to_docx.py

Output folder and file called: 04_files_openOffice_merged

11º MERGE ALL .DOCX FILES INTO ONE .DOCX FILE 
Asuming you have node.js installed. Now install the npm node.js library:
npm install docx-builder

execute terminal:
node 05_STEP_merge_docx_files.js

after you will see the new file finalMergeOpenOffice.docx



# INSTRUCTIONS FOR MAC:

0º Be sure the script files have a execution permision. Type in terminal:
chmod -x yourNameFile.sh
chmod -x yourNameFile.py

to avoid issues you can give full permission. (be carefull, dont do this)
sudo chmod -R 755 yourFolder

1º Be sure you have python3 installed.

1º We will use ooopy to merge files.
Download and install ooopy, from here:
https://sourceforge.net/projects/ooopy/

unzip de folder, go inside, and type in terminal:
sudo python setup.py install
#
2º You need to have installed brew. If not, you can visit the official website to install brew:
https://brew.sh/

3º If you have already installed brew, update  brew. Type in terminal:
brew update && brew upgrade brew-cask

4º Now install libreoffice:
brew cask install libreoffice

5º using terminal, go to the folder you have your word files, like:
01.docx
02.docx
03.docx
...

6º type the next, to convert all your files .docx to the Openoffice format .odt:
soffice  --headless --convert-to odt *.docx

For example:
soffice --headless --convert-to odt 01_files_original_in_Word_format/*.docx --outdir 02_files_openOffice_converted/


7º in the pyton file:
02_STEP_merge_oppenOffice_files.py

be sure the first line match with the path of your python installation.
You can see the path typing:
which python3

8º Delete all instructions or notes from the translations departament, all of them finish on the sintaxix @end@
sudo ./02_STEP_merge_oppenOffice_files.py 02_files_openOffice_converted/ 03_files_openOffice_clean/


9º Now all your .docx are converted to .odt
Then now you ready to merge all .odt files in one single file .odt:
ooo_cat 03_files_openOffice_clean/*.odt > 04_files_openOffice_merged/finalMergeOpenOffice.odt

10ª convert the openOffic file finalMergeOpenOffice.odt to Microsoft Word .docx format
soffice --convert-to doc 04_files_openOffice_merged/finalMergeOpenOffice.odt
soffice --headless --convert-to doc 04_files_openOffice_merged/finalMergeOpenOffice.odt
