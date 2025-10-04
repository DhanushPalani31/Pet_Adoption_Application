import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  shelter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  pet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet',
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
  },
  categories: {
    communication: Number,
    process: Number,
    support: Number,
  },
}, {
  timestamps: true,
});

reviewSchema.index({ shelter: 1 });
reviewSchema.index({ reviewer: 1, shelter: 1 }, { unique: true });

export default mongoose.model('Review', reviewSchema);