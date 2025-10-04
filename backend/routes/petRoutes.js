import express from 'express';
import {
  createPet,
  getPets,
  getPetById,
  updatePet,
  deletePet,
  addPetReview,
  toggleFavorite,
  getFavorites,
} from '../controllers/petController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getPets)
  .post(protect, authorize('shelter', 'foster'), createPet);

router.get('/favorites', protect, getFavorites);

router.route('/:id')
  .get(getPetById)
  .put(protect, authorize('shelter', 'foster'), updatePet)
  .delete(protect, authorize('shelter'), deletePet);

router.post('/:id/reviews', protect, addPetReview);
router.post('/:id/favorite', protect, toggleFavorite);

export default router;