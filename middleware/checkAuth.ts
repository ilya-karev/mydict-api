import { NextFunction, Request, Response } from "express";
const jwt = require('jsonwebtoken');

interface AuthorizedRequiest extends Request {
    headers: {
        authorization: string
    }
    userData: any
}
// FIX ANY
export default (req: any, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Auth failed'
        });
    }
};
