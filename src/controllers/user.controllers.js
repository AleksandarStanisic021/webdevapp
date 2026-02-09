import { asyncHandler } from "../utility/asyncHandler.js";
import { ApiError } from "../utility/ApiError.js";
import { User } from "../model/user.models.js";
import { uploadOnCloudinary } from "../utility/cloudinary.js";
import { ApiResponse } from '../utility/ApiResponse.js'



const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const acessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false })

        return { refreshToken, acessToken };

    } catch (error) {
        throw new ApiError(500, "SOMETHING WENT WRONG")
    }

}

const registerUser = asyncHandler(async (req, res) => {
    const { fullname, username, email, password } = req.body;

    if (fullname?.trim() === "") {
        throw new ApiError(400);
    }
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (existedUser) {
        throw new ApiError(404, "Wer have this one user");
    }
    const avatarLocalPath = req.files?.avatar?.[0]?.path
    const coverLocalPath = req.files?.coverImage?.[0]?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing");
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverLocalPath);

    const user = await User.create({
        fullname,
        avatar: avatar.url || "",
        coverImage: coverImage.url || "",
        email,
        password,
        username: username.toLowerCase()
    });
    const createdUser = await User.findById(user._id);
    if (!createdUser) throw new ApiError(505, "no user created!");

    return res
        .status(201)
        .json(new ApiResponse(200, createdUser, "user added"))

});

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

    const { accessToken, refreshToken } =
        await generateAccessAndRefreshToken(user._id);

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

export {
    registerUser,
    loginUser
};
