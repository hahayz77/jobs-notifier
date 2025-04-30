require('dotenv').config();

const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const port = 3000;

// Email Configuration
const emailConfig = {
    service: process.env.SMTP_SERVICE,
    auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD
    }
};

// List of websites to monitor
const sitesToMonitor = [
    {
        name: 'Vanhack',
        url: 'https://vanhack.com/jobs/in-canada',
        itemSelector: '.job-card', // Selector for individual job items
        titleSelector: 'a div h2', // Selector for the job title inside a job-card
        linkSelector: 'a', // Selector for the job link inside a job-card
        method: 'puppeteer',
        others: [ // Array for extra information per item
            { title: "Company", selector: '.job-company-selector' }, // <-- REPLACE selector for company
            { title: "Location", selector: '.job-location-selector' } // <-- REPLACE selector for location
            // Add more extra fields here
        ]
    },
    // Add other sites here with their respective selectors and 'others' arrays
    /*
    {
        name: 'Another Site (Puppeteer)',
        url: 'https://www.anothersite.ca/jobs',
        itemSelector: '.job-item-class',
        titleSelector: 'h3',
        linkSelector: 'a',
        method: 'puppeteer',
        others: [
            { title: "Salary", selector: '.salary-info' }
        ]
    },
    {
        name: 'Third Site (Axios)', // Example if you add axios logic back
        url: 'https://www.thirdsite.com/careers',
        itemSelector: 'div.listing',
        titleSelector: '.title-class',
        linkSelector: 'a.listing-link',
        method: 'axios',
        others: [
            { title: "Posted Date", selector: '.posted-date' }
        ]
    }
    */
];

// Modified sendEmail function to just log to console
const sendEmail = async (subject, body) => {
    console.log('--- Simulating Email Send ---');
    console.log('Subject:', subject);
    console.log('Body:\n', body);
    console.log('---------------------------');
};

// checkWebsite function now extracts and returns data including 'others'
const checkWebsite = async (siteConfig) => {
    if (siteConfig.method === 'puppeteer') {
        let browser;
        try {
            browser = await puppeteer.launch({ headless: true });
            const page = await browser.newPage();

            await page.goto(siteConfig.url, { waitUntil: 'networkidle2' });

            const jobItemSelector = siteConfig.itemSelector;

            await page.waitForSelector(jobItemSelector, { timeout: 30000 }); // Increased timeout slightly

            // Extract data from each job item, including 'others'
            const jobData = await page.$$eval(jobItemSelector, (items, config) => {
                const extractText = (element, selector) => {
                    const el = element.querySelector(selector);
                    return el ? el.innerText.trim() : null;
                };

                 const extractLink = (element, selector) => {
                    const el = element.querySelector(selector);
                    // Basic handling for relative URLs - adjust base URL if needed
                    const url = el ? el.href : null;
                    return url && url.startsWith('/') ? `${config.baseUrl}${url}` : url;
                 };

                return items.map(item => {
                    const otherInfo = {};
                    if (config.others) {
                         config.others.forEach(extra => {
                              otherInfo[extra.title] = extractText(item, extra.selector);
                         });
                    }

                    return {
                        title: extractText(item, config.titleSelector),
                        link: extractLink(item, config.linkSelector),
                        others: otherInfo // Include extracted 'others' data as an object
                        // The user asked for others to be an array {title, selector},
                        // but extracting the value makes more sense for the result.
                        // Returning an object { Title1: Value1, Title2: Value2 } seems more practical.
                        // If an array { title: Title, value: Value } is strictly needed, change 'otherInfo = {}' to 'otherInfo = []'
                        // and 'otherInfo[extra.title] = ...' to 'otherInfo.push({ title: extra.title, value: ... })'.
                        // Let's return it as an object for easier consumption.
                    };
                });
            }, { // Pass config parts needed inside page context
                 titleSelector: siteConfig.titleSelector,
                 linkSelector: siteConfig.linkSelector,
                 others: siteConfig.others,
                 baseUrl: siteConfig.url // Pass base URL for link handling
             });

            let status = `Verificação em ${siteConfig.name} (${siteConfig.url}): Encontrados ${jobData.length} itens.`;

            return {
                name: siteConfig.name, // Include site name
                url: siteConfig.url, // Include site URL
                status: status,
                method: siteConfig.method, // Include method used
                items: jobData // Return the extracted job data
            };

        } catch (error) {
            let status = `Erro ao verificar ${siteConfig.name} (${siteConfig.url}): ${error.message}`;
             return {
                name: siteConfig.name,
                url: siteConfig.url,
                status: status,
                method: siteConfig.method,
                items: [] // Return empty array on error
            };
        } finally {
            if (browser) {
                await browser.close();
            }
        }
    }
    /*
    // Add logic here to handle 'axios' method if needed later, mirroring the structure
    if (siteConfig.method === 'axios') {
        // ... axios/cheerio logic ...
         try {
             const response = await axios.get(siteConfig.url);
             const $ = cheerio.load(response.data);
             const foundElements = $(siteConfig.itemSelector); // Use the item selector from config

             const itemsData = foundElements.map((index, element) => {
                 const title = $(element).find(siteConfig.titleSelector).text().trim();
                 const link = $(element).find(siteConfig.linkSelector).attr('href');
                 // Handle relative link if needed

                 const otherInfo = {};
                 if (siteConfig.others) {
                      siteConfig.others.forEach(extra => {
                           const extraElement = $(element).find(extra.selector);
                           otherInfo[extra.title] = extraElement.text().trim(); // Or .attr('attribute')
                      });
                 }

                 return {
                     title,
                     link,
                     others: otherInfo
                 };
             }).get();

             let status = `Verificação em ${siteConfig.name} (${siteConfig.url}): Encontrados ${itemsData.length} itens (via Axios).`;
             return {
                 name: siteConfig.name,
                 url: siteConfig.url,
                 status: status,
                 method: siteConfig.method,
                 items: itemsData
             };
         } catch (error) {
             let status = `Erro ao verificar ${siteConfig.name} (${siteConfig.url}) (via Axios): ${error.message}`;
             return {
                 name: siteConfig.name,
                 url: siteConfig.url,
                 status: status,
                 method: siteConfig.method,
                 items: []
             };
         }
    }
    */
    let status = `Método de verificação desconhecido para ${siteConfig.name}`;
    return {
         name: siteConfig.name,
         url: siteConfig.url,
         status: status,
         method: 'unknown',
         items: []
    };
};


app.get('/check_sites', async (req, res) => {
    let emailBody = "Relatório Diário de Vagas:\n\n";
    const siteCheckResults = [];

    for (const site of sitesToMonitor) {
        const result = await checkWebsite(site);
        emailBody += result.status + "\n";

        siteCheckResults.push(result); // Push the full result object

        // Append item details to email body (optional)
        if (result.items.length > 0) {
             emailBody += "Detalhes dos itens:\n";
             result.items.slice(0, 5).forEach(item => {
                 emailBody += `- ${item.title} (${item.link})\n`;
                 // Add other details if needed
                 if (item.others) {
                     Object.entries(item.others).forEach(([key, value]) => {
                         emailBody += `  ${key}: ${value}\n`;
                     });
                 }
             });
             if (result.items.length > 5) {
                 emailBody += `... e mais ${result.items.length - 5} itens.\n`;
             }
             emailBody += "\n";
        }
    }

    await sendEmail("Relatório Diário de Vagas", emailBody);

    res.json({
        message: "Verificação e notificação concluída.",
        results: siteCheckResults // Return the array with detailed results
    });
});

app.listen(port, () => {
    console.log(`API listening at http://localhost:${port}`);
});