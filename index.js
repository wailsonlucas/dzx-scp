const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const successEmoji = '✅';
const errorEmoji = '❌';
const yey = '🎉 ';

const url = 'https://www.ency-education.com/1am-exams-sciences.html';
const subject = 'sciences';
const outputFilePath = 'data.txt'; // Path to the output file

async function scrapeWebsite() {
    try {
        // Send a GET request to the URL
        const response = await axios.get(url);
        
        // Check if the request was successful
        if (response.status === 200) {
            // Load the HTML into cheerio
            const $ = cheerio.load(response.data);
            
            // Array to hold the filtered links
            const links = [];

            // Select all <a> elements and filter based on the href
            $('a').each((index, element) => {
                const href = $(element).attr('href');
                if (href && href.includes(subject)) {
                    console.log(`${yey} ${href}`)
                    links.push(href);
                }
            });

            // Write the filtered links to a text file
            fs.writeFileSync(outputFilePath, links.join('\n'), 'utf8');
            console.log(`${yey} Links containing '${subject}' written to ${outputFilePath}`);
        } else {
            console.error(`${errorEmoji} Error: Received status code ${response.status}`);
        }
    } catch (error) {
        console.error(`${errorEmoji} Error fetching the URL: ${error.message}`);
    }
}

// Call the function to scrape the website
scrapeWebsite();