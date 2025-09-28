import express from 'express';
import { login, signup, updateProfile } from '../controllers/userController.js';
import { checkAuth, protectRoute } from '../middleware/auth.js';

const userRouter = express.Router();

userRouter.post('/signup', signup)
userRouter.post('/login', login)
userRouter.get('/check', protectRoute, checkAuth)
userRouter.put('/update-profile', protectRoute, updateProfile)

export default userRouter;