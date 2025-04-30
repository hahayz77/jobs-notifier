const express = require('express');
const sitesToMonitor = require('./config/sites');
const scraperService = require('./scrapers'); // Import the scraper service
const emailService = require('./services/emailService'); // Import email service

const app = express();

// Define the route to check sites
app.get('/check_sites', async (req, res) => {
    let emailBody = "Relatório Diário de Vagas:\n\n";
    const siteCheckResults = [];

    for (const site of sitesToMonitor) {
        // Use the scraper service to check the site
        const result = await scraperService.checkSite(site);
        emailBody += result.status + "\n";

        siteCheckResults.push(result);

        // Append item details to email body (optional)
        if (result.items.length > 0) {
             emailBody += "Detalhes dos itens:\n";
             result.items.slice(0, 5).forEach(item => { // Limit details in email body for brevity
                 emailBody += `- ${item.title} (${item.link})\n`;
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

    // Use the email service to send the email (simulated)
    await emailService.sendDailyReportEmail("Relatório Diário de Vagas", emailBody);

    res.json({
        message: "Verificação e notificação concluída.",
        results: siteCheckResults
    });
});

module.exports = app;