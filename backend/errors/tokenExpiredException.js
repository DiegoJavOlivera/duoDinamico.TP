

class TokenExpiredException extends Error {
  constructor(message = 'Token has expired') {
    super(message);
    this.name = 'TokenExpiredException';
    this.statusCode = 401; 
  }
}


module.exports = TokenExpiredException;