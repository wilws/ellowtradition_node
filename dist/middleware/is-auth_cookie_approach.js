"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth = (req, res, next) => {
    if (!req.cookies.jwt) {
        const error = new Error('Not authenticated');
        error.statusCode = 401;
        error.message = "No Token is found";
        throw error;
    }
    const token = req.cookies.jwt;
    let decodedToken;
    try {
        decodedToken = jsonwebtoken_1.default.verify(token, 'Secret');
    }
    catch (err) {
        const error = new Error('Token Invalid. May be expired');
        error.statusCode = 401;
        error.message = "Token expired";
        throw error;
    }
    if (!decodedToken) {
        const error = new Error('Not authenticated.');
        error.statusCode = 401;
        error.message = "Token verification failed";
        throw error;
    }
    req.userId = decodedToken.userId;
    next();
};
exports.default = auth;
