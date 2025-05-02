import mongoose from 'mongoose';
const { Schema } = mongoose;

const messageSchema = new Schema({
  sender: { type: String, enum: ['user', 'bot'], required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const ticketSchema = new Schema({
  raisedBy: { type: Schema.Types.ObjectId, ref: 'BotUser', required: true },
  assignedTo: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['open', 'in-progress', 'resolved', 'closed'], default: 'open' },
  messages: [messageSchema]
}, { timestamps: true });

export default mongoose.model('Ticket', ticketSchema);