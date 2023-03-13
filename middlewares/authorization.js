const jwt = require('jsonwebtoken')
module.exports.authentication =(req,res,next)=>{
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'token is missing' });
    }
    try {
      const decoded = jwt.verify(token, 'secret');
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  }
