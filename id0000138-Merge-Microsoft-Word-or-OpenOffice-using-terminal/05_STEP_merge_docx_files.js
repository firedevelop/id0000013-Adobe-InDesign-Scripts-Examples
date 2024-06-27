const fs = require('fs');
const path = require('path');
const builder = require('docx-builder');
const docx = new builder.Document();

// Define the directory containing the .docx files
const inputDir = path.join(__dirname, '04_files_openOffice_merged');

// Read the directory contents
fs.readdir(inputDir, (err, files) => {
    if (err) {
        console.error('Error reading directory:', err);
        return;
    }

    // Filter out .docx files
    const docxFiles = files.filter(file => path.extname(file).toLowerCase() === '.docx');

    if (docxFiles.length === 0) {
        console.log('No .docx files found in the directory.');
        return;
    }

    // Loop through and insert each .docx file
    docxFiles.forEach(file => {
        const filePath = path.join(inputDir, file);
        try {
            docx.insertDocxSync(filePath);
            console.log(`Inserted ${filePath}`);
        } catch (err) {
            console.error(`Error inserting ${filePath}:`, err);
        }
    });

    // Save the merged .docx file
    const outputFilePath = path.join(__dirname, 'finalMergeOpenOffice.docx');
    docx.save(outputFilePath, err => {
        if (err) {
            console.error('Error saving document:', err);
        } else {
            console.log(`Merged document saved to ${outputFilePath}`);
        }
    });
});
