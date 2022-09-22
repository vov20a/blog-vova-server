import CommentModel from '../models/Comment.js';

export const getAll = async (req, res) => {
  try {
    const comments = await CommentModel.find().populate('user').exec();
    res.json(comments);
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: 'Не удалось получить комментарий',
    });
  }
};

export const getCommentsOnePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const comments = await CommentModel.find({ postId: postId }).populate('user').exec();
    // console.log(comments);
    res.json(comments);
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: 'Не удалось получить комментарий',
    });
  }
};

export const create = async (req, res) => {
  try {
    const doc = new CommentModel({
      text: req.body.text,
      user: req.userId,
      postId: req.body.postId,
    });

    const comment = await doc.save();
    res.json(comment);
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: 'Не удалось создать комментарий',
    });
  }
};

export const remove = async (req, res) => {
  try {
    const commentId = req.params.id;
    CommentModel.findByIdAndDelete(
      {
        _id: commentId,
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(400).json({
            message: 'Не удалось удалить комментарий',
          });
        }
        if (!doc) {
          return res.status(404).json({
            message: 'Комментарий не найден',
          });
        }
        res.json({
          success: true,
        });
      },
    );
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: 'Не удалось получить комментарий',
    });
  }
};
