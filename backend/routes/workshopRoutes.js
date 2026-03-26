const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const requireRole = require('../middlewares/roleMiddleware');
const workshopController = require('../controllers/workshopController');

// Public routes
router.get('/', workshopController.getAllWorkshops);
router.get('/stats', workshopController.getStats);
router.get('/:id', workshopController.getWorkshopById);

// Protected routes (Organizers only)
router.post('/', auth, requireRole('organizer'), workshopController.createWorkshop);
router.put('/:id', auth, requireRole('organizer'), workshopController.updateWorkshop);
router.delete('/:id', auth, requireRole('organizer'), workshopController.deleteWorkshop);
router.get('/:id/registrants', auth, requireRole('organizer'), workshopController.getWorkshopRegistrants);
router.get('/me/organized', auth, requireRole('organizer'), workshopController.getMyOrganizedWorkshops);

// Protected routes (Admin only)
router.get('/admin/pending', auth, requireRole('admin'), workshopController.getPendingWorkshops);
router.patch('/admin/:id/status', auth, requireRole('admin'), workshopController.updateWorkshopStatus);

module.exports = router;
