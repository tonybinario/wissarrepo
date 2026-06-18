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

/* 2. POST: Neuen User anlegen */
router.post('/', async (req, res) => { // Hier stand vorher 'post', jetzt 'router.post'
    try {
        const {email} = req.body;
        if (!email) {
            return res.status(400).json({error: 'E-Mail ist erforderlich'});
        }

        // Ruft deine DB-Klasse auf
        const newUser = await userRepository.createUser(email);
        res.status(201).json(newUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Fehler beim Anlegen des Users'});
    }
});

// WICHTIG: module.exports IMMER ganz ans Ende der Datei
module.exports = router;