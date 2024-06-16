#!/bin/bash
# ubntu wsl windows 11 /mnt/c/Users/production/Documents/


echo "############### 1. UNZIP EPUB #######################################################";

rm -r ePub
mkdir ePub

sudo chown -Rv $USER ./ePub
chmod -R 777 ./ePub

mv ePub.epub ePub.zip
mv ePub.zip ePub/
unzip ePub/ePub.zip -d ePub/
rm -f ePub/ePub.zip

sudo chown -Rv $USER ./ePub
chmod -R 777 ./ePub



echo "############### 2. REMOVE THE WORD "file" ####################################################";
# Remove the words "file" from the internal links for work properly. Reminder in Adobe indesign don't use the option "Internal reference", use hiperlink
# in Adobe Indesign I use the style "PageBreak" each time we have a new chapter or picture
perl -pi -w -e 's/href="file:/href="/g;' ./ePub/OEBPS/*.*



echo "############### 3. DELETE LINES AFTER FIND STRING ####################################";
# DELETE CSS LINES. It´s optional. Delete specific lines creating a temporally file, from your CSS for show the pictures with a right size on devices
# Delete next two lines every time find the String. Maybe you can find some problems if the string appear two times together, but it´s not usuall
awk '/img._idGenObjectAttribute-1/ { ct=3; print $0 } { if (ct > 0) { ct -= 1   } else print $0 }'  ./ePub/OEBPS/css/idGeneratedStyles.css  > ./ePub/OEBPS/css/1.css
awk '/_idContainer000/ { ct=3; print $0 } { if (ct > 0) { ct -= 1   } else print $0 }'  ./ePub/OEBPS/css/1.css  > ./ePub/OEBPS/css/2.css
rm ./ePub/OEBPS/css/idGeneratedStyles.css;
mv ./ePub/OEBPS/css/2.css ./ePub/OEBPS/css/idGeneratedStyles.css;
sudo chown -Rv $USER ./ePub/OEBPS/css/idGeneratedStyles.css;
chmod -R 777 ./ePub/OEBPS/css/idGeneratedStyles.css;



echo "############### 4. CUSTOM CODE #######################################################";
 perl -ni -e "print unless /Portada/" ./ePub/OEBPS/ePub.xhtml
 perl -ni -e "print unless /Título/" ./ePub/OEBPS/ePub.xhtml

# DELETE WORD "Titulo" and "Portada" from image Title xhtml page
# Custom code
perl -pi -w -e 's!  !&#160;&#160;!g;' ./ePub/OEBPS/*.xhtml

echo "############### 5 REPLACE SOME STRINGS FROM TABLE OF CONTENT ##################################";
# Function to perform replacements in specific files
perform_specific_replacements() {
    local files=("${!1}")
    declare -n replacements=$2  # Create a reference to the replacements array

    for file in "${files[@]}"; do
        if [[ -f "$file" ]]; then
            for search_string in "${!replacements[@]}"; do
                replace_string=${replacements[$search_string]}
                echo "Processing file: $file"
                echo "Replacing '$search_string' with '$replace_string'"
                # Use sed with a different delimiter to avoid special character issues
                if [[ "$file" =~ \.xml$ ]]; then
                    sed "1!s|$search_string|$replace_string|g" "$file" > "$file.tmp"
                    mv "$file.tmp" "$file"
                else
                    sed -i "s|$search_string|$replace_string|g" "$file"
                fi
                #echo "Replaced '$search_string' with '$replace_string' in $file"
            done
        else
            echo "File $file not found"
        fi
    done
}

# Specific files and replacements
specific_files=(
    "./ePub/OEBPS/toc.ncx"
    "./ePub/OEBPS/toc.xhtml"
)
declare -A specific_replacements=(
    ["ePub.xhtml#_idParaDest-1"]="cover.xhtml"
    ["EL PRECIOSO VALOR DE NUESTRA VIDA HUMANA"]="El precioso valor de nuestra vida humana"
    ["¿QUÉ ES LA MUERTE"]="¿Qué es la muerte"
    ["EL PELIGRO DE RENACER EN LOS REINOS INFERIORES"]="El peligro de renacer en los reinos inferiores"
    ["REFUGIO"]="Refugio"
    ["¿QUÉ ES EL KARMA"]="¿Qué es el karma"
    ["LO QUE HAY QUE SABER"]="Lo que hay que saber"
    ["LO QUE HAY QUE ABANDONAR"]="Lo que hay que abandonar"
    ["LO QUE HAY QUE PRACTICAR"]="Lo que hay que practicar"
    ["LO QUE HAY QUE ALCANZAR"]="Lo que hay que alcanzar"
    ["ADIESTRAMIENTO EN EL AMOR AFECTIVO"]="Adiestramiento en el amor afectivo"
    ["ADIESTRAMIENTO EN EL AMOR QUE ESTIMA A LOS DEMÁS"]="Adiestramiento en el amor que estima a los demás"
    ["ADIESTRAMIENTO EN EL AMOR QUE DESEA LA FELICIDAD DE LOS DEMÁS"]="Adiestramiento en el amor que desea la felicidad de los demás"
    ["ADIESTRAMIENTO EN LA COMPASIÓN UNIVERSAL"]="Adiestramiento en la compasión universal"
    ["ADIESTRAMIENTO EN LA BODHICHITA EN SÍ"]="Adiestramiento en la bodhichita en sí"
    ["ADIESTRAMIENTO EN LAS SEIS PERFECCIONES"]="Adiestramiento en las seis perfecciones"
    ["ADIESTRAMIENTO EN LA PRÁCTICA DE TOMAR JUNTO CON LAS SEIS PERFECCIONES"]="Adiestramiento en la práctica de tomar junto con las seis perfecciones"
    ["ADIESTRAMIENTO EN LA PRÁCTICA DE DAR JUNTO CON LAS SEIS PERFECCIONES"]="Adiestramiento en la práctica de dar junto con las seis perfecciones"
    ["Apéndice 1"]="Apéndice 1 – Texto raíz: Sutra de la esencia de la sabiduría. Sutra del corazón"
    ["Apéndice 2"]="Apéndice 2 – Significado conciso del comentario"
    ["Apéndice 3"]="Apéndice 3 – Oración liberadora y Oraciones para meditar"
    ["Apéndice 4"]="Apéndice 4 – Los doce generadores, los dieciocho elementos y los doce vínculos de relación dependiente"
    ["Apéndice 5"]="Apéndice 5 – La Gran Madre: Método para eliminar dificultades y obstáculos con la recitación del Sutra"
    ["Apéndice 6"]="Apéndice 6 – Breve comentario a la práctica de La Gran Madre"
    ["Apéndice 7"]="Apéndice 7 – El yoga de la Gran Madre Prajnaparamita: Sadhana de autogeneración"
    ["Apéndice 8"]="Apéndice 8 – Breve comentario a El yoga de la Gran Madre Prajnaparamita: Sadhana de autogeneración"
)

# Perform specific replacements
perform_specific_replacements specific_files[@] specific_replacements



echo "############### 6.1 ADD IMAGES - CONVERT ALL IMAGES TO .jpg #######"

# Directory containing images
image_dir="./Links"

# Check if Pillow (Python Imaging Library) is installed
if ! python3 -c "import PIL.Image" &> /dev/null; then
    echo "Pillow (Python Imaging Library) is not installed. Please install it using: pip install pillow"
    exit 1
fi

# Function to convert and rename images
convert_images() {
    for ext in png tiff tif gif; do
        for file in "$1"/*.$ext; do
            if [ -f "$file" ]; then
                echo "Processing file: $file"
                # Determine output filename
                base_name=$(basename "$file" | sed 's/\.[^.]*$//')
                output_file="$1/$base_name.jpg"
                echo "Output file will be: $output_file"

                # Convert and save the image
                python3 -c "
import sys
from PIL import Image

file = '$file'
output_file = '$output_file'

try:
    img = Image.open(file)

    # Convert to RGB if necessary
    if img.mode != 'RGB':
        img = img.convert('RGB')

    # Save as JPEG with specified parameters
    img.save(output_file, 'JPEG', quality=85, optimize=True, progressive=True, dpi=(150, 150))
except Exception as e:
    print(f'Error processing {file}: {e}', file=sys.stderr)
"
            fi
        done
    done
}

# Call the function to convert images
convert_images "$image_dir"



echo "##### 6.2 ADD IMAGES - COPY IMAGES FROM ./LINKS TO ./ePub/OEBPS/image ######";

# Define the source and destination directories
SOURCE_DIR="./Links"
DEST_DIR="./ePub/OEBPS/image"

# Check if the destination directory exists, if not, create it
if [ ! -d "$DEST_DIR" ]; then
    mkdir -p "$DEST_DIR"
fi

# Move files with the specified pattern from source to destination
for i in {01..99}; do
    FILE="$SOURCE_DIR/$i.jpg"
    if [ -f "$FILE" ]; then
        cp "$FILE" "$DEST_DIR"
        echo "Moved $FILE to $DEST_DIR"
    fi
done




echo "##### 6.3 ADD IMAGES - REPLACE CODE 9788459822435- BY IMAGE 01.jpg, 02.jpg ... ######";
# 1. Identify the Ilustration page and save in the variable $ilustration_exclude_file
# 2. add the images .jpg from the folder /images in a secuence number: 01.jpg, 02.jpg, 03.jpg ...
# 3. add the image HTML after the HTML paragraph with the string 9788459822435-

# Step 1: Find the .xhtml file containing the text "9788459822435-" more than 3 times
ilustration_exclude_file=$(grep -rl "9788459822435-" ./ePub/OEBPS/ | while read -r file; do
    if [ $(grep -o "9788459822435-" "$file" | wc -l) -gt 3 ]; then
        echo "$file"
        break
    fi
done)

# Initialize the image counter
image_counter=1

# Step 2: Find and sort .xhtml files, excluding the illustration file
find ./ePub/OEBPS/ -type f -name "*.xhtml" | sort -V | while read -r file; do
    if [[ "$file" != "$ilustration_exclude_file" ]] && grep -q "9788459822435-" "$file"; then
        # Generate the image filename based on the counter
        image_file=$(printf "./ePub/OEBPS/image/%02d.jpg" "$image_counter")

        # Create the HTML snippet to insert
        html_code="<div class=\"_idGenObjectLayout-1\">\n\t<img class=\"_idGenObjectAttribute-1\" src=\"$image_file\" alt=\"\" />\n</div>"

        # Insert the HTML code just after the containing <div>
        sed -i "/9788459822435-/ { N; s|</div>|&\n$html_code| }" "$file"

        # Increment the image counter
        image_counter=$((image_counter + 1))
    fi
done


echo "############### 6.4 REPLACEMENTS ILUSTRATIONS ##################################";
# This class do the next: 
# 1. Find the ilustration page by search the xhtml with more than 3 times "9788459822435-" and save the filename.xhtml in the variable ilustrations_XHTML
# 2. Remove full paragraph text contains a strings with "9788459822435-" except the Ilustration page, ilustrations_XHTML. Only change text and keep the HTML code. Also remove the strings with white spaces at start like " 9788459822435-", "  9788459822435-"
# 3. Go to ilustrations_XHTML and remove the string 9788459822435- but keep the rest of the text, because we need to show the title ilustration. Also keep the HTML tags.

# Search for file containing the string "9788459822435-" more than 3 times
ilustrations_XHTML=""
for file in ./ePub/OEBPS/*.xhtml; do
    if [[ -f "$file" ]]; then
        count=$(grep -o "9788459822435-" "$file" | wc -l)
        if (( count > 3 )); then
            ilustrations_XHTML="$file"
            echo "File with more than 3 occurrences of '9788459822435-': $file"
            break
        fi
    fi
done

# Function to perform replacements in general files
perform_general_replacements() {
    local files=("${!1}")
    declare -n replacements=$2  # Create a reference to the replacements array

    for file_pattern in "${files[@]}"; do
        for file in $file_pattern; do
            if [[ -f "$file" ]]; then
                # Exclude the file in ilustrations_XHTML
                if [[ "$file" == "$ilustrations_XHTML" ]]; then
                    echo "Skipping file: $file"
                    continue
                fi
                for search_string in "${!replacements[@]}"; do
                    replace_string=${replacements[$search_string]}
                    echo "Processing file: $file"
                    echo "Replacing occurrences of '$search_string*'"
                    # Use sed with a regex to match and remove the entire string starting with search_string, accounting for leading spaces
                    sed -i "s| *${search_string}[^<]*|${replace_string}|g" "$file"
                done
            else
                echo "No files found for pattern $file_pattern"
            fi
        done
    done
}

# Function to remove the string "9788459822435-" from the file stored in ilustrations_XHTML
remove_ilustrations_string() {
    if [[ -f "$ilustrations_XHTML" ]]; then
        echo "Processing file: $ilustrations_XHTML"
        # Use sed with a regex to remove the string "9788459822435-" while preserving the rest of the text and HTML tags
        sed -i "s|\( *\)9788459822435-\(.*\)|\1\2|g" "$ilustrations_XHTML"
    else
        echo "File not found: $ilustrations_XHTML"
    fi
}


# General files and replacements
general_files=(
    "./ePub/OEBPS/*.xhtml"
)
declare -A general_replacements=(
    ["9788459822435-"]=""
)

# Perform general replacements
perform_general_replacements general_files[@] general_replacements

# Remove "9788459822435-" string from ilustrations_XHTML file
remove_ilustrations_string








echo "############### 3.1 ADD EXTRA CSS AND XHTML ###############################################";

# 1º Merge extra CSS and XHTML files. Give normal permission to the modify files
# 2º To prevent errors, be sure the next recomendations:
#	- at the end at the file you have blank line empty
#	- delete any comments in your code.
#cat extra.css >> ./ePub/OEBPS/css/idGeneratedStyles.css
#sudo chown -Rv $USER ./ePub/OEBPS/css/idGeneratedStyles.css
#chmod -R 777 ./ePub/OEBPS/css/idGeneratedStyles.css
#
## 2º Copy the table and others xhtml
#cp -f ePub-18.xhtml ./ePub/OEBPS/ePub-18.xhtml
#sudo chown -Rv $USER ./ePub/OEBPS/ePub-18.xhtml
#chmod -R 777 ./ePub/OEBPS/ePub-18.xhtml
#


echo "############### 4. OTHERS USEFULL CHANGES ####################################################";
echo "# DELETE MAC HIDDEN FILES";
rm -f ./ePub/.DS_Store &&
rm -f ./ePub/OEBPS/.DS_Store &&
rm -f ./ePub/OEBPS/image/.DS_Store
rm -f ./ePub/OEBPS/css/.DS_Store

echo "# DELETE OVERRIDES FROM INDESIGN";
perl -pi -w -e 's# _idGenCharOverride-1##g;' ./ePub/OEBPS/*.*
perl -pi -w -e 's# _idGenCharOverride-2##g;' ./ePub/OEBPS/*.*
perl -pi -w -e 's# _idGenCharOverride-3##g;' ./ePub/OEBPS/*.*
perl -pi -w -e 's# _idGenCharOverride-4##g;' ./ePub/OEBPS/*.*
perl -pi -w -e 's# _idGenCharOverride-5##g;' ./ePub/OEBPS/*.*
perl -pi -w -e 's# _idGenCharOverride-6##g;' ./ePub/OEBPS/*.*
perl -pi -w -e 's# _idGenCharOverride-7##g;' ./ePub/OEBPS/*.*
perl -pi -w -e 's# _idGenCharOverride-8##g;' ./ePub/OEBPS/*.*
perl -pi -w -e 's# _idGenCharOverride-9##g;' ./ePub/OEBPS/*.*
perl -pi -w -e 's# _idGenCharOverride-10##g;' ./ePub/OEBPS/*.*


echo "# SHOW COVER ON IBOOKS";
perl -pi -w -e 's#<itemref idref="cover" linear="no" />#<itemref idref="cover" />#g;' ./ePub/OEBPS/*.*

echo "# REPLACE ALL REPETITIONS AND ADD NICE SPACE";
perl -pi -w -e 's/\(x/&#160;&#160;&#160;(x/g;' ./ePub/OEBPS/*.*

echo "# SOME CHANGES IN THE toc.xhtml";
perl -pi -w -e 's#<h2>Landmarks</h2>##g;' ./ePub/OEBPS/*.*
perl -pi -w -e 's#<li><a epub:type="cover" href="cover.xhtml">Cover</a></li>#<li><a epub:type="cover" href="cover.xhtml">Portada</a></li>#g;' ./ePub/OEBPS/*.*
perl -pi -w -e 's#<h2>Contents</h2>#<h2>Índice general</h2>#g;' ./ePub/OEBPS/*.*

echo "# CHANGE ALL LANGUAGES TO SPANISH. This prevent the apps ebook reader with the voice funcion, play foreing language.";
perl -pi -w -e 's/xml:lang="es-ES"/xml:lang="es"/g;' ./ePub/OEBPS/*.*
perl -pi -w -e 's/xml:lang="en-GB"/xml:lang="es"/g;' ./ePub/OEBPS/*.*
perl -pi -w -e 's/xml:lang="en-US"/xml:lang="es"/g;' ./ePub/OEBPS/*.*
perl -pi -w -e 's/xml:lang="fr-FR"/xml:lang="es"/g;' ./ePub/OEBPS/*.*
perl -pi -w -e 's/xml:lang="de-DE"/xml:lang="es"/g;' ./ePub/OEBPS/*.*
perl -pi -w -e 's/xml:lang="it-IT"/xml:lang="es"/g;' ./ePub/OEBPS/*.*

perl -pi -w -e 's/lang="es-ES"/lang="es"/g;' ./ePub/OEBPS/*.*
perl -pi -w -e 's/lang="en-GB"/lang="es"/g;' ./ePub/OEBPS/*.*
perl -pi -w -e 's/lang="en-US"/lang="es"/g;' ./ePub/OEBPS/*.*
perl -pi -w -e 's/lang="fr-FR"/lang="es"/g;' ./ePub/OEBPS/*.*
perl -pi -w -e 's/lang="de-DE"/lang="es"/g;' ./ePub/OEBPS/*.*
perl -pi -w -e 's/lang="it-IT"/lang="es"/g;' ./ePub/OEBPS/*.*

perl -pi -w -e 's#<dc:language>es-ES</dc:language>#<dc:language>es</dc:language>#g;' ./ePub/OEBPS/*.*
perl -pi -w -e 's#<dc:language>en-GB</dc:language>#<dc:language>es</dc:language>#g;' ./ePub/OEBPS/*.*
perl -pi -w -e 's#<dc:language>en-US</dc:language>#<dc:language>es</dc:language>#g;' ./ePub/OEBPS/*.*
perl -pi -w -e 's#<dc:language>fr-FR</dc:language>#<dc:language>es</dc:language>#g;' ./ePub/OEBPS/*.*
perl -pi -w -e 's#<dc:language>de-DE</dc:language>#<dc:language>es</dc:language>#g;' ./ePub/OEBPS/*.*
perl -pi -w -e 's#<dc:language>it-IT</dc:language>#<dc:language>es</dc:language>#g;' ./ePub/OEBPS/*.*

echo "############### END 4. OTHERS USEFULL CHANGES ####################################################";



echo "############### 6. CONVERT MARGIN-TOP, MARGIN-BUTTON TO EM SIZE ########################################";
# Here we change the size pixel for EM size, and increase all values in 0.12. For example if you css have a "margin-top:1px" the script will convert to "margin-top:0.12em"
for margin in "margin-top" "margin-bottom"
do
for i in {1..200}
do
# If you need more or less space, modify the value 0.12 for your custom value.
RES=`perl -e "print($i*0.12)"`
perl -pi -w -e "s/${margin}:${i}px;/${margin}:${RES}em;/g" ./ePub/OEBPS/css/idGeneratedStyles.css
done
done

# If you need add a custom propieties you can do like this:
#perl -pi -w -e 's/margin-top:1px;/margin-top:0.12em;/g;' ./ePub/OEBPS/css/idGeneratedStyles.css
echo "############### END 6. CONVERT MARGIN-TOP, MARGIN-BUTTON TO EM SIZE #####################################";

echo "############### 7. SPLIT CSS IN FILES AND CONVERT MARGIN-LEFT, MARGIN-RIGHT, TEXT-INDENT ###############";
# Split all the CSS styles from the Adobe Indesign into a separate files
cat ./ePub/OEBPS/css/idGeneratedStyles.css | (
I=0;
echo "">./ePub/OEBPS/css/GeneratedStyles0;
while read line;
do
echo $line >> ./ePub/OEBPS/css/GeneratedStyles$I;
if [ "$line" == '}' ];
then I=$[I+1];
echo "" > ./ePub/OEBPS/css/GeneratedStyles$I;
fi
done;
)
# Be sure each style name from your Adobe Indesign have the next special name with the CSS EM values positives and negatives. For example; ML1-MR1-TI-2
# You need create many as you need. Don´t use "px" sizes on the CSS use better "em"
# L = margin-left
# R = margin-right
# I = text-indent

# STYLES INDESIGN:
#L0-R0-I4
#L0-R0-I5
#L0-R0-I3
#L1-R1-I0 NOT INCLUDE
#L3-R0-I-3
#L3-R0-I-5 NOT INCLUDE
#L4-R0-I-4 NOT INCLUDE
#L4-R4-I0
#L4-R4-I4
#L5-R0-I-5
#L5-R0-I5 NOT INCLUDE
#L6-R0-I0 NOT INCLUDE
#L6-R0-I-4
#L6-R6-I0
#L6-R6-I3
#L7-R0-I-3 NOT INCLUDE
#L7-R0-I-5 NOT INCLUDE
#L7-R0-I-7 NOT INCLUDE
#L8-R0-I-3
#L8-R4-I-4
#L10-R4-I-4
#L10-R4-I-4
#L14-R4-I-5
#L12-R6-I-6
#L10-R6-I-4

#Permission for the css files otherway the script can´t add new styles into the new css files
sudo chown -Rv $USER ./ePub/OEBPS/css/*
chmod -R 777 ./ePub/OEBPS/css/*

for f in `ls ./ePub/OEBPS/css/GeneratedStyles*` ; do
############
if grep -qr L0-R0-I4 $f; then
#delete the bad bleeding
perl -i -ne'/margin-left/ or print' $f;
perl -i -ne'/margin-right/ or print' $f;
perl -i -ne'/text-indent/ or print' $f;

#add the right bledding
perl -pi -w -e 's#}#margin-left:0;margin-right:0;text-indent:1em;\}#g;' $f
echo "working on css file $f";
fi

############
if grep -qr L0-R0-I5 $f; then
#delete the bad bleeding
perl -i -ne'/margin-left/ or print' $f;
perl -i -ne'/margin-right/ or print' $f;
perl -i -ne'/text-indent/ or print' $f;

#add the right bledding
perl -pi -w -e 's/}/margin-left:0;margin-right:0;text-indent:1em;\}/g;' $f
echo "working on css file $f";
fi;

############
if grep -qr L0-R0-I3 $f; then
#delete the bad bleeding
perl -i -ne'/margin-left/ or print' $f;
perl -i -ne'/margin-right/ or print' $f;
perl -i -ne'/text-indent/ or print' $f;

#add the right bledding
perl -pi -w -e 's/}/margin-left:0;margin-right:0;text-indent:1em;\}/g;' $f
echo "working on css file $f";
fi;

############
if grep -qr L3-R0-I-3 $f; then
#delete the bad bleeding
perl -i -ne'/margin-left/ or print' $f;
perl -i -ne'/margin-right/ or print' $f;
perl -i -ne'/text-indent/ or print' $f;

#add the right bledding
perl -pi -w -e 's/}/margin-left:1em;margin-right:0;text-indent:-1em;\}/g;' $f
echo "working on css file $f";
fi;

############
if grep -qr L4-R4-I0 $f; then
#delete the bad bleeding
perl -i -ne'/margin-left/ or print' $f;
perl -i -ne'/margin-right/ or print' $f;
perl -i -ne'/text-indent/ or print' $f;

#add the right bledding
perl -pi -w -e 's/}/margin-left:1em;margin-right:1em;text-indent:0;\}/g;' $f
echo "working on css file $f";
fi;

############
if grep -qr L4-R4-I4 $f; then
#delete the bad bleeding
perl -i -ne'/margin-left/ or print' $f;
perl -i -ne'/margin-right/ or print' $f;
perl -i -ne'/text-indent/ or print' $f;

#add the right bledding
perl -pi -w -e 's/}/margin-left:1em;margin-right:1em;text-indent:1em;\}/g;' $f
echo "working on css file $f";
fi;

############
if grep -qr L5-R0-I-5 $f; then
#delete the bad bleeding
perl -i -ne'/margin-left/ or print' $f;
perl -i -ne'/margin-right/ or print' $f;
perl -i -ne'/text-indent/ or print' $f;

#add the right bledding
perl -pi -w -e 's/}/margin-left:1em;margin-right:0;text-indent:-1em;\}/g;' $f
echo "working on css file $f";
fi;

############
if grep -qr L6-R0-I-4 $f; then
#delete the bad bleeding
perl -i -ne'/margin-left/ or print' $f;
perl -i -ne'/margin-right/ or print' $f;
perl -i -ne'/text-indent/ or print' $f;

#add the right bledding
perl -pi -w -e 's/}/margin-left:1em;margin-right:0;text-indent:-1em;\}/g;' $f
echo "working on css file $f";
fi;

############
if grep -qr L6-R6-I0 $f; then
#delete the bad bleeding
perl -i -ne'/margin-left/ or print' $f;
perl -i -ne'/margin-right/ or print' $f;
perl -i -ne'/text-indent/ or print' $f;


#add the right bledding
perl -pi -w -e 's/}/margin-left:1em;margin-right:1em;text-indent:0;\}/g;' $f
echo "working on css file $f";
fi;

############
if grep -qr L6-R6-I3 $f; then
#delete the bad bleeding
perl -i -ne'/margin-left/ or print' $f;
perl -i -ne'/margin-right/ or print' $f;
perl -i -ne'/text-indent/ or print' $f;

#add the right bledding
perl -pi -w -e 's/}/margin-left:1em;margin-right:1em;text-indent:1em;\}/g;' $f
echo "working on css file $f";
fi;

############
if grep -qr CHAPTER_eBook_03-Study-Program---List---middle---L10-R4-I-4---EBOOK $f; then
#delete the bad bleeding
perl -i -ne'/margin-left/ or print' $f;
perl -i -ne'/margin-right/ or print' $f;
perl -i -ne'/text-indent/ or print' $f;

#add the right bledding
perl -pi -w -e 's/}/margin-left:2em;margin-right:1em;text-indent:-1em;\}/g;' $f
echo "working on css file $f";
fi;

############
if grep -qr CHAPTER_eBook_03-Study-Program---List---last---L10-R4-I-4---EBOOK $f; then
#delete the bad bleeding
perl -i -ne'/margin-left/ or print' $f;
perl -i -ne'/margin-right/ or print' $f;
perl -i -ne'/text-indent/ or print' $f;

#add the right bledding
perl -pi -w -e 's/}/margin-left:2em;margin-right:1em;text-indent:-1em;\}/g;' $f
echo "working on css file $f";
fi;


############
if grep -qr CHAPTER_eBook_03-Biblio-entry---2-lines-List-1-to-9---EBOOK $f; then
#delete the bad bleeding
perl -i -ne'/margin-left/ or print' $f;
perl -i -ne'/margin-right/ or print' $f;
perl -i -ne'/text-indent/ or print' $f;

#add the right bledding
perl -pi -w -e 's/}/margin-left:2em;margin-right:0;text-indent:-1em;\}/g;' $f
echo "working on css file $f";
fi;

############
if grep -qr CHAPTER_eBook_03-Biblio-entry---subtitle-List-1-to-9---EBOOK $f; then
#delete the bad bleeding
perl -i -ne'/margin-left/ or print' $f;
perl -i -ne'/margin-right/ or print' $f;
perl -i -ne'/text-indent/ or print' $f;

#add the right bledding
perl -pi -w -e 's/}/margin-left:2em;margin-right:0;text-indent:0;\}/g;' $f
echo "working on css file $f";
fi;

############
if grep -qr CHAPTER_eBook_03-Biblio-entry---2-lines-space-below-List-1-to-9---EBOOK $f; then
#delete the bad bleeding
perl -i -ne'/margin-left/ or print' $f;
perl -i -ne'/margin-right/ or print' $f;
perl -i -ne'/text-indent/ or print' $f;

#add the right bledding
perl -pi -w -e 's/}/margin-left:2em;margin-right:0;text-indent:-1em;\}/g;' $f
echo "working on css file $f";
fi;

############
if grep -qr CHAPTER_eBook_03-Biblio-entry---2-lines-List-10-to-99---EBOOK $f; then
#delete the bad bleeding
perl -i -ne'/margin-left/ or print' $f;
perl -i -ne'/margin-right/ or print' $f;
perl -i -ne'/text-indent/ or print' $f;

#add the right bledding
perl -pi -w -e 's/}/margin-left:1.98em;margin-right:0;text-indent:-1.54em;\}/g;' $f
echo "working on css file $f";
fi;

############
if grep -qr CHAPTER_eBook_03-Biblio-entry---subtitle-List-10-to-99---EBOOK $f; then
#delete the bad bleeding
perl -i -ne'/margin-left/ or print' $f;
perl -i -ne'/margin-right/ or print' $f;
perl -i -ne'/text-indent/ or print' $f;

#add the right bledding
perl -pi -w -e 's/}/margin-left:1.98em;margin-right:0;text-indent:0;\}/g;' $f
echo "working on css file $f";
fi;

############
if grep -qr CHAPTER_eBook_03-Biblio-entry---2-lines-space-below-List-10-to-99---EBOOK $f; then
#delete the bad bleeding
perl -i -ne'/margin-left/ or print' $f;
perl -i -ne'/margin-right/ or print' $f;
perl -i -ne'/text-indent/ or print' $f;

#add the right bledding
perl -pi -w -e 's/}/margin-left:1.98em;margin-right:0;text-indent:-1.54em;\}/g;' $f
echo "working on css file $f";
fi;

############
if grep -qr L8-R0-I-3 $f; then
#delete the bad bleeding
perl -i -ne'/margin-left/ or print' $f;
perl -i -ne'/margin-right/ or print' $f;
perl -i -ne'/text-indent/ or print' $f;

#add the right bledding
perl -pi -w -e 's/}/margin-left:2em;margin-right:0;text-indent:-1em;\}/g;' $f
echo "working on css file $f";
fi;

############
if grep -qr L8-R4-I-4 $f; then
#delete the bad bleeding
perl -i -ne'/margin-left/ or print' $f;
perl -i -ne'/margin-right/ or print' $f;
perl -i -ne'/text-indent/ or print' $f;

#add the right bledding
perl -pi -w -e 's/}/margin-left:2em;margin-right:1em;text-indent:-1em;\}/g;' $f
echo "working on css file $f";
fi;





#dot





############
if grep -qr LIST_dot_1-to-9-begin $f; then
#delete the bad bleeding
perl -i -ne'/margin-left/ or print' $f;
perl -i -ne'/margin-right/ or print' $f;
perl -i -ne'/text-indent/ or print' $f;
perl -i -ne'/-epub-hyphens:none;/ or print' $f;

#add the right bledding
perl -pi -w -e 's/}/margin-left:2em;margin-right:1em;text-indent:-1em;\}/g;' $f
echo "working on css file $f";
fi;

############
if grep -qr LIST_dot_1-to-9-middle $f; then
#delete the bad bleeding
perl -i -ne'/margin-left/ or print' $f;
perl -i -ne'/margin-right/ or print' $f;
perl -i -ne'/text-indent/ or print' $f;
perl -i -ne'/-epub-hyphens:none;/ or print' $f;

#add the right bledding
perl -pi -w -e 's/}/margin-left:2em;margin-right:1em;text-indent:-1em;\}/g;' $f
echo "working on css file $f";
fi;

############
if grep -qr LIST_dot_1-to-9-last $f; then
#delete the bad bleeding
perl -i -ne'/margin-left/ or print' $f;
perl -i -ne'/margin-right/ or print' $f;
perl -i -ne'/text-indent/ or print' $f;
perl -i -ne'/-epub-hyphens:none;/ or print' $f;

#add the right bledding
perl -pi -w -e 's/}/margin-left:2em;margin-right:1em;text-indent:-1em;\}/g;' $f
echo "working on css file $f";
fi;

############
if grep -qr LIST_dot_1-to-9-last-full-space-below $f; then
#delete the bad bleeding
perl -i -ne'/margin-left/ or print' $f;
perl -i -ne'/margin-right/ or print' $f;
perl -i -ne'/text-indent/ or print' $f;
perl -i -ne'/-epub-hyphens:none;/ or print' $f;

#add the right bledding
perl -pi -w -e 's/}/margin-left:2em;margin-right:1em;text-indent:-1em;\}/g;' $f
echo "working on css file $f";
fi;

############
if grep -qr LIST_dot_10-to-99-begin $f; then
#delete the bad bleeding
perl -i -ne'/margin-left/ or print' $f;
perl -i -ne'/margin-right/ or print' $f;
perl -i -ne'/text-indent/ or print' $f;
perl -i -ne'/-epub-hyphens:none;/ or print' $f;

#add the right bledding
perl -pi -w -e 's/}/margin-left:2em;margin-right:1em;text-indent:-1.5em;\}/g;' $f
echo "working on css file $f";
fi;

############
if grep -qr LIST_dot_10-to-99-middle $f; then
#delete the bad bleeding
perl -i -ne'/margin-left/ or print' $f;
perl -i -ne'/margin-right/ or print' $f;
perl -i -ne'/text-indent/ or print' $f;
perl -i -ne'/-epub-hyphens:none;/ or print' $f;

#add the right bledding
perl -pi -w -e 's/}/margin-left:2em;margin-right:1em;text-indent:-1.5em;\}/g;' $f
echo "working on css file $f";
fi;

############
if grep -qr LIST_dot_10-to-99-last $f; then
#delete the bad bleeding
perl -i -ne'/margin-left/ or print' $f;
perl -i -ne'/margin-right/ or print' $f;
perl -i -ne'/text-indent/ or print' $f;
perl -i -ne'/-epub-hyphens:none;/ or print' $f;

#add the right bledding
perl -pi -w -e 's/}/margin-left:2em;margin-right:1em;text-indent:-1.5em;\}/g;' $f
echo "working on css file $f";
fi;

############
if grep -qr LIST_dot_10-to-99-last-full-space-below $f; then
#delete the bad bleeding
perl -i -ne'/margin-left/ or print' $f;
perl -i -ne'/margin-right/ or print' $f;
perl -i -ne'/text-indent/ or print' $f;
perl -i -ne'/-epub-hyphens:none;/ or print' $f;

#add the right bledding
perl -pi -w -e 's/}/margin-left:2em;margin-right:1em;text-indent:-1.5em;\}/g;' $f
echo "working on css file $f";
fi;




#double_space





############
if grep -qr LIST_double-space_1-to-9-begin $f; then
#delete the bad bleeding
perl -i -ne'/margin-left/ or print' $f;
perl -i -ne'/margin-right/ or print' $f;
perl -i -ne'/text-indent/ or print' $f;
perl -i -ne'/-epub-hyphens:none;/ or print' $f;

#add the right bledding
perl -pi -w -e 's/}/margin-left:2em;margin-right:1em;text-indent:-1em;\}/g;' $f
echo "working on css file $f";
fi;

############
if grep -qr LIST_double-space_1-to-9-middle $f; then
#delete the bad bleeding
perl -i -ne'/margin-left/ or print' $f;
perl -i -ne'/margin-right/ or print' $f;
perl -i -ne'/text-indent/ or print' $f;
perl -i -ne'/-epub-hyphens:none;/ or print' $f;

#add the right bledding
perl -pi -w -e 's/}/margin-left:2em;margin-right:1em;text-indent:-1em;\}/g;' $f
echo "working on css file $f";
fi;

############
if grep -qr LIST_double-space_1-to-9-last $f; then
#delete the bad bleeding
perl -i -ne'/margin-left/ or print' $f;
perl -i -ne'/margin-right/ or print' $f;
perl -i -ne'/text-indent/ or print' $f;
perl -i -ne'/-epub-hyphens:none;/ or print' $f;

#add the right bledding
perl -pi -w -e 's/}/margin-left:2em;margin-right:1em;text-indent:-1em;\}/g;' $f
echo "working on css file $f";
fi;

############
if grep -qr LIST_double-space_1-to-9-last-full-space-below $f; then
#delete the bad bleeding
perl -i -ne'/margin-left/ or print' $f;
perl -i -ne'/margin-right/ or print' $f;
perl -i -ne'/text-indent/ or print' $f;
perl -i -ne'/-epub-hyphens:none;/ or print' $f;

#add the right bledding
perl -pi -w -e 's/}/margin-left:2em;margin-right:1em;text-indent:-1em;\}/g;' $f
echo "working on css file $f";
fi;

############
if grep -qr LIST_double-space_10-to-99-begin $f; then
#delete the bad bleeding
perl -i -ne'/margin-left/ or print' $f;
perl -i -ne'/margin-right/ or print' $f;
perl -i -ne'/text-indent/ or print' $f;
perl -i -ne'/-epub-hyphens:none;/ or print' $f;

#add the right bledding
perl -pi -w -e 's/}/margin-left:2em;margin-right:1em;text-indent:-1.5em;\}/g;' $f
echo "working on css file $f";
fi;

############
if grep -qr LIST_double-space_10-to-99-middle $f; then
#delete the bad bleeding
perl -i -ne'/margin-left/ or print' $f;
perl -i -ne'/margin-right/ or print' $f;
perl -i -ne'/text-indent/ or print' $f;
perl -i -ne'/-epub-hyphens:none;/ or print' $f;

#add the right bledding
perl -pi -w -e 's/}/margin-left:2em;margin-right:1em;text-indent:-1.5em;\}/g;' $f
echo "working on css file $f";
fi;

############
if grep -qr LIST_double-space_10-to-99-last $f; then
#delete the bad bleeding
perl -i -ne'/margin-left/ or print' $f;
perl -i -ne'/margin-right/ or print' $f;
perl -i -ne'/text-indent/ or print' $f;
perl -i -ne'/-epub-hyphens:none;/ or print' $f;

#add the right bledding
perl -pi -w -e 's/}/margin-left:2em;margin-right:1em;text-indent:-1.5em;\}/g;' $f
echo "working on css file $f";
fi;

############
if grep -qr LIST_double-space_10-to-99-last-full-space-below $f; then
#delete the bad bleeding
perl -i -ne'/margin-left/ or print' $f;
perl -i -ne'/margin-right/ or print' $f;
perl -i -ne'/text-indent/ or print' $f;
perl -i -ne'/-epub-hyphens:none;/ or print' $f;

#add the right bledding
perl -pi -w -e 's/}/margin-left:2em;margin-right:1em;text-indent:-1.5em;\}/g;' $f
echo "working on css file $f";
fi;




#parentesis





############
if grep -qr LIST_parentesis_1-to-9-begin $f; then
#delete the bad bleeding
perl -i -ne'/margin-left/ or print' $f;
perl -i -ne'/margin-right/ or print' $f;
perl -i -ne'/text-indent/ or print' $f;
perl -i -ne'/-epub-hyphens:none;/ or print' $f;

#add the right bledding
perl -pi -w -e 's/}/margin-left:2em;margin-right:1em;text-indent:-1em;\}/g;' $f
echo "working on css file $f";
fi;

############
if grep -qr LIST_parentesis_1-to-9-middle $f; then
#delete the bad bleeding
perl -i -ne'/margin-left/ or print' $f;
perl -i -ne'/margin-right/ or print' $f;
perl -i -ne'/text-indent/ or print' $f;
perl -i -ne'/-epub-hyphens:none;/ or print' $f;

#add the right bledding
perl -pi -w -e 's/}/margin-left:2em;margin-right:1em;text-indent:-1em;\}/g;' $f
echo "working on css file $f";
fi;

############
if grep -qr LIST_parentesis_1-to-9-last $f; then
#delete the bad bleeding
perl -i -ne'/margin-left/ or print' $f;
perl -i -ne'/margin-right/ or print' $f;
perl -i -ne'/text-indent/ or print' $f;
perl -i -ne'/-epub-hyphens:none;/ or print' $f;

#add the right bledding
perl -pi -w -e 's/}/margin-left:2em;margin-right:1em;text-indent:-1em;\}/g;' $f
echo "working on css file $f";
fi;

############
if grep -qr LIST_parentesis_1-to-9-last-full-space-below $f; then
#delete the bad bleeding
perl -i -ne'/margin-left/ or print' $f;
perl -i -ne'/margin-right/ or print' $f;
perl -i -ne'/text-indent/ or print' $f;
perl -i -ne'/-epub-hyphens:none;/ or print' $f;

#add the right bledding
perl -pi -w -e 's/}/margin-left:2em;margin-right:1em;text-indent:-1em;\}/g;' $f
echo "working on css file $f";
fi;

############
if grep -qr LIST_parentesis_10-to-99-begin $f; then
#delete the bad bleeding
perl -i -ne'/margin-left/ or print' $f;
perl -i -ne'/margin-right/ or print' $f;
perl -i -ne'/text-indent/ or print' $f;
perl -i -ne'/-epub-hyphens:none;/ or print' $f;

#add the right bledding
perl -pi -w -e 's/}/margin-left:2em;margin-right:1em;text-indent:-1.5em;\}/g;' $f
echo "working on css file $f";
fi;

############
if grep -qr LIST_parentesis_10-to-99-middle $f; then
#delete the bad bleeding
perl -i -ne'/margin-left/ or print' $f;
perl -i -ne'/margin-right/ or print' $f;
perl -i -ne'/text-indent/ or print' $f;
perl -i -ne'/-epub-hyphens:none;/ or print' $f;

#add the right bledding
perl -pi -w -e 's/}/margin-left:2em;margin-right:1em;text-indent:-1.5em;\}/g;' $f
echo "working on css file $f";
fi;

############
if grep -qr LIST_parentesis_10-to-99-last $f; then
#delete the bad bleeding
perl -i -ne'/margin-left/ or print' $f;
perl -i -ne'/margin-right/ or print' $f;
perl -i -ne'/text-indent/ or print' $f;
perl -i -ne'/-epub-hyphens:none;/ or print' $f;

#add the right bledding
perl -pi -w -e 's/}/margin-left:2em;margin-right:1em;text-indent:-1.5em;\}/g;' $f
echo "working on css file $f";
fi;

############
if grep -qr LIST_parentesis_10-to-99-last-full-space-below $f; then
#delete the bad bleeding
perl -i -ne'/margin-left/ or print' $f;
perl -i -ne'/margin-right/ or print' $f;
perl -i -ne'/text-indent/ or print' $f;
perl -i -ne'/-epub-hyphens:none;/ or print' $f;

#add the right bledding
perl -pi -w -e 's/}/margin-left:2em;margin-right:1em;text-indent:-1.5em;\}/g;' $f
echo "working on css file $f";
fi;





#parentesis-double






############
if grep -qr LIST_parentesis-double_1-to-9-begin $f; then
#delete the bad bleeding
perl -i -ne'/margin-left/ or print' $f;
perl -i -ne'/margin-right/ or print' $f;
perl -i -ne'/text-indent/ or print' $f;
perl -i -ne'/-epub-hyphens:none;/ or print' $f;

#add the right bledding
perl -pi -w -e 's/}/margin-left:2.57em;margin-right:1em;text-indent:-1.57em;\}/g;' $f
echo "working on css file $f";
fi;

############
if grep -qr LIST_parentesis-double_1-to-9-middle $f; then
#delete the bad bleeding
perl -i -ne'/margin-left/ or print' $f;
perl -i -ne'/margin-right/ or print' $f;
perl -i -ne'/text-indent/ or print' $f;
perl -i -ne'/-epub-hyphens:none;/ or print' $f;

#add the right bledding
perl -pi -w -e 's/}/margin-left:2.57em;margin-right:1em;text-indent:-1.57em;\}/g;' $f
echo "working on css file $f";
fi;

############
if grep -qr LIST_parentesis-double_1-to-9-last $f; then
#delete the bad bleeding
perl -i -ne'/margin-left/ or print' $f;
perl -i -ne'/margin-right/ or print' $f;
perl -i -ne'/text-indent/ or print' $f;
perl -i -ne'/-epub-hyphens:none;/ or print' $f;

#add the right bledding
perl -pi -w -e 's/}/margin-left:2.57em;margin-right:1em;text-indent:-1.57em;\}/g;' $f
echo "working on css file $f";
fi;

############
if grep -qr LIST_parentesis-double_1-to-9-last-full-space-below $f; then
#delete the bad bleeding
perl -i -ne'/margin-left/ or print' $f;
perl -i -ne'/margin-right/ or print' $f;
perl -i -ne'/text-indent/ or print' $f;
perl -i -ne'/-epub-hyphens:none;/ or print' $f;

#add the right bledding
perl -pi -w -e 's/}/margin-left:2.57em;margin-right:1em;text-indent:-1.57em;\}/g;' $f
echo "working on css file $f";
fi;

############
if grep -qr LIST_parentesis-double_10-to-99-begin $f; then
#delete the bad bleeding
perl -i -ne'/margin-left/ or print' $f;
perl -i -ne'/margin-right/ or print' $f;
perl -i -ne'/text-indent/ or print' $f;
perl -i -ne'/-epub-hyphens:none;/ or print' $f;

#add the right bledding
perl -pi -w -e 's/}/margin-left:2.68em;margin-right:1em;text-indent:-2.07em;\}/g;' $f
echo "working on css file $f";
fi;

############
if grep -qr LIST_parentesis-double_10-to-99-middle $f; then
#delete the bad bleeding
perl -i -ne'/margin-left/ or print' $f;
perl -i -ne'/margin-right/ or print' $f;
perl -i -ne'/text-indent/ or print' $f;
perl -i -ne'/-epub-hyphens:none;/ or print' $f;

#add the right bledding
perl -pi -w -e 's/}/margin-left:2.68em;margin-right:1em;text-indent:-2.07em;\}/g;' $f
echo "working on css file $f";
fi;

############
if grep -qr LIST_parentesis-double_10-to-99-last $f; then
#delete the bad bleeding
perl -i -ne'/margin-left/ or print' $f;
perl -i -ne'/margin-right/ or print' $f;
perl -i -ne'/text-indent/ or print' $f;
perl -i -ne'/-epub-hyphens:none;/ or print' $f;

#add the right bledding
perl -pi -w -e 's/}/margin-left:2.68em;margin-right:1em;text-indent:-2.07em;\}/g;' $f
echo "working on css file $f";
fi;

############
if grep -qr LIST_parentesis-double_10-to-99-last-full-space-below $f; then
#delete the bad bleeding
perl -i -ne'/margin-left/ or print' $f;
perl -i -ne'/margin-right/ or print' $f;
perl -i -ne'/text-indent/ or print' $f;
perl -i -ne'/-epub-hyphens:none;/ or print' $f;

#add the right bledding
perl -pi -w -e 's/}/margin-left:2.68em;margin-right:1em;text-indent:-2.07em;\}/g;' $f
echo "working on css file $f";
fi;





#parentesis-double-para






############
if grep -qr LIST_parentesis-double-para_1-to-9-begin $f; then
#delete the bad bleeding
perl -i -ne'/margin-left/ or print' $f;
perl -i -ne'/margin-right/ or print' $f;
perl -i -ne'/text-indent/ or print' $f;
perl -i -ne'/-epub-hyphens:none;/ or print' $f;

#add the right bledding
perl -pi -w -e 's/}/margin-left:2em;margin-right:1em;text-indent:-1em;\}/g;' $f
echo "working on css file $f";
fi;

############
if grep -qr LIST_parentesis-double-para_1-to-9-middle $f; then
#delete the bad bleeding
perl -i -ne'/margin-left/ or print' $f;
perl -i -ne'/margin-right/ or print' $f;
perl -i -ne'/text-indent/ or print' $f;
perl -i -ne'/-epub-hyphens:none;/ or print' $f;

#add the right bledding
perl -pi -w -e 's/}/margin-left:2em;margin-right:1em;text-indent:-1em;\}/g;' $f
echo "working on css file $f";
fi;

############
if grep -qr LIST_parentesis-double-para_1-to-9-last $f; then
#delete the bad bleeding
perl -i -ne'/margin-left/ or print' $f;
perl -i -ne'/margin-right/ or print' $f;
perl -i -ne'/text-indent/ or print' $f;
perl -i -ne'/-epub-hyphens:none;/ or print' $f;

#add the right bledding
perl -pi -w -e 's/}/margin-left:2em;margin-right:1em;text-indent:-1em;\}/g;' $f
echo "working on css file $f";
fi;

############
if grep -qr LIST_parentesis-double-para_1-to-9-last-full-space-below $f; then
#delete the bad bleeding
perl -i -ne'/margin-left/ or print' $f;
perl -i -ne'/margin-right/ or print' $f;
perl -i -ne'/text-indent/ or print' $f;
perl -i -ne'/-epub-hyphens:none;/ or print' $f;

#add the right bledding
perl -pi -w -e 's/}/margin-left:2em;margin-right:1em;text-indent:-1em;\}/g;' $f
echo "working on css file $f";
fi;

############
if grep -qr LIST_parentesis-double-para_10-to-99-begin $f; then
#delete the bad bleeding
perl -i -ne'/margin-left/ or print' $f;
perl -i -ne'/margin-right/ or print' $f;
perl -i -ne'/text-indent/ or print' $f;
perl -i -ne'/-epub-hyphens:none;/ or print' $f;

#add the right bledding
perl -pi -w -e 's/}/margin-left:2em;margin-right:1em;text-indent:-1.5em;\}/g;' $f
echo "working on css file $f";
fi;

############
if grep -qr LIST_parentesis-double-para_10-to-99-middle $f; then
#delete the bad bleeding
perl -i -ne'/margin-left/ or print' $f;
perl -i -ne'/margin-right/ or print' $f;
perl -i -ne'/text-indent/ or print' $f;
perl -i -ne'/-epub-hyphens:none;/ or print' $f;

#add the right bledding
perl -pi -w -e 's/}/margin-left:2em;margin-right:1em;text-indent:-1.5em;\}/g;' $f
echo "working on css file $f";
fi;

############
if grep -qr LIST_parentesis-double-para_10-to-99-last $f; then
#delete the bad bleeding
perl -i -ne'/margin-left/ or print' $f;
perl -i -ne'/margin-right/ or print' $f;
perl -i -ne'/text-indent/ or print' $f;
perl -i -ne'/-epub-hyphens:none;/ or print' $f;

#add the right bledding
perl -pi -w -e 's/}/margin-left:2em;margin-right:1em;text-indent:-1.5em;\}/g;' $f
echo "working on css file $f";
fi;

############
if grep -qr LIST_parentesis-double-para_10-to-99-last-full-space-below $f; then
#delete the bad bleeding
perl -i -ne'/margin-left/ or print' $f;
perl -i -ne'/margin-right/ or print' $f;
perl -i -ne'/text-indent/ or print' $f;
perl -i -ne'/-epub-hyphens:none;/ or print' $f;

#add the right bledding
perl -pi -w -e 's/}/margin-left:2em;margin-right:1em;text-indent:-1.5em;\}/g;' $f
echo "working on css file $f";
fi;




#bullets






############
if grep -qr LIST_bullets-begin $f; then
#delete the bad bleeding
perl -i -ne'/margin-left/ or print' $f;
perl -i -ne'/margin-right/ or print' $f;
perl -i -ne'/text-indent/ or print' $f;
perl -i -ne'/-epub-hyphens:none;/ or print' $f;

#add the right bledding
perl -pi -w -e 's/}/margin-left:2em;margin-right:1em;text-indent:-1em;\}/g;' $f
echo "working on css file $f";
fi;

############
if grep -qr LIST_bullets-middle $f; then
#delete the bad bleeding
perl -i -ne'/margin-left/ or print' $f;
perl -i -ne'/margin-right/ or print' $f;
perl -i -ne'/text-indent/ or print' $f;
perl -i -ne'/-epub-hyphens:none;/ or print' $f;

#add the right bledding
perl -pi -w -e 's/}/margin-left:2em;margin-right:1em;text-indent:-1em;\}/g;' $f
echo "working on css file $f";
fi;

############
if grep -qr LIST_bullets-last $f; then
#delete the bad bleeding
perl -i -ne'/margin-left/ or print' $f;
perl -i -ne'/margin-right/ or print' $f;
perl -i -ne'/text-indent/ or print' $f;
perl -i -ne'/-epub-hyphens:none;/ or print' $f;

#add the right bledding
perl -pi -w -e 's/}/margin-left:2em;margin-right:1em;text-indent:-1em;\}/g;' $f
echo "working on css file $f";
fi;

############
if grep -qr LIST_bullets-last-full-space-below $f; then
#delete the bad bleeding
perl -i -ne'/margin-left/ or print' $f;
perl -i -ne'/margin-right/ or print' $f;
perl -i -ne'/text-indent/ or print' $f;
perl -i -ne'/-epub-hyphens:none;/ or print' $f;

#add the right bledding
perl -pi -w -e 's/}/margin-left:2em;margin-right:1em;text-indent:-1.5em;\}/g;' $f
echo "working on css file $f";
fi;

############
if grep -qr Small-Caps $f; then
#delete the bad bleeding
perl -i -ne'/font-size/ or print' $f;

#add the right bledding
perl -pi -w -e 's/}/font-size:0.9em;\}/g;' $f
echo "working on css file $f";
fi;

############
if grep -qr Font-10-5 $f; then
#delete the bad bleeding
perl -i -ne'/font-size/ or print' $f;

#add the right bledding
perl -pi -w -e 's/}/font-size:1em;\}/g;' $f
echo "working on css file $f";
fi;

done;


############
# Delete the original CSS
rm ./ePub/OEBPS/css/idGeneratedStyles.css;
# merge the css files
cat ./ePub/OEBPS/css/GeneratedStyles* > ./ePub/OEBPS/css/idGeneratedStyles.css;
# If you're using bash (the default shell), the extglob shell option allows you to use an extended pattern matching syntax.
shopt -s extglob
#remove all files except the idGeneratedStyles.css
rm -r ./ePub/OEBPS/css/!(idGeneratedStyles.css)

sudo chown -Rv $USER ./ePub
chmod -R 777 ./ePub
echo "############### END 7. SPLIT CSS IN FILES AND CONVERT MARGIN-LEFT, MARGIN-RIGHT, TEXT-INDENT ###############";

echo "#################### 8. DELETE FONTS ##################";
# You needn´t do this if uncheck the include font in Indesign.
# Probally you haven't license for distribute the font of your eBook, for this reason delete these
# Delete Font family
 perl -ni -e "print unless /font-family:/" ./ePub/OEBPS/css/idGeneratedStyles.css
# Delete Font folder
# rm -r ./ePub/OEBPS/font
echo "#################### END 8. DELETE FONTS ##################";

echo "############### 8.1. INSERT OR DELETE CODE IN SPECIFIC LINE #######################################################";
# DELETE CSS LINES. It´s optional. Delete specific lines creating a temporally file, from your CSS for show the pictures with a right size on devices
#for x in ./ePub/OEBPS/css/idGeneratedStyles.css;
#do
#sed '1710,1713d' <"$x" >"$x.tmp"
#mv "$x.tmp" "$x"
#done


# Method 1: Add text in a specific line
#ex -sc '1710i|margin-left:1em;margin-right:0;text-indent:-1em;}' -cx ./ePub/OEBPS/css/idGeneratedStyles.css;

# Method 2: Add text in a specific line
#sed -i '' '1710i\
#margin-left:2em;margin-right:1em;text-indent:-1.5em;}' ./ePub/OEBPS/css/idGeneratedStyles.css

echo "############### END 8.1. INSERT OR DELETE CODE IN SPECIFIC LINE #######################################################";

echo "############### 3.1 ADD EXTRA CSS AND XHTML ###############################################";

# 1º Merge extra CSS and XHTML files. Give normal permission to the modify files
# 2º To prevent errors, be sure the next recomendations:
#	- at the end at the file you have blank line empty
#	- delete any comments in your code.
# cat extra.css >> ./ePub/OEBPS/css/idGeneratedStyles.css
# sudo chown -Rv $USER ./ePub/OEBPS/css/idGeneratedStyles.css
# chmod -R 777 ./ePub/OEBPS/css/idGeneratedStyles.css
# #
# ## 2º Copy the table and others xhtml
#  cp -f ePub-18.xhtml ./ePub/OEBPS/ePub-18.xhtml
#  sudo chown -Rv $USER ./ePub/OEBPS/ePub-18.xhtml
#  chmod -R 777 ./ePub/OEBPS/ePub-18.xhtml

#  cp -f ePub-20.xhtml ./ePub/OEBPS/ePub-20.xhtml
#  sudo chown -Rv $USER ./ePub/OEBPS/ePub-20.xhtml
#  chmod -R 777 ./ePub/OEBPS/ePub-20.xhtml

#  cp -f ePub-22.xhtml ./ePub/OEBPS/ePub-22.xhtml
#  sudo chown -Rv $USER ./ePub/OEBPS/ePub-22.xhtml
#  chmod -R 777 ./ePub/OEBPS/ePub-22.xhtml

#  cp -f ePub-24.xhtml ./ePub/OEBPS/ePub-24.xhtml
#  sudo chown -Rv $USER ./ePub/OEBPS/ePub-24.xhtml
#  chmod -R 777 ./ePub/OEBPS/ePub-24.xhtml


echo "############### END 3.1 ADD EXTRA CSS AND XHTML ###############################################";


echo "#################### 9. ZIP EPUB ##################";
rm -f ./ePub/.DS_Store
rm -f ./ePub/OEBPS/.DS_Store
rm -f ./ePub/OEBPS/image/.DS_Store
rm -f ./ePub/OEBPS/css/.DS_Store

sh ./pack-single.sh ePub
sudo chown -Rv $USER ePub.epub
chmod -R 777 ePub.epub
open -a "iBooks" ePub.epub
echo "#################### END 9. ZIP EPUB ##################";

echo "################### 10. CREATE MOBI WITH KINDLE GEN ##################";
# replace the next path for your absolute path where you place the kindlegen file otherway don´t work.
./ePub/kindlegen ePub.epub
sudo chmod -R 777 ePub.mobi
sudo chown -v $USER ePub.mobi
echo "#################### END 10. CREATE MOBI WITH KINDLE GEN ##################";



echo "############### 12. UNZIP DE EPUB #######################################################";
# -q Not display any Output
# -o Override all files
# -d Output directory
cp ePub.epub ePub.zip
unzip -o -q ePub.zip -d ePub/
sudo chown -Rv $USER ./ePub
chmod -R 777 ./ePub
echo "############### END 12. UNZIP DE EPUB #######################################################";

echo "OM AH HUM";
