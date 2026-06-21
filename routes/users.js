const express = require('express');
const router = express.Router();
const userRepository = require('../models/userrepo'); // Pfad zu deiner DB-Klasse anpassen!

/* 1. GET: Alle User abfragen */
router.get('/', async function (req, res, next) {
    try {
        const users = await userRepository.getAllUsers();
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Fehler beim Laden der User'});
    }
});

// GET /api/users/:id (z.B. /api/users/42)
router.get('/:id', async (req, res) => {
    try {
        const user = await userRepository.getUserById(req.params.id);
        if (!user) return res.status(404).json({ error: "User nicht gefunden" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


/* 2. POST: Neuen User anlegen */
router.post('/', async (req, res) => { // Hier stand vorher 'post', jetzt 'router.post'
    try {
        console.log('1. Daten in der Route angekommen:', req.body); // <-- HIER
        // Ruft deine DB-Klasse auf
        const newUser = await userRepository.createUser(req.body);
        res.status(201).json(newUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Fehler beim Anlegen des Users'});
    }
});

// WICHTIG: module.exports IMMER ganz ans Ende der Datei
module.exports = router;