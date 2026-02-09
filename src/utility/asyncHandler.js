/**
 * Wraps an async route handler to automatically catch errors
 * @template {import('express').RequestHandler} T
 * @param {T} requestHaHandler - The async request handler function
 * @returns {import('express').RequestHandler} Express middleware function
 */
const asyncHandler = (requestHaHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHaHandler(req, res, next)).catch((err) =>
            next(err)
        )
    }
}

export { asyncHandler };
