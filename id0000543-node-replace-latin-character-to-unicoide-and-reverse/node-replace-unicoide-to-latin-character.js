const fs = require('fs');
const path = require('path');

// Define the file name
const fileName = 'id0000542-Add-Text-glosary-and-cross-references-1-2-3-4-Levels.jsx';
const backupFileName = `${fileName}.bak`;

// Read the file
let fileContent = fs.readFileSync(fileName, 'utf8');

// Create a mapping of Unicode escape sequences to Latin characters
const unicodeToCharMap = {
    '\\u00E1': 'á',
    '\\u00E9': 'é',
    '\\u00ED': 'í',
    '\\u00F3': 'ó',
    '\\u00FA': 'ú',
    '\\u00FC': 'ü',
    '\\u00F1': 'ñ',
    '\\u00C1': 'Á',
    '\\u00C9': 'É',
    '\\u00CD': 'Í',
    '\\u00D3': 'Ó',
    '\\u00DA': 'Ú',
    '\\u00DC': 'Ü',
    '\\u00D1': 'Ñ'
};

// Replace each Unicode escape sequence in the file content
const reversedContent = fileContent.replace(/\\u[0-9A-Fa-f]{4}/g, match => {
    return unicodeToCharMap[match] || match; // If not found in map, return original match
});

// Create a backup of the original file
fs.writeFileSync(backupFileName, fileContent);

// Write the reversed content to the original file
fs.writeFileSync(fileName, reversedContent);

console.log(`Conversion complete. A backup of the original file is saved as ${backupFileName}.`);
