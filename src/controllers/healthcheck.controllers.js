import { ApiResponse } from '../utility/ApiResponse.js'
import { asyncHandler } from '../utility/asyncHandler.js'

const healtcheck = asyncHandler(async (req, res) => {
    return res
        .status
        .json(new ApiResponse(200, "OK", "Healthcheck passed"))
})

export { healtcheck }