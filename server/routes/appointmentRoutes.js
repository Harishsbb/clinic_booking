const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

router.post('/', appointmentController.createAppointment);
router.get('/', appointmentController.getAppointments);
router.put('/:id/status', appointmentController.updateStatus);
router.delete('/:id', appointmentController.deleteAppointment);
router.put('/:id', appointmentController.updateAppointment);

module.exports = router;
