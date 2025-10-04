import express from 'express';
import { createReview, getShelterReviews, deleteReview } from '../controllers/reviewController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createReview);
router.get('/shelter/:shelterId', getShelterReviews);
router.delete('/:id', protect, deleteReview);

export default router;