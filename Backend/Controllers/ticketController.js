import Ticket from '../Models/Tickets.js';
import BotUser from '../Models/BotUser.js';
import User from '../Models/User.js';

// Function to check if BotUser exists or create a new one
export const checkOrCreateBotUser = async (req, res) => {
  const { name, email, phone } = req.body;
  try {
    let existingUser = await BotUser.findOne({ email });
    if (!existingUser) {
      // Create a new user if not found
      existingUser = await BotUser.create({ name, email, phone });
      return res.status(201).json({ message: 'New user created', user: existingUser });
    } else {
      // Fetch previous tickets and their messages for the existing user
      const previousTickets = await Ticket.find({ raisedBy: existingUser._id }).populate('messages');
      return res.status(200).json({ 
        message: 'Existing user found', 
        user: existingUser,
        previousChats: previousTickets 
      });
    }
  } catch (error) {
    console.error('Error in checkOrCreateBotUser:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Function to get a bot user by ID
export const getBotUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await BotUser.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error('Error in getBotUser:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Function to create a ticket
export const createTicket = async (req, res) => {
  const { userId, query } = req.body; 
  try {
    // Check if the user already has an open ticket
    const existingTicket = await Ticket.findOne({ raisedBy: userId, status: 'open' });
    if (existingTicket) {
      return res.status(200).json({ 
        message: 'User already has an open ticket', 
        ticket: existingTicket 
      });
    }

    // Assign the ticket to the captain-admin
    const captain = await User.findOne({ role: 'captain-admin' });
    if (!captain) {
      return res.status(500).json({ message: 'No captain-admin found to assign the ticket' });
    }

    // Create a new ticket and assign it to the captain-admin
    const newTicket = await Ticket.create({
      raisedBy: userId,
      assignedTo: captain._id,
      messages: [{ sender: 'user', text: query }]
    });

    res.status(201).json({ ticket: newTicket });
  } catch (error) {
    console.error('Error in createTicket:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createOrGetTicket = async (req, res) => {
  const { email, query } = req.body;
  try {
    // Find the user by email
    const user = await BotUser.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the user already has an open ticket
    let ticket = await Ticket.findOne({ raisedBy: user._id, status: 'open' }).populate('messages');
    if (ticket) {
      return res.status(200).json({ message: 'Existing ticket found', ticket });
    }

    // Assign the ticket to the captain-admin
    const captain = await User.findOne({ role: 'captain-admin' });
    if (!captain) {
      return res.status(500).json({ message: 'No captain-admin found to assign the ticket' });
    }

    // Create a new ticket
    ticket = await Ticket.create({
      raisedBy: user._id,
      assignedTo: captain._id,
      messages: [{ sender: 'user', text: query }]
    });

    res.status(201).json({ message: 'New ticket created', ticket });
  } catch (error) {
    console.error('Error in createOrGetTicket:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const assignTicket = async (req, res) => {
  const { assignedId } = req.body;
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    ticket.assignedTo = assignedId;
    await ticket.save();

    res.json({ ticket });
  } catch (err) {
    console.error('Error in assignTicket:', err);
    res.status(500).json({ message: 'Failed to assign ticket and save reply' });
  }
};

export const getTicket = async (req, res) => {
  const { userid, id } = req.params;
  try {
    const ticket = await Ticket.findById(id).populate('messages');
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    if (ticket.assignedTo.toString() !== userid) return res.status(403).json({ message: 'Unauthorized access' });
    res.json(ticket);
  } catch (err) {
    console.error('Error in getTicket:', err);
    res.status(500).json({ message: 'Failed to fetch ticket' });
  }
}

export const listTickets = async (req, res) => {
  const {userid} = req.params;
  try {
    const tickets = await Ticket.find({ assignedTo: userid }).populate('messages');
    res.json(tickets);
  } catch (err) {
    console.error('Error in listTickets:', err);
    res.status(500).json({ message: 'Failed to fetch tickets' });
  }
};

// GET tickets according to the status
export const getTicketsByStatus = async (req, res) => {
  const { status } = req.params;
  try {
    const tickets = await Ticket.find({ status }).populate('messages');
    res.json(tickets);
  } catch (err) {
    console.error('Error in getTicketsByStatus:', err);
    res.status(500).json({ message: 'Failed to fetch tickets' });
  }
};

// GET all messages for a ticket
export const getMessages = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    res.json(ticket.messages);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching messages' });
  }
};

// POST a new message (user or bot)
export const addMessage = async (req, res) => {
  const { sender, text } = req.body;
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    ticket.messages.push({ sender, text });
    await ticket.save();

    res.json(ticket.messages);
  } catch (err) {
    console.error('Error in addMessage:', err);
    res.status(500).json({ message: 'Error adding message' });
  }
};

// update ticket status
export const updateTicketStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    ticket.status = status;
    await ticket.save();

    res.json(ticket);
  } catch (err) {
    console.error('Error in updateTicketStatus:', err);
    res.status(500).json({ message: 'Error updating ticket status' });
  }
};

