/**
 * Custom API Error class for handling application errors
 * @extends {Error}
 */
class ApiError extends Error {
    /**
     * @param {number} statusCode - HTTP status code
     * @param {string} [message="Error bad stuff"] - Error message
     * @param {Array} [errors=[]] - Array of error details
     * @param {string} [stack=""] - Custom stack trace
     */
    constructor(
        statusCode,
        message = "Error bad stuff",
        errors = [],
        stack = ""
    ) {
        super(message);
        /** @type {number} */
        this.statusCode = statusCode;
        /** @type {null} */
        this.data = null;
        /** @type {string} */
        this.message = message
        /** @type {boolean} */
        this.success = false
        /** @type {Array} */
        this.errors = errors

        if (stack) {
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export { ApiError }