import express from 'express';
import { getCurrentUser, login } from '../controllers/authController';

const router = express.Router();

router.post('/login', login);
// router.post('/register', register);
// router.get('/token', refreshAccessToken);
// router.get('/logout', logout);
router.get('/user', getCurrentUser);

export default router;
