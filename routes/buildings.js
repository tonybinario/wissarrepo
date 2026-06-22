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

router.get('/hierarchy', async (req, res) => {
    try {
        // Rufe deine vorbereitete Repository-Methode auf
        const data = await buildingRepository.getDeepNestedBuildings();

        // Schicke die tief verschachtelten JSON-Daten an den Client zurück
        res.json(data);
    } catch (error) {
        console.error("Fehler in GET /api/buildings/hierarchy:", error);
        res.status(500).json({ error: 'Serverfehler beim Laden der Gebäude-Hierarchie' });
    }
});

module.exports = router;
