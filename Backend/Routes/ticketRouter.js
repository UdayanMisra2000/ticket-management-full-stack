import express from 'express';
import authMiddleware from '../Middleware/authMiddleware.js';
import authorize from '../Middleware/authorize.js';
import {
  createTicket,
  getMessages,
  addMessage,
  assignTicket,
  getTicket,
  listTickets,
  checkOrCreateBotUser,
  getBotUser,
  createOrGetTicket,
  updateTicketStatus,
  getTicketsByStatus,
} from '../Controllers/ticketController.js';

const router = express.Router();

router.post('/check-user', checkOrCreateBotUser); 
router.post('/create', createTicket);
router.post('/create-or-get', createOrGetTicket);
router.get('/botuser/:id', authMiddleware, getBotUser);
router.get('/:id/messages', getMessages);
router.post('/:id/messages', addMessage);
router.get('/:userid', authMiddleware, listTickets);
router.get('/:userid/:id', authMiddleware, getTicket);
router.patch('/:id/assign', authMiddleware, authorize('captain-admin','admin'), assignTicket);
router.patch('/:id/status', authMiddleware, updateTicketStatus);
router.get('/:userid/status/:status', authMiddleware, getTicketsByStatus);


export default router;