class ExpressError extends Error {
    constructor(status, message) {
        super();
        this.message = message;
        this.statusCode = status;

    }
}
module.exports = ExpressError;