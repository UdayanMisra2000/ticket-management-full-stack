import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../Models/User.js';
import Team from '../Models/Team.js';

export const registerUser = async (req, res) => {
    const { firstName, lastName ,email, password } = req.body;
    // Check if they have given all these fields
    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ message: 'Please fill all the fields' });
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            firstName,
            lastName,
            email,
            username: email,
            password: hashedPassword,
            role: "captain-admin",
        });
        // Create team
        const newTeam = await Team.create({
            name: `${firstName}'s Team`,
            captainId: newUser._id,
            members: [{ userId: newUser._id, name: firstName+" "+lastName, role: "captain-admin" }],
            password: hashedPassword,
        });
        // Update user with teamId
        newUser.teamId = newTeam._id;
        await newUser.save();
        // Create JWT token
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
            expiresIn: '24h',
        });
        res.status(201).json({
            user: {
                id: newUser._id,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                teamId: newUser.teamId,
                role: newUser.role,
            },
            token,
        });
    }
    catch (error) {
        console.error('Error registering user:', error.message);
        if (error.code === 11000) {
            return res.status(409).json({ message: 'Email already exists' });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const loginUser = async (req,res) => {
    const {email,password} = req.body;
    try {
        // Check if they have given all these fields
        if (!email || !password) {
            return res.status(400).json({ message: 'Please fill all the fields' });
        }
        // Check if user exists
        const user = await User.findOne({ $or: [{ email }, { username: email }] });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });
        // Check if password is correct
        const valid = await bcrypt.compare(password, (await Team.findById(user.teamId)).password);
        if(!valid) return res.status(400).json({ message: 'Invalid credentials' });
        // Create JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '24h',
        });
        res.status(200).json({
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                teamId: user.teamId,
                role: user.role,
            },
            token,
        });
    }
    catch (error) {
        console.error('Error logging in user:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const logoutUser = async (req, res) => {
    try {
        res.clearCookie('token', { httpOnly: true, secure: true, sameSite: 'strict' });
        res.status(200).json({ message: 'User logged out successfully' });
    } catch (error) {
        console.error('Error logging out user:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Enforce password change only by captain-admin
        if (updates.password && req.user.role !== 'captain-admin') {
            return res.status(403).json({ message: 'Only captain-admin can change the password' });
        }

        if (updates.password) {
            updates.password = await bcrypt.hash(updates.password, 10);
            // Update the team's password if the user is a captain-admin
            const user = await User.findById(id);
            if (user && user.teamId) {
                await Team.findByIdAndUpdate(user.teamId, { password: updates.password });
            }
        }

        // Fetch the existing user to preserve fields not included in the updates
        const existingUser = await User.findById(id);
        if (!existingUser) return res.status(404).json({ message: 'User not found' });

        // Merge existing fields with updates
        const updatedData = {
            firstName: updates.firstName || existingUser.firstName,
            lastName: updates.lastName || existingUser.lastName,
            email: updates.email || existingUser.email,
            ...updates, // Include other fields like password
        };

        const updatedUser = await User.findByIdAndUpdate(id, updatedData, { new: true });
        res.status(200).json({
            user: {
                id: updatedUser._id,
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                email: updatedUser.email,
            },
        });
    } catch (error) {
        console.error('Error updating user:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getUserDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                email: user.email,
                teamId: user.teamId,
                role: user.role,
            },
        });
    }
    catch (error) {
        console.error('Error getting user details:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
}