const express = require('express');
const { updateLocation, getLocation } = require('../controllers/locationController');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

router.get('/:id', authenticate, getLocation);
router.post('/', authenticate, updateLocation);

module.exports = router;
