import jwt from 'jsonwebtoken';
import User from '../models/User.js';


export const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                status: false,
                message: "Please provide name, email, and password",
                data: null,
                error: { message: "Missing required fields" }
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                status: false,
                message: "Email already in use",
                data: null,
                error: { message: "Email already registered" }
            });
        }

        const user = new User({ name, email, password, role: role || 'user' });
        const savedUser = await user.save();

        const token = jwt.sign(
            { id: savedUser._id, role: savedUser.role },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.status(201).json({
            status: true,
            message: "User registered successfully",
            data: {
                id: savedUser._id,
                name: savedUser.name,
                email: savedUser.email,
                role: savedUser.role,
                token
            },
            error: null
        });
    } catch (error) {
        res.status(400).json({
            status: false,
            message: "Failed to register user",
            data: null,
            error: { message: error.message }
        });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                status: false,
                message: "Please provide email and password",
                data: null,
                error: { message: "Missing required fields" }
            });
        }

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({
                status: false,
                message: "Invalid email or password",
                data: null,
                error: { message: "Invalid credentials" }
            });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                status: false,
                message: "Invalid email or password",
                data: null,
                error: { message: "Invalid credentials" }
            });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.status(200).json({
            status: true,
            message: "Login successful",
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token
            },
            error: null
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Failed to login user",
            data: null,
            error: { message: error.message }
        });
    }
};

export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        status: false,
        message: 'User not found',
        error: { message: 'User not found' },
      });
    }

    // Update fields
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    const updatedUser = await user.save();
   
    const token = jwt.sign(
      { id: updatedUser._id, role: updatedUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(200).json({
      status: true,
      message: 'Profile updated successfully',
      data: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        token,
      },
      error: null,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(400).json({
      status: false,
      message: 'Failed to update profile',
      data: null,
      error: { message: error.message },
    });
  }
};