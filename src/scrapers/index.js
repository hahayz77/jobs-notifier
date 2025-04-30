const scrapeWithPuppeteer = require('./puppeteerScraper');
// const scrapeWithAxiosCheerio = require('./axiosCheerioScraper'); // Import if you add axios scraper

const checkSite = async (siteConfig) => {
    if (siteConfig.method === 'puppeteer') {
        return scrapeWithPuppeteer(siteConfig);
    }
    /*
    if (siteConfig.method === 'axios') {
        // return scrapeWithAxiosCheerio(siteConfig); // Call axios scraper
    }
    */
    // Default return for unknown method
    return {
         name: siteConfig.name,
         url: siteConfig.url,
         status: `Método de verificação desconhecido para ${siteConfig.name}`,
         method: 'unknown',
         items: []
    };
};

module.exports = {
    checkSite
};