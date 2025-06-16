
class InvalidIdException extends Error {
    constructor(message) {
        super(message); 
        this.name = "InvalidIDError";
        this.statusCode = 400;
    }
}

module.exports = InvalidIdException;