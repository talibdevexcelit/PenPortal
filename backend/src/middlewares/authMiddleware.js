import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
    let token;

    // Check if token exists in the Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from the token (exclude password)
            req.user = await User.findById(decoded.id).select('-password');

            next();
        } catch (error) {
            console.error(error);
            return res.status(401).json({
                status: false,
                message: 'Not authorized, token failed',
                data: null,
                error: { message: 'Invalid token' }
            });
        }
    }

    if (!token) {
        return res.status(401).json({
            status: false,
            message: 'Not authorized, no token',
            data: null,
            error: { message: 'Token required' }
        });
    }
};

export const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({
            status: false,
            message: 'Not authorized as an admin',
            data: null,
            error: { message: 'Admin access required' }
        });
    }
};