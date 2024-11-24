const fs = require('fs');
const xlsx = require('xlsx');

const inputFile = '1ap-mathematiques-الفصل-الأول.txt'; // Input text file
const outputFile = '1ap-mathematiques.xlsx'; // Output Excel file

function convertTxtToExcel(inputFile, outputFile) {
    // Read the input file
    const data = fs.readFileSync(inputFile, 'utf8');

    // Split the data into lines
    const lines = data.split('\n').filter(line => line.trim() !== '');

    // Prepare data for Excel
    const excelData = lines.map(line => {
        const [text, link] = line.split(': ').map(part => part.trim());
        return { Text: text, Link: link };
    });

    // Create a new workbook and a worksheet
    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.json_to_sheet(excelData);

    // Append the worksheet to the workbook
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Links');

    // Write the workbook to an Excel file
    xlsx.writeFile(workbook, outputFile);
    console.log(`Converted ${inputFile} to ${outputFile}`);
}

// Call the function to perform the conversion
convertTxtToExcel(inputFile, outputFile);