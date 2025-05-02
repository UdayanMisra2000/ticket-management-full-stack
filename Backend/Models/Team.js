import mongoose from 'mongoose';
const { Schema } = mongoose;

const teamSchema = new Schema({
  name: { type: String, required: true },
  captainId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  members: [
    { 
      userId: { type: Schema.Types.ObjectId, ref: 'User' }, 
      name: { type: String, required: true },
      role: { type: String, enum: ['captain-admin','admin', 'member'] } 
    }
  ],
  password: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('Team', teamSchema);