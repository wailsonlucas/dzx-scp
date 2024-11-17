const puppeteer = require('puppeteer');
const fs = require('fs');

const url = 'https://www.dzexams.com/ar/1ap/mathematiques'; // Target website's URL
const divId = 'panel-sujets'; // ID of the div to search within
const level = "1ap";
const subject = "mathematiques";
const condition_1 = "الفصل"; // First condition
const condition_2 = "الأول";  // Second condition
const outputFile = `${level}-${subject}-${condition_1}-${condition_2}.txt`; 

async function scrapeLinks() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
        // Navigate to the target URL
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

        // Wait for the div with the specified ID to load
        await page.waitForSelector(`#${divId}`, { timeout: 30000 });

        // Extract href attributes and text content of all <a> elements inside the specified div
        const links = await page.$$eval(`#${divId} a`, anchors => 
            anchors.map(anchor => ({
                href: anchor.href,
                text: anchor.textContent.trim() // Get the text content of each <a> element
            }))
        );


        // Filter links based on the presence of both conditions in the text
        const filteredLinks = links.filter(link => 
            link.text.includes(condition_1) && link.text.includes(condition_2)
        );

            console.log(`عدد المواضيع: ${filteredLinks.length}`);
            console.log(`المستوى: ${level}`);
            console.log(`الموادة: ${subject}`);
            console.log(`الشرط 01: ${condition_1}`);
            console.log(`الشؤط 02: ${condition_2}`);

        console.log(filteredLinks);

        // Loop through each filtered link to fetch the download link
        for (const { href, text } of filteredLinks) {
            // Log the anchor text and URL
            // console.log(`Processing link: ${text} - URL: ${href}`);

            // Navigate to the link
            await page.goto(href, { waitUntil: 'networkidle2', timeout: 30000 });

            // Wait for the actions-download link to appear
            const downloadLinkExists = await page.$('#actions-download');

            if (downloadLinkExists) {
                // Extract the href attribute of the actions-download link
                const downloadLink = await page.$eval('#actions-download', a => a.href);

                // Log and write the download link to the file immediately
                console.log(`رابط : ${downloadLink}`);
                fs.appendFileSync(outputFile, `${downloadLink}\n`, 'utf8'); // Append the link with text to the file
            } else {
                console.log(`No download link found for: ${text} - URL: ${href}`);
            }
        }

    } catch (error) {
        console.error('Error fetching the URL:', error);
    } finally {
        await browser.close();
    }
}

scrapeLinks();