// This script merge multiples word document in one.
// allow to translation departament or team write some internal comments at the beginning of the document, the tag @end@ indicate the script will remove these coments until the tag @end@

1. Keep empty the principal folders with this command:
./00_STEP_clean_old_files.sh

2. COPY EXAMPLE FILES FROM FOLER "Example_Docs_Trasnlation_Team"

3. and paste on folder:
"01_files_original_in_Word_format"

4. run the script on your terminal with this bash command:
./01_STEP_batch_commands

5. done.
you will see a file on your main folder with all document merged in one single file named:
finalMergeOpenOffice.docx
