import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

const protect = asyncHandler(async (req, res, next) => {
  if (req.session && req.session.userId) {
    try {
      const user = await User.findById(req.session.userId).select('-password');
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      req.user = user;
      next();
    } catch (error) {
      console.error('Session verification failed:', error);
      res.status(401).json({ message: 'Not authorized, session failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no session' });
  }
});
const isAuthenticated = (req, res, next) =>{
  if(req.session.userId){
    return next();
  }else {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};


export { protect, isAuthenticated};
