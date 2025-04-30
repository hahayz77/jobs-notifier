const sitesToMonitor = [
    {
        name: 'Vanhack',
        url: 'https://vanhack.com/jobs/in-canada',
        itemSelector: '.job-card', // Selector for individual job items
        titleSelector: 'a div h2', // Selector for the job title inside a job-card
        linkSelector: 'a', // Selector for the job link inside a job-card
        method: 'puppeteer', // Indicate the scraping method
        others: [ // Array for extra information per item
            { title: "Company", selector: '.job-company-selector' }, // <-- REPLACE selector
            { title: "Location", selector: '.job-location-selector' } // <-- REPLACE selector
        ]
    },
    // Add other sites here
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

module.exports = sitesToMonitor;