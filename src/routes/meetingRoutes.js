const express = require('express');
const { getMeetings, createMeeting, updateMeeting, deleteMeeting, cancelMeeting } = require('../controllers/meetingController');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

router.get('/', authenticate, getMeetings);
router.post('/', authenticate, createMeeting);
router.put('/:id', authenticate, updateMeeting);
router.delete('/:id', authenticate, deleteMeeting);
router.post('/:id/cancel', authenticate, cancelMeeting);

module.exports = router;
