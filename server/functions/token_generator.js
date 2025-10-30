const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "9N6d4L3p2G8m";

const generateToken = (user) => {
    const token = jwt.sign({
        id: user.id,
        fullname: user.fullname,
        email: user.email,
    }, JWT_SECRET, {
        expiresIn: "1h",
    });
    return token;
};

const remember_me_token = (user) => {
    const token = jwt.sign({
        id: user.id,
        fullname: user.fullname,
        email: user.email,
    }, JWT_SECRET, {
        expiresIn: "7d",
    });
    return token;
};

module.exports = {
    generateToken,
    remember_me_token
};