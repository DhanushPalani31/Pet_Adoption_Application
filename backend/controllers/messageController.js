import { Message, Conversation } from '../models/Message.js';
import { sendEmail } from '../config/email.js';

export const createConversation = async (req, res) => {
  try {
    const { participantId, petId, applicationId } = req.body;

    // build query dynamically (avoid pet: undefined)
    const query = { participants: { $all: [req.user._id, participantId] } };
    if (petId) query.pet = petId;

    let conversation = await Conversation.findOne(query);

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [req.user._id, participantId],
        pet: petId,
        application: applicationId,
      });
    }

    res.status(201).json(conversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id,
    })
      .populate('participants', 'name email role')
      .populate('pet', 'name photos')
      .populate('lastMessage')
      .sort({ updatedAt: -1 });

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.conversationId);
    if (!conversation) return res.status(404).json({ message: 'Conversation not found' });

    if (!conversation.participants.some(p => p.equals(req.user._id))) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const messages = await Message.find({ conversation: req.params.conversationId })
      .populate('sender', 'name email')
      .sort({ createdAt: 1 });

    await Message.updateMany(
      { conversation: req.params.conversationId, sender: { $ne: req.user._id }, read: false },
      { read: true, readAt: new Date() }
    );

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.conversationId)
      .populate('participants', 'name email notifications');

    if (!conversation) return res.status(404).json({ message: 'Conversation not found' });

    if (!conversation.participants.some(p => p._id.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const message = await Message.create({
      conversation: req.params.conversationId,
      sender: req.user._id,
      content: req.body.content,
    });

    conversation.lastMessage = message._id;
    await conversation.save();

    const recipient = conversation.participants.find(
      p => p._id.toString() !== req.user._id.toString()
    );

    if (recipient?.notifications?.email?.messages) {
      await sendEmail(
        recipient.email,
        'New Message',
        `<h2>You have a new message</h2><p>${req.body.content}</p>`
      );
    }

    const populatedMessage = await Message.findById(message._id).populate('sender', 'name email');

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
