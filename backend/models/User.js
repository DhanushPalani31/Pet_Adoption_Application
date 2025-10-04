import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['adopter', 'shelter', 'foster'],
    default: 'adopter',
  },
  phone: {
    type: String,
    trim: true,
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
  },
  shelterInfo: {
    name: String,
    description: String,
    website: String,
    licenseNumber: String,
  },
  favoritePets: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet',
  }],
  notifications: {
    email: {
      newListings: { type: Boolean, default: true },
      applicationUpdates: { type: Boolean, default: true },
      messages: { type: Boolean, default: true },
    },
  },
}, {
  timestamps: true,
});

// fix: return after next() to avoid rehashing
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);
