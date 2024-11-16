const puppeteer = require('puppeteer');
const fs = require('fs');

const url = 'https://www.dzexams.com/ar/1ap/mathematiques'; // Replace with the target website's URL
const divId = 'panel-sujets'; // ID of the div to search within
const level = "1ap"
const subject = "mathematiques"
const outputFile = `${level}-${subject}.txt`; 

async function scrapeLinks() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
        // Navigate to the target URL
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

        // Wait for the div with the specified ID to load
        await page.waitForSelector(`#${divId}`, { timeout: 30000 });

        // Extract href attributes of all <a> elements inside the specified div
        const links = await page.$$eval(`#${divId} a`, anchors => 
            anchors.map(anchor => anchor.href) // Get the href attribute of each <a> element
        );

        // Loop through each link to fetch the download link
        for (const link of links) {
            // Navigate to the link
            await page.goto(link, { waitUntil: 'networkidle2', timeout: 30000 });

            // Wait for the actions-download link to appear
            const downloadLinkExists = await page.$('#actions-download');

            if (downloadLinkExists) {
                // Extract the href attribute of the actions-download link
                const downloadLink = await page.$eval('#actions-download', a => a.href);

                // Log and write the download link to the file immediately
                console.log(`Found download link: ${downloadLink}`);
                fs.appendFileSync(outputFile, `${downloadLink}\n`, 'utf8'); // Append the link to the file
            } else {
                console.log(`No download link found for: ${link}`);
            }
        }

    } catch (error) {
        console.error('Error fetching the URL:', error);
    } finally {
        await browser.close();
    }
}

scrapeLinks();