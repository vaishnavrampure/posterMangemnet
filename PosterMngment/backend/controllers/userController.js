import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Role from '../models/roleModel.js';
import generateToken from '../utils/generateToken.js';

const authUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (user) {
    if (!user.active) {
      res.status(403);
      throw new Error('Your account is inactive. Please contact support.');
    }

    if (await user.matchPassword(password)) {
      const permissions = [];
      const roles = await Role.find({
        name: {
          $in: user.roles
        }
      });

      roles.forEach(role => {
        role.permissions.forEach(permission => {
          permissions.push(permission);
        });
      });

      req.session.userId = user._id;
      req.session.username = user.username;
      req.session.roles = user.roles;
      req.session.permissions = permissions;
      req.session.clientName = user.clientName;

      res.json({
        message: 'Logged in successfully',
        _id: user._id,
        username: user.username,
        roles: user.roles,
        permissions: permissions,
        clientName: user.clientName,
      });
    } else {
      res.status(401);
      throw new Error('Invalid username or password');
    }
  } else {
    res.status(401);
    throw new Error('Invalid username or password');
  }
});


// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { username, password, confirmPassword, role } = req.body;
  // Check if password matches confirmPassword
  if (password !== confirmPassword) {
    res.status(400);
    throw new Error('Passwords do not match');
  }

  //have to use regex to make sure that a password is strong
  // at least one lowercase, one uppercase, one speicalm, at least 8 chars length
  const passwordRegex = /^(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{16,}$/;
  if(!passwordRegex.test(password)){
    res.status(400);
    throw new Error(
      'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character'
    );
  }
  const userExists = await User.findOne({ username });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    username,
    password,
    roles: [role],
    active: true, // Set the default active status
  });

  if (user) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      username: user.username,
      roles: user.roles,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Public
const logoutUser = (req, res) => {
  req.session.destroy(err => {
    if(err){
      return res.status(500).json({message: 'Logout Failed'});
    }
    res.clearCookie('connect.sid'); 
    res.status(200).json({ message: 'Logged out successfully' });
  })
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private (employee only)
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.username = req.body.username || user.username;
    user.roles = req.body.roles || user.roles;
    user.active = req.body.active !== undefined ? req.body.active : user.active;
    
    if (req.body.roles.includes('Client') || req.body.roles.includes('Contractor')) {
      user.clientName = req.body.clientName ? req.body.clientName.trim() : '';
    } else {
      user.clientName = null;
    }

    const updatedUser = await user.save();
    
    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      roles: updatedUser.roles,
      clientName: updatedUser.clientName,
      permissions: updatedUser.permissions,
      active: updatedUser.active,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});



// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (employee only)
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

export {
  authUser,
  registerUser,
  logoutUser,
  getAllUsers,
  deleteUser,
  updateUser,
};
