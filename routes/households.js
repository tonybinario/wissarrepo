const express = require('express');
const router = express.Router();
const householdRepository = require('../models/householdrepo');

// GET /api/rest/households
router.get('/', async (req, res) => {
    try {
        const households = await householdRepository.getAllHouseholds();
        console.log("Daten aus dem Repo:", households);
        res.json(households);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;