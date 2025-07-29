import User from "../models/User.js";

// Get All Users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").lean();
    res.status(200).json({
      status: true,
      message: "Users retrieved successfully",
      data: users,
      error: null,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Failed to retrieve users",
      data: null,
      error: { message: error.message },
    });
  }
};

// Delete User
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
        data: null,
        error: { message: "User not found" },
      });
    }
    await User.findByIdAndDelete(id);
    res.status(200).json({
      status: true,
      message: "User deleted successfully",
      data: { id },
      error: null,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Failed to delete user",
      data: null,
      error: { message: error.message },
    });
  }
};
