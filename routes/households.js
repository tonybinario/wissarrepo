const express = require('express');
const router = express.Router();
const householdRepository = require('../models/householdrepo');

// GET /api/households
// GET /api/households
router.get('/', async (req, res) => {
    try {
        const includeUser = req.query.include === 'user';
        const households = await householdRepository.getAllHouseholds(includeUser);
        res.json(households);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.get('/flat', async (req, res) => {
    try {
        const households = await householdRepository.getAllHouseholdsFlat();
        res.json(households);
    } catch (err) {
        res.status(500).send(err.message);
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