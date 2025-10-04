import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  pet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet',
    required: true,
  },
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  shelter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'reviewing', 'approved', 'rejected', 'withdrawn'],
    default: 'pending',
  },
  applicationData: {
    housingType: {
      type: String,
      enum: ['house', 'apartment', 'condo', 'other'],
    },
    ownRent: {
      type: String,
      enum: ['own', 'rent'],
    },
    hasYard: Boolean,
    landlordApproval: Boolean,
    householdMembers: Number,
    hasChildren: Boolean,
    childrenAges: [Number],
    hasPets: Boolean,
    currentPets: [{
      species: String,
      breed: String,
      age: Number,
    }],
    experience: String,
    reason: String,
    veterinarian: {
      name: String,
      phone: String,
    },
    references: [{
      name: String,
      relationship: String,
      phone: String,
      email: String,
    }],
  },
  notes: [{
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    content: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  meetGreet: {
    scheduled: Boolean,
    date: Date,
    location: String,
    notes: String,
  },
  additionalInfo: String,
}, {
  timestamps: true,
});

applicationSchema.index({ applicant: 1, status: 1 });
applicationSchema.index({ shelter: 1, status: 1 });
applicationSchema.index({ pet: 1 });

export default mongoose.model('Application', applicationSchema);