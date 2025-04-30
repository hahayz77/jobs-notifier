const puppeteer = require('puppeteer');

const scrapeWithPuppeteer = async (siteConfig) => {
    let browser;
    try {
        browser = await puppeteer.launch({ headless: true }); // Use headless: false to debug
        const page = await browser.newPage();

        await page.goto(siteConfig.url, { waitUntil: 'networkidle2' });

        const jobItemSelector = siteConfig.itemSelector;

        await page.waitForSelector(jobItemSelector, { timeout: 30000 });

        const jobData = await page.$$eval(jobItemSelector, (items, config) => {
            const extractText = (element, selector) => {
                const el = element.querySelector(selector);
                return el ? el.innerText.trim() : null;
            };

            const extractLink = (element, selector) => {
                const el = element.querySelector(selector);
                const url = el ? el.href : null;
                // Basic handling for relative URLs - adjust base URL if needed
                return url && url.startsWith('/') ? `${config.baseUrl}${url}` : url;
            };

             // Function to extract data from 'others' selectors
            const extractOthers = (itemElement, othersConfig) => {
                 const otherInfo = {};
                 if (othersConfig) {
                      othersConfig.forEach(extra => {
                           otherInfo[extra.title] = extractText(itemElement, extra.selector);
                      });
                 }
                 return otherInfo;
            };


            return items.map(item => {
                return {
                    title: extractText(item, config.titleSelector),
                    link: extractLink(item, config.linkSelector),
                    others: extractOthers(item, config.others) // Extract and include 'others'
                };
            });
        }, { // Pass necessary config to the page context
             titleSelector: siteConfig.titleSelector,
             linkSelector: siteConfig.linkSelector,
             others: siteConfig.others,
             baseUrl: new URL(siteConfig.url).origin // Use URL origin for base URL
        });

        return {
            name: siteConfig.name,
            url: siteConfig.url,
            status: `Verificação em ${siteConfig.name}: Encontrados ${jobData.length} itens.`,
            method: 'puppeteer',
            items: jobData
        };

    } catch (error) {
        return {
            name: siteConfig.name,
            url: siteConfig.url,
            status: `Erro ao verificar ${siteConfig.name}: ${error.message}`,
            method: 'puppeteer',
            items: []
        };
    } finally {
        if (browser) {
            await browser.close();
        }
    }
};

module.exports = scrapeWithPuppeteer;