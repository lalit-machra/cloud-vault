import jwt from "jsonwebtoken";
import "dotenv/config";

export function getToken(userId) {
    const accessToken = jwt.sign(userId, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1h",
    });
    
    return accessToken;
}

export function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

