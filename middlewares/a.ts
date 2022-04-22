let jwt = require('jsonwebtoken');
const config = require('../../config/user_jwt-config');
let sharedService = require('../services/shared.service');

let varifyToken = async (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase  
  if (token) {
    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length);
    }
    try {
      let decoded = jwt.verify(token, config.jwtUserSecret);
      req.user = decoded;
      next();
    } catch (error) {
      let message = error.name == "TokenExpiredError" ? "Token is expire please login again" :
        'Token is not valid please send valid token in request';
      let errorResponse = await sharedService.setErrorInResponse(message);
      res.status(errorResponse.statusCode).send(errorResponse.clientResponse)
    }
  } else {
    let errorResponse = await sharedService.setErrorInResponse("Request cannot contain auth token");
    res.status(errorResponse.statusCode).send(errorResponse.clientResponse)
  }
};

module.exports = {
  va