const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const nodemailer = require('nodemailer');

const app = express();
const port = 3000;

// Email Configuration (replace with your information)
const emailConfig = {
    service: 'gmail', // Or your SMTP service
    auth: {
        user: 'seu_email@example.com', // Replace
        pass: 'sua_senha_do_email' // Replace (use environment variables or secure methods in production)
    }
};

const transporter = nodemailer.createTransport(emailConfig);

// List of websites to monitor
const sitesToMonitor = [
    { name: 'Site de Vagas Exemplo 1', url: 'https://www.siteexemplo1.ca/vagas', selector: 'div.job-listing' }, // Replace with actual URLs and selectors
    { name: 'Site de Vagas Exemplo 2', url: 'https://www.siteexemplo2.ca/empregos', selector: 'ul li.job-item' }, // Replace with actual URLs and selectors
];

const sendEmail = async (subject, body) => {
    const mailOptions = {
        from: emailConfig.auth.user,
        to: emailConfig.auth.user, // Sending to yourself
        subject: subject,
        text: body
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully!');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

const checkWebsite = async (siteConfig) => {
    try {
        const response = await axios.get(siteConfig.url);
        const $ = cheerio.load(response.data);

        // Basic example: count elements matching the selector
        const foundItems = $(siteConfig.selector);
        return `Verificação em ${siteConfig.name} (${siteConfig.url}): Encontrados ${foundItems.length} itens.`;
    } catch (error) {
        return `Erro ao verificar ${siteConfig.name} (${siteConfig.url}): ${error.message}`;
    }
};

app.get('/check_sites', async (req, res) => {
    let emailBody = "Relatório Diário de Vagas:\n\n";

    for (const site of sitesToMonitor) {
        const status = await checkWebsite(site);
        emailBody += status + "\n";
    }

    await sendEmail("Relatório Diário de Vagas", emailBody);

    res.json({ message: "Verificação e notificação iniciadas." });
});

app.listen(port, () => {
    console.log(`API listening at http://localhost:${port}`);
});
