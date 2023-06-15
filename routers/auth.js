const express = require("express")
const router = express.Router();
const asyncHandler = require("express-async-handler")
const { User, validaterLoginUser, validaterRgisterUser } = require("../modules/Users")
const bcrybt = require("bcryptjs")
const JWT = require("jsonwebtoken")

//  register new user
router.post("/register", asyncHandler(async (req, res) => {
    const { error } = validaterRgisterUser(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });

    }
    let user = await User.findOne({ email: req.body.email });
    if (user) {
        return res.status(400).json({ message: "this email is already regsiter" });
    }

    const salt = await bcrybt.genSalt(10);
    req.body.password = await bcrybt.hash(req.body.password, salt);

    user = new User({
        email: req.body.email,
        userName: req.body.userName,
        password: req.body.password,
        isAdmin: req.body.isAdmin,
    });
    const result = await user.save();
    const token = JWT.sign({ id: user._id, userName: user.userName }, process.env.Jwt_secretKey);
    const { password, ...other } = result._doc;
    res.status(200).json({ ...other, token });
}))






//  Login user
router.post("/login", asyncHandler(async (req, res) => {
    const { error } = validaterLoginUser(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });

    }
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(400).json({ message: "invalid email" });
    }

    const isPasswordMatch = await bcrybt.compare(req.body.password, user.password);
    if (!isPasswordMatch) {
        return res.status(400).json({ message: "invalid password" });
    }


    const token = JWT.sign({ id: user._id, userName: user.userName }, process.env.Jwt_secretKey);
    const { password, ...other } = user._doc;
    res.status(200).json(...other, token);
}))
module.exports = router;