import express from 'express';
const app = express();
import 'dotenv/config';
import mongoose from 'mongoose';
import cors from 'cors';
import userRouter from './Routes/UserRouter.js';
import teamRouter from './Routes/teamRouter.js';
import ticketRouter from './Routes/ticketRouter.js';
import chatBotRouter from './Routes/chatBotRouter.js';

app.use(express.json());
app.use(cors({
    origin: ['https://ticket-management-fullstack.netlify.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
}));
app.use('/users', userRouter);
app.use('/team', teamRouter);
app.use('/tickets', ticketRouter);
app.use('/chatbot', chatBotRouter);

if(!process.env.MONGO_URI) {
  console.error('MONGO_URI is not defined in .env file');
  process.exit(1);
}

const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI).then(() => {
  console.log('MongoDB connected successfully');
}) .catch((err) => {
  console.error('MongoDB connection error:', err.message);
  process.exit(1);
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});