import express from 'express';
import {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplicationStatus,
  addApplicationNote,
  scheduleMeetGreet,
} from '../controllers/applicationController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(protect, getApplications)
  .post(protect, authorize('adopter', 'foster'), createApplication);

router.get('/:id', protect, getApplicationById);
router.put('/:id/status', protect, authorize('shelter'), updateApplicationStatus);
router.post('/:id/notes', protect, authorize('shelter'), addApplicationNote);
router.post('/:id/meet-greet', protect, authorize('shelter'), scheduleMeetGreet);

export default router;