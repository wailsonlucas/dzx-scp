const fs = require('fs');
const successEmoji = '✅';
const errorEmoji = '❌';
// Get the parameter from command line arguments
const args = process.argv.slice(2);
const param = args[0]; // The parameter to filter the links
// const output = args[1]; // The parameter to filter the links

if (!param) {
    console.error('Please provide a parameter to filter the links.');
    process.exit(1);
}


// Read the input file
fs.readFile('data.txt', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading the file:', err);
        return;
    }

    // Split the content into lines
    const lines = data.split('\n');

    // Filter lines that contain the parameter
    const filteredLinks = lines.filter(line => line.includes(param));

    // Write the filtered links to output.txt
    fs.writeFile(`${param}.txt`, filteredLinks.join('\n'), (err) => {
        if (err) {
            console.error(errorEmoji + 'Error writing to the file:', err);
            return;
        }
        console.log(`${successEmoji} Filtered links have been written to output.txt`);
    });
});