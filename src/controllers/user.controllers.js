import { asyncHandler } from "../utility/asyncHandler.js";
import { ApiError } from "../utility/ApiError.js";
import { User } from "../model/user.models.js";
import { uploadOnCloudinary } from "../utility/cloudinary.js";
import { ApiResponse } from '../utility/ApiResponse.js'



/**
 * Generates access and refresh tokens for a user
 * @param {string | import('mongoose').Types.ObjectId} userId - User ID
 * @returns {Promise<{refreshToken: string, acessToken: string}>} Object containing refresh and access tokens
 */
const generateAccessAndRefreshToken = async (userId) => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/550818c7-e0f5-457c-992a-7077797fc888',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'user.controllers.js:9',message:'generateAccessAndRefreshToken entry',data:{userId:userId?.toString()},timestamp:Date.now(),runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    try {
        const user = await User.findById(userId);
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/550818c7-e0f5-457c-992a-7077797fc888',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'user.controllers.js:12',message:'user found for token generation',data:{userFound:!!user},timestamp:Date.now(),runId:'run1',hypothesisId:'B'})}).catch(()=>{});
        // #endregion
        const acessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/550818c7-e0f5-457c-992a-7077797fc888',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'user.controllers.js:14',message:'tokens generated',data:{hasAccessToken:!!acessToken,hasRefreshToken:!!refreshToken,accessTokenLength:acessToken?.length},timestamp:Date.now(),runId:'run1',hypothesisId:'B'})}).catch(()=>{});
        // #endregion

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false })
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/550818c7-e0f5-457c-992a-7077797fc888',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'user.controllers.js:17',message:'user saved with refreshToken',data:{},timestamp:Date.now(),runId:'run1',hypothesisId:'B'})}).catch(()=>{});
        // #endregion

        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/550818c7-e0f5-457c-992a-7077797fc888',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'user.controllers.js:18',message:'returning tokens',data:{returnKeys:Object.keys({refreshToken,acessToken})},timestamp:Date.now(),runId:'run1',hypothesisId:'B'})}).catch(()=>{});
        // #endregion
        return { refreshToken, acessToken };

    } catch (error) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/550818c7-e0f5-457c-992a-7077797fc888',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'user.controllers.js:21',message:'generateAccessAndRefreshToken error',data:{errorMessage:error?.message,errorStack:error?.stack?.substring(0,200)},timestamp:Date.now(),runId:'run1',hypothesisId:'B'})}).catch(()=>{});
        // #endregion
        throw new ApiError(500, "SOMETHING WENT WRONG")
    }

}

/**
 * Registers a new user
 * @param {import('express').Request & {files?: {avatar?: Array<{path: string}>, coverImage?: Array<{path: string}>}}} req - Express request object with files
 * @param {import('express').Response} res - Express response object
 */
const registerUser = asyncHandler(async (req, res) => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/550818c7-e0f5-457c-992a-7077797fc888',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'user.controllers.js:26',message:'registerUser entry',data:{hasBody:!!req.body,bodyKeys:req.body?Object.keys(req.body):[],hasFiles:!!req.files},timestamp:Date.now(),runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    const { fullname, username, email, password } = req.body;

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/550818c7-e0f5-457c-992a-7077797fc888',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'user.controllers.js:29',message:'extracted fields',data:{fullname:!!fullname,username:!!username,email:!!email,password:!!password},timestamp:Date.now(),runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion

    if (fullname?.trim() === "") {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/550818c7-e0f5-457c-992a-7077797fc888',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'user.controllers.js:30',message:'fullname validation failed',data:{fullname},timestamp:Date.now(),runId:'run1',hypothesisId:'C'})}).catch(()=>{});
        // #endregion
        throw new ApiError(400);
    }
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/550818c7-e0f5-457c-992a-7077797fc888',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'user.controllers.js:32',message:'checking existing user',data:{username,email},timestamp:Date.now(),runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/550818c7-e0f5-457c-992a-7077797fc888',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'user.controllers.js:35',message:'existedUser check result',data:{existedUser:!!existedUser},timestamp:Date.now(),runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    if (existedUser) {
        throw new ApiError(404, "Wer have this one user");
    }
    const avatarLocalPath = req.files?.avatar?.[0]?.path
    const coverLocalPath = req.files?.coverImage?.[0]?.path

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/550818c7-e0f5-457c-992a-7077797fc888',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'user.controllers.js:39',message:'file paths extracted',data:{avatarLocalPath:!!avatarLocalPath,coverLocalPath:!!coverLocalPath},timestamp:Date.now(),runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing");
    }
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/550818c7-e0f5-457c-992a-7077797fc888',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'user.controllers.js:44',message:'before cloudinary upload',data:{avatarLocalPath,coverLocalPath},timestamp:Date.now(),runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/550818c7-e0f5-457c-992a-7077797fc888',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'user.controllers.js:45',message:'avatar uploaded',data:{avatarSuccess:!!avatar,avatarUrl:avatar?.url},timestamp:Date.now(),runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
    const coverImage = await uploadOnCloudinary(coverLocalPath);
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/550818c7-e0f5-457c-992a-7077797fc888',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'user.controllers.js:46',message:'coverImage uploaded',data:{coverImageSuccess:!!coverImage,coverImageUrl:coverImage?.url},timestamp:Date.now(),runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/550818c7-e0f5-457c-992a-7077797fc888',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'user.controllers.js:47',message:'before User.create',data:{fullname,username,email,hasPassword:!!password,avatarUrl:avatar?.url,coverImageUrl:coverImage?.url},timestamp:Date.now(),runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    const user = await User.create({
        fullname,
        avatar: avatar.url || "",
        coverImage: coverImage.url || "",
        email,
        password,
        username: username.toLowerCase()
    });
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/550818c7-e0f5-457c-992a-7077797fc888',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'user.controllers.js:54',message:'User.create completed',data:{userId:user?._id?.toString(),hasPassword:!!user?.password,passwordLength:user?.password?.length},timestamp:Date.now(),runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    const createdUser = await User.findById(user._id);
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/550818c7-e0f5-457c-992a-7077797fc888',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'user.controllers.js:56',message:'createdUser found',data:{createdUser:!!createdUser},timestamp:Date.now(),runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    if (!createdUser) throw new ApiError(505, "no user created!");

    return res
        .status(201)
        .json(new ApiResponse(200, createdUser, "user added"))

});

/**
 * Logs in a user
 * @param {import('express').Request} req - Express request object with body containing username, password, email
 * @param {import('express').Response} res - Express response object
 */
const loginUser = asyncHandler(async (req, res) => {
    const { username, password, email } = req.body
    if (!email) { throw new ApiError(511, "error ... no email") }

    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (!user) { throw new ApiError(404, "User not found") }

    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid) {
        throw new ApiError(404, 'password is not valid');
    }

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/550818c7-e0f5-457c-992a-7077797fc888',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'user.controllers.js:79',message:'before token generation destructure',data:{userId:user._id?.toString()},timestamp:Date.now(),runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    const tokenResult = await generateAccessAndRefreshToken(user._id);
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/550818c7-e0f5-457c-992a-7077797fc888',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'user.controllers.js:80',message:'token generation result',data:{tokenResultKeys:tokenResult?Object.keys(tokenResult):[],hasAccessToken:!!tokenResult?.accessToken,hasAcessToken:!!tokenResult?.acessToken},timestamp:Date.now(),runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    const accessToken = tokenResult?.acessToken || tokenResult?.accessToken; // Handle typo in return value
    const refreshToken = tokenResult?.refreshToken;

    const loggedInUser = await User.findById(user._id)
        .select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, loggedInUser, "Sucess in login"))

})

const loggoutUser = () => {


}

const autocompleteUsers = asyncHandler(async (req, res) => {
    const { query } = req.query;
    
    if (!query || query.trim() === "") {
        return res
            .status(200)
            .json(new ApiResponse(200, [], "No query provided"));
    }

    const searchQuery = query.trim().toLowerCase();
    
    // Search users by username, email, or fullname
    const users = await User.find({
        $or: [
            { username: { $regex: searchQuery, $options: "i" } },
            { email: { $regex: searchQuery, $options: "i" } },
            { fullname: { $regex: searchQuery, $options: "i" } }
        ]
    })
    .select("username email fullname avatar")
    .limit(10); // Limit results to 10 for autocomplete

    return res
        .status(200)
        .json(new ApiResponse(200, users, "Autocomplete results retrieved successfully"));
});

export {
    registerUser,
    loginUser,
    autocompleteUsers
};
