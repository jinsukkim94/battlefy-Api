// Express
const express = require("express");

// Express App Setup
const PORT = 3000;
const app = express();

// Apply Route
const route = require("./routes/route");
app.use(route);

// Start
app.listen(PORT, () => {
    console.log(`App Listening at http://localhost:${PORT}`);
});
