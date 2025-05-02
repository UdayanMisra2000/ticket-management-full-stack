import express from 'express';
import authMiddleware from '../Middleware/authMiddleware.js';
import authorize from '../Middleware/authorize.js';
import { addMember, removeMember, updateMemberRole, getMemberDetails, getTeamMembers } from '../Controllers/teamController.js';

const teamRouter = express.Router();

teamRouter.get('/getTeamMembers/:teamId', authMiddleware, getTeamMembers);
teamRouter.get('/getMemberDetails/:userId', authMiddleware, getMemberDetails);
teamRouter.post('/addMember', authMiddleware, authorize('captain-admin', 'admin'), addMember);
teamRouter.delete('/removeMember/:teamId', authMiddleware, authorize('captain-admin', 'admin'), removeMember);
teamRouter.put('/updateMemberRole/:teamId', authMiddleware, authorize('captain-admin', 'admin'), updateMemberRole);

export default teamRouter;