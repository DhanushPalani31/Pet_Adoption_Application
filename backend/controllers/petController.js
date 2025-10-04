import Pet from '../models/Pet.js';
import { sendEmail } from '../config/email.js';
import User from '../models/User.js';

export const createPet = async (req, res) => {
  try {
    const petData = {
      ...req.body,
      shelter: req.user._id,
      photos: req.body.photos || [],
      videos: req.body.videos || [],
    };

    const pet = await Pet.create(petData);

    const adopters = await User.find({
      role: 'adopter',
      'notifications.email.newListings': true,
    });

    for (const adopter of adopters) {
      await sendEmail(
        adopter.email,
        'New Pet Available for Adoption',
        `<h2>${pet.name} is now available!</h2><p>Check out this adorable ${pet.breed}.</p>`
      );
    }

    res.status(201).json(pet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPets = async (req, res) => {
  try {
    const { species, breed, size, age, status, city, state, page = 1, limit = 12 } = req.query;

    const query = {};

    if (species) query.species = species;
    if (breed) query.breed = new RegExp(breed, 'i');
    if (size) query.size = size;
    if (status) query.status = status;
    if (city) query['location.city'] = new RegExp(city, 'i');
    if (state) query['location.state'] = state;

    if (age) {
      const ageNum = parseInt(age);
      query['age.value'] = { $lte: ageNum };
    }

    const pets = await Pet.find(query)
      .populate('shelter', 'name email phone shelterInfo')
      .populate('fosteredBy', 'name email phone')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Pet.countDocuments(query);

    res.json({
      pets,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPetById = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id)
      .populate('shelter', 'name email phone shelterInfo address')
      .populate('fosteredBy', 'name email phone')
      .populate('reviews.user', 'name');

    if (pet) {
      res.json(pet);
    } else {
      res.status(404).json({ message: 'Pet not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (pet) {
      if (pet.shelter.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to update this pet' });
      }

      Object.assign(pet, req.body);
      const updatedPet = await pet.save();
      res.json(updatedPet);
    } else {
      res.status(404).json({ message: 'Pet not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (pet) {
      if (pet.shelter.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to delete this pet' });
      }

      await pet.deleteOne();
      res.json({ message: 'Pet removed' });
    } else {
      res.status(404).json({ message: 'Pet not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addPetReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const pet = await Pet.findById(req.params.id);

    if (pet) {
      const alreadyReviewed = pet.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        return res.status(400).json({ message: 'Pet already reviewed' });
      }

      const review = {
        user: req.user._id,
        rating: Number(rating),
        comment,
      };

      pet.reviews.push(review);
      await pet.save();

      res.status(201).json({ message: 'Review added' });
    } else {
      res.status(404).json({ message: 'Pet not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const petId = req.params.id;

    const index = user.favoritePets.indexOf(petId);

    if (index > -1) {
      user.favoritePets.splice(index, 1);
    } else {
      user.favoritePets.push(petId);
    }

    await user.save();
    res.json({ favoritePets: user.favoritePets });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'favoritePets',
      populate: { path: 'shelter', select: 'name shelterInfo' },
    });

    res.json(user.favoritePets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};