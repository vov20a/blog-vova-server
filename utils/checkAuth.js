import jwt from 'jsonwebtoken';

export default (req, res, next) => {
  const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
  if (token) {
    try {
      const decoded = jwt.verify(token, 'secret123');

      req.userId = decoded.id;
      next();
    } catch (err) {
      return res.status(403).json({
        message: 'Нет доступа Id',
      });
    }
  } else {
    return res.status(403).json({
      message: 'Нет доступа',
    });
  }
  //   console.log(token);
  //   next();
};
