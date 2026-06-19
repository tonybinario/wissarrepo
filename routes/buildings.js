const express = require('express');
const router = express.Router();
const buildingRepository = require('../models/buildingrepo');

// GET /api/rest/buildings
router.get('/', async (req, res) => {
    try {
        const buildings = await buildingRepository.getAllBuildings();
        res.json(buildings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;