import express from 'express';
import uploadFile from '../controllers/uploadFileController';
import authMiddleware from '../middlewares/auth';
import fileMiddleware from '../middlewares/file';

const uploadRouter = express.Router();

uploadRouter.post('/', authMiddleware, fileMiddleware.single('file'), uploadFile);

export default uploadRouter;
