import {assyncHandler} from "../utils/asyncHandler.js";

const loginUser = assyncHandler( async (req, res) => {
    console.log("User registered");
    res.status(200).json({
        message: "ok"
    })
})

export { loginUser }