import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  teamId: { type: Schema.Types.ObjectId, ref: 'Team', default: null },
  role: { type: String, enum: ['captain-admin', 'admin', 'member', null], default: null }
}, { timestamps: true });

const Users = mongoose.model('User', userSchema);
export default Users;