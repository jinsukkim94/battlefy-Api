// Main Controller for Handling Logic
const mainController = require("../controllers/statsController");

// Router to register route
const router = require("express").Router();

router.get("/:name", async (req, res) => {
    try {
        // Grab Summoner info by req.params.name
        const summoner = await mainController(req.params.name);

        // Send Results
        res.status(200).send(summoner);
    } catch (e) {
        // Handle Error
        res.status(400).send({ error: e.message });
    }
});

module.exports = router;