// Express
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Express App Setup
const PORT = process.env.PORT || 3000;
const app = express();

// Apply Route
const route = require("./routes/route");
app.use(cors());
app.use(route);

// Start
app.listen(PORT, () => {
    console.log(`App Listening at ${PORT}`);
});
