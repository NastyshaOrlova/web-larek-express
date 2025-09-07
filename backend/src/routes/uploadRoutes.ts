import express from 'express';
import uploadFile from '../controllers/uploadFileController';
import fileMiddleware from '../middlewares/file';

const uploadRouter = express.Router();

uploadRouter.post('/', fileMiddleware.single('file'), uploadFile);

export default uploadRouter;
