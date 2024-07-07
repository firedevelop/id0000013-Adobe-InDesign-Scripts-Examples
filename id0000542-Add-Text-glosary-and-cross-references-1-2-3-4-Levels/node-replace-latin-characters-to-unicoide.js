const fs = require('fs');
const path = require('path');

// Define the file name
const fileName = 'id0000542-Add-Text-glosary-and-cross-references-1-2-3-4-Levels.jsx';
const backupFileName = `${fileName}.bak`;

// Read the file
let fileContent = fs.readFileSync(fileName, 'utf8');

// Create a mapping of characters to their Unicode equivalents
const charMap = {
    'á': '\\u00E1',
    'é': '\\u00E9',
    'í': '\\u00ED',
    'ó': '\\u00F3',
    'ú': '\\u00FA',
    'ü': '\\u00FC',
    'ñ': '\\u00F1',
    'Á': '\\u00C1',
    'É': '\\u00C9',
    'Í': '\\u00CD',
    'Ó': '\\u00D3',
    'Ú': '\\u00DA',
    'Ü': '\\u00DC',
    'Ñ': '\\u00D1'
};

// Replace each character in the file content
const replacedContent = fileContent.replace(/[áéíóúüñÁÉÍÓÚÜÑ]/g, match => charMap[match]);

// Create a backup of the original file
fs.writeFileSync(backupFileName, fileContent);

// Write the replaced content to the original file
fs.writeFileSync(fileName, replacedContent);

console.log(`Replacement complete. A backup of the original file is saved as ${backupFileName}.`);
