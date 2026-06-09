const{ JWT_SECRET } = require('./config');
const jwt = require('jsonwebtoken');

const authenticationMiddleware = (req, res, next) => {

    const authHeader = req.headers.authorization;
    
    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({message: 'Unauthorized'});
}
   const Token = authHeader.split('')[1];

   try{
     const decoded = jwt.verify(Token, JWT_SECRET);
        req.userId = decoded.userId;
   } catch (error) {
        return res.status(401).json({message: 'Unauthorized'});
   }
};

module.exports = authenticationMiddleware;