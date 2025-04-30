const app = require('../src/app');
const port = process.env.PORT || 3000; // Use port from env or default

app.listen(port, () => {
    console.log(`API listening at http://localhost:${port}`);
});