const express = require('express');
const router = express.Router();
const buildingRepository = require('../models/buildingrepo');

// GET /api/buildings
router.get('/', async (req, res) => {
    try {
        const buildings = await buildingRepository.getAllBuildings();
        res.json(buildings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/buildings/:id
router.get('/:id', async (req, res) => {
    try {
        const building = await buildingRepository.getBuildingById(req.params.id);
        if (!building) return res.status(404).json({ error: "Gebäude nicht gefunden" });
        res.json(building);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;