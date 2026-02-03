const asyncHandler = (requestHaHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHaHandler(req, res, next)).catch((err) =>
            next(err)
        )
    }
}

export { asyncHandler };
