import express from 'express';
import authMiddleware from '../Middleware/authMiddleware.js';
import { registerUser, loginUser, logoutUser, updateUser, getUserDetails } from '../Controllers/userController.js';

const userRouter = express.Router();
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/getUserDetails/:id', authMiddleware, getUserDetails);
userRouter.post('/logout', authMiddleware, logoutUser);
userRouter.put('/updateRegister/:id', authMiddleware, updateUser);


export default userRouter;