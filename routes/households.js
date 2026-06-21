const express = require('express');
const router = express.Router();
const householdRepository = require('../models/householdrepo');

// GET /api/households
router.get('/', async (req, res) => {
    try {
        const households = await householdRepository.getAllHouseholds();
        console.log("Daten aus dem Repo:", households);
        res.json(households);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/households/:id
router.get('/:id', async (req, res) => {
    try {
        const household = await householdRepository.getHouseholdById(req.params.id);
        if (!household) return res.status(404).json({ error: "Haushalt nicht gefunden" });
        res.json(household);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;