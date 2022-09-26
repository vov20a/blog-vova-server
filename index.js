import express from 'express';
import mongoose from 'mongoose';
import fs from 'fs';
import cors from 'cors';
import {
  registerValidation,
  loginValidation,
  postCreateValidation,
  commentCreateValidation,
} from './validations.js';
import { checkAuth, handleValidationErrors } from './utils/index.js';
import { UserController, PostController, CommentController } from './controllers/index.js';
import multer from 'multer';

mongoose
  .connect(process.env.MONGODB_URI)
  // .connect(
  //   'mongodb+srv://admin:AlexeevVova1960@cluster0.cv6hrln.mongodb.net/blog?retryWrites=true&w=majority',
  // )
  .then(() => console.log('DB OK'))
  .catch((err) => console.log('DB error', err));

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    if (!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads');
    }
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

app.use(express.json());
//для управления портами-разрешает frontend
app.use(cors());
app.use('/uploads', express.static('uploads'));

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);

app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);

app.get('/auth/me', checkAuth, UserController.getMe);
//load file route
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    URL: `/uploads/${req.file.originalname}`,
  });
});
//tags
app.get('/tags', PostController.getLastTags);
// app.get('/posts/tags', PostController.getLastTags);

//CRUD POSTS
app.post('/posts', checkAuth, postCreateValidation, registerValidation, PostController.create); //create one post
app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, postCreateValidation, registerValidation, PostController.update); //update one post

// comments
app.post('/comments', checkAuth, commentCreateValidation, CommentController.create);
app.get('/comments', CommentController.getAll);
app.get('/comments/:id', CommentController.getCommentsOnePost);
app.delete('/comments/:id', checkAuth, CommentController.remove);

app.listen(process.env.PORT || 4444, (err) => {
  if (err) {
    console.log(err);
  }
  console.log('Server OK');
});
