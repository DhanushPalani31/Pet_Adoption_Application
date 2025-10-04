import Application from '../models/Application.js';
import Pet from '../models/Pet.js';
import User from '../models/User.js';
import { sendEmail } from '../config/email.js';

export const createApplication = async (req, res) => {
  try {
    const pet = await Pet.findById(req.body.petId).populate('shelter');

    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    if (pet.status !== 'available') {
      return res.status(400).json({ message: 'Pet is not available for adoption' });
    }

    const existingApplication = await Application.findOne({
      pet: req.body.petId,
      applicant: req.user._id,
      status: { $in: ['pending', 'reviewing', 'approved'] },
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You already have an active application for this pet' });
    }

    const application = await Application.create({
      pet: req.body.petId,
      applicant: req.user._id,
      shelter: pet.shelter._id,
      applicationData: req.body.applicationData,
      additionalInfo: req.body.additionalInfo,
    });

    await sendEmail(
      pet.shelter.email,
      'New Adoption Application',
      `<h2>New adoption application for ${pet.name}</h2><p>Please review the application in your dashboard.</p>`
    );

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getApplications = async (req, res) => {
  try {
    const { status, role } = req.query;
    let query = {};

    if (req.user.role === 'shelter') {
      query.shelter = req.user._id;
    } else {
      query.applicant = req.user._id;
    }

    if (status) {
      query.status = status;
    }

    const applications = await Application.find(query)
      .populate('pet')
      .populate('applicant', 'name email phone')
      .populate('shelter', 'name email phone shelterInfo')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('pet')
      .populate('applicant', 'name email phone address')
      .populate('shelter', 'name email phone shelterInfo')
      .populate('notes.author', 'name');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (
      application.applicant._id.toString() !== req.user._id.toString() &&
      application.shelter._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('pet')
      .populate('applicant');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.shelter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    application.status = req.body.status;
    await application.save();

    if (req.body.status === 'approved') {
      const pet = await Pet.findById(application.pet._id);
      pet.status = 'pending';
      await pet.save();
    }

    const statusMessages = {
      approved: 'Your adoption application has been approved!',
      rejected: 'Your adoption application status has been updated.',
      reviewing: 'Your adoption application is under review.',
    };

    await sendEmail(
      application.applicant.email,
      'Application Status Update',
      `<h2>Application Status Update</h2><p>${statusMessages[req.body.status]}</p>`
    );

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addApplicationNote = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.shelter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    application.notes.push({
      author: req.user._id,
      content: req.body.content,
    });

    await application.save();
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const scheduleMeetGreet = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('applicant')
      .populate('pet');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.shelter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    application.meetGreet = {
      scheduled: true,
      date: req.body.date,
      location: req.body.location,
      notes: req.body.notes,
    };

    await application.save();

    await sendEmail(
      application.applicant.email,
      'Meet & Greet Scheduled',
      `<h2>Meet & Greet Scheduled for ${application.pet.name}</h2><p>Date: ${new Date(req.body.date).toLocaleDateString()}</p><p>Location: ${req.body.location}</p>`
    );

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};