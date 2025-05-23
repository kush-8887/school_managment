const express = require('express');
const router = express.Router();
const { addSchool, listSchools } = require('../controllers/schoolController');

// POST: Add a new school
router.post('/addSchool', addSchool);

// GET: List schools sorted by proximity
router.get('/listSchools', listSchools);

module.exports = router;
