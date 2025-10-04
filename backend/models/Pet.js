import mongoose from 'mongoose';

const petSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  species: {
    type: String,
    required: true,
    enum: ['dog', 'cat', 'bird', 'rabbit', 'other'],
  },
  breed: {
    type: String,
    required: true,
    trim: true,
  },
  age: {
    value: Number,
    unit: {
      type: String,
      enum: ['months', 'years'],
    },
  },
  size: {
    type: String,
    enum: ['small', 'medium', 'large', 'extra-large'],
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
  },
  color: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  medicalHistory: {
    vaccinated: { type: Boolean, default: false },
    spayedNeutered: { type: Boolean, default: false },
    specialNeeds: String,
    medications: String,
  },
  behavior: {
    goodWithKids: { type: Boolean, default: false },
    goodWithPets: { type: Boolean, default: false },
    energyLevel: {
      type: String,
      enum: ['low', 'medium', 'high'],
    },
    trained: { type: Boolean, default: false },
  },
  photos: [{
    url: String,
    caption: String,
  }],
  videos: [{
    url: String,
    caption: String,
  }],
  status: {
    type: String,
    enum: ['available', 'pending', 'adopted', 'fostered'],
    default: 'available',
  },
  shelter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  location: {
    city: String,
    state: String,
    zipCode: String,
  },
  adoptionFee: {
    type: Number,
    default: 0,
  },
  fosteredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    rating: Number,
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
}, {
  timestamps: true,
});

petSchema.index({ species: 1, breed: 1, status: 1 });
petSchema.index({ 'location.city': 1, 'location.state': 1 });

export default mongoose.model('Pet', petSchema);