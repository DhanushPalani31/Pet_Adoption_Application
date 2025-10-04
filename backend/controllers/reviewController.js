import Review from '../models/Review.js';

export const createReview = async (req, res) => {
  try {
    const { shelterId, rating, comment, categories, petId } = req.body;

    const existingReview = await Review.findOne({
      reviewer: req.user._id,
      shelter: shelterId,
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this shelter' });
    }

    const review = await Review.create({
      shelter: shelterId,
      reviewer: req.user._id,
      pet: petId,
      rating,
      comment,
      categories,
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getShelterReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ shelter: req.params.shelterId })
      .populate('reviewer', 'name')
      .populate('pet', 'name')
      .sort({ createdAt: -1 });

    const avgRating = reviews.length > 0
      ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
      : 0;

    res.json({
      reviews,
      avgRating: avgRating.toFixed(1),
      total: reviews.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.reviewer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await review.deleteOne();
    res.json({ message: 'Review removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};