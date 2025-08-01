import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import crypto from 'crypto';


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

// Forgot Password - Step 1: Verify email and generate token
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        status: false,
        message: "Please provide your email address",
        data: null,
        error: { message: "Email is required" }
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "No account found with that email",
        data: null,
        error: { message: "Email not found" }
      });
    }

    // Generate reset token
    const resetToken = user.generateResetToken();
    await user.save({ validateBeforeSave: false });

    // In a production environment, you would send an email with the reset link
    // For this implementation, we'll just return the token in the response
    res.status(200).json({
      status: true,
      message: "Password reset initiated. Please check your email.",
      data: {
        resetToken // In production, don't expose this token
      },
      error: null
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      status: false,
      message: "Failed to process password reset",
      data: null,
      error: { message: error.message }
    });
  }
};

// Reset Password - Step 2: Verify token and set new password
export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        status: false,
        message: "Please provide reset token and new password",
        data: null,
        error: { message: "Missing required fields" }
      });
    }

    // Hash the token to compare with stored hash
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // Find user with the token and check if token is still valid
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        status: false,
        message: "Invalid or expired reset token",
        data: null,
        error: { message: "Token invalid" }
      });
    }

    // Set new password
    user.password = password;
    
    // Clear reset token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    // Generate new auth token
    const authToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(200).json({
      status: true,
      message: "Password has been reset successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: authToken
      },
      error: null
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      status: false,
      message: "Failed to reset password",
      data: null,
      error: { message: error.message }
    });
  }
};

// Verify Email - Step 1.5: Verify if token is valid (without changing password)
export const verifyResetToken = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({
        status: false,
        message: "Reset token is required",
        data: null,
        error: { message: "Missing token" }
      });
    }

    // Hash the token to compare with stored hash
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // Find user with the token and check if token is still valid
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        status: false,
        message: "Invalid or expired reset token",
        data: null,
        error: { message: "Token invalid" }
      });
    }

    res.status(200).json({
      status: true,
      message: "Token is valid",
      data: {
        email: user.email
      },
      error: null
    });
  } catch (error) {
    console.error("Verify reset token error:", error);
    res.status(500).json({
      status: false,
      message: "Failed to verify reset token",
      data: null,
      error: { message: error.message }
    });
  }
}