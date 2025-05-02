import Team from '../Models/Team.js';
import User from '../Models/User.js';
import bcrypt from 'bcrypt';

export const addMember = async (req, res) => {
    const { username, email, role } = req.body;
    if (!username || !email) {
        return res.status(400).json({ message: 'Please provide username and email' });
    }
    const teamId = req.user.teamId;
    const rawPassword = req.user.password;
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    try {
        // Check if the user exists. If not, create a new user
        let user = await User.findOne({ username });
        if (!user) {
            user = await User.create({
                email,
                username,
                password: hashedPassword,
                role: role || 'member',
                teamId,
            });
        }
        // If the user exists, update their teamId and role
        else {
            user.teamId = teamId;
            user.role = role || 'member';
        }

        await user.save();

        // Check if the user is already a member of the team
        const existingMember = await Team.findOne({ _id: teamId, 'members.userId': user._id });
        if (existingMember) {
            return res.status(400).json({ message: 'User is already a member of this team' });
        }

        // Add the user to the team by using push operator
        const team = await Team.findById(teamId);
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }
        team.members.push({ userId: user._id, name: username, role: role || 'member' });
        await team.save();
        res.status(200).json({
            message: 'Member added successfully',
            team,
        });
    } catch (error) {
        console.error('Error adding member:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const removeMember = async (req, res) => {
    const { userId } = req.body;
    const teamId = req.params.teamId;

    try {
        // Check if the user is a member of the team
        const existingMember = await Team.findOne({ _id: teamId, 'members.userId': userId });
        if (!existingMember) {
            return res.status(400).json({ message: 'User is not a member of this team' });
        }

        // Remove the member from the team
        const updatedTeam = await Team.findByIdAndUpdate(
            teamId,
            { $pull: { members: { userId } } },
            { new: true }
        );

        // Update the user's teamId, username and role
        await User.findByIdAndUpdate(userId, { teamId: null, name: null, role: null }, { new: true });

        res.status(200).json(updatedTeam);
    } catch (error) {
        console.error('Error removing member:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateMemberRole = async (req, res) => {
    const { userId, role } = req.body;
    const teamId = req.params.teamId;

    try {
        // Check if the user is a member of the team
        const existingMember = await Team.findOne({ _id: teamId, 'members.userId': userId });
        if (!existingMember) {
            return res.status(400).json({ message: 'User is not a member of this team' });
        }

        // Update the user's role in the team
        const updatedTeam = await Team.findOneAndUpdate(
            { _id: teamId, 'members.userId': userId },
            { $set: { 'members.$.role': role } },
            { new: true }
        );

        res.status(200).json(updatedTeam);
    } catch (error) {
        console.error('Error updating member role:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getTeamMembers = async (req, res) => {
    const teamId = req.params.teamId;

    try {
        const team = await Team.findById(teamId).populate('members.userId', 'name email role');
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }
        res.status(200).json(team.members);
    }
    catch (error) {
        console.error('Error fetching team members:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
}

//get the details of a specific member
export const getMemberDetails = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    }
    catch (error) {
        console.error('Error fetching member details:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
}