/**
 * Standard API Response class
 */
class ApiResponse {
    /**
     * @param {number} statusCode - HTTP status code
     * @param {*} data - Response data
     * @param {string} [message="Success"] - Response message
     */
    constructor(statusCode, data, message = "Success") {
        /** @type {number} */
        this.statusCode = statusCode;
        /** @type {*} */
        this.data = data;
        /** @type {string} */
        this.message = message;
        /** @type {boolean} */
        this.success = statusCode < 400
    }
}

export { ApiResponse }