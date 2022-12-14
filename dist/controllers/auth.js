"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLogin = exports.logout = exports.login = exports.createUser = void 0;
const express_validator_1 = require("express-validator");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const token_1 = __importDefault(require("../models/token"));
const user_1 = __importDefault(require("../models/user"));
const createUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req); //  store error ,if any , during route’s validation 
        if (!errors.isEmpty()) { // if error happens in route’s validation
            const error = new Error(errors.errors[0].msg); // set error message
            error.statusCode = 422; // give error status code
            error.data = errors.array(); //keep error information from validationResult
            throw error;
        }
        const email = req.body.email;
        const username = req.body.username;
        const address = req.body.address;
        const password = req.body.password;
        const hashedPw = yield bcryptjs_1.default.hash(password, 12);
        const newUser = new user_1.default({
            username: username,
            email: email,
            address: address,
            password: hashedPw
        });
        yield newUser.save();
        res.status(200).json({
            message: "user created"
        });
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
});
exports.createUser = createUser;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req); //  store error ,if any , during route’s validation 
        if (!errors.isEmpty()) { // if error happens in route’s validation
            const error = new Error(errors.errors[0].msg); // set error message
            error.statusCode = 422; // give error status code
            error.data = errors.array(); //keep error information from validationResult
            throw error;
        }
        const email = req.body.email;
        const password = req.body.password;
        const loadedUser = yield user_1.default.findOne({ email: email });
        if (!loadedUser) {
            const error = new Error('No Such User');
            error.statusCode = 401;
            throw error;
        }
        const hashedPw = yield bcryptjs_1.default.compare(password, loadedUser.password);
        if (!hashedPw) {
            const error = new Error('Wrong Password');
            error.statusCode = 401;
            throw error;
        }
        const secret = process.env.JWT_SECRET;
        const token = jsonwebtoken_1.default.sign({
            email: email,
            userId: loadedUser._id.toString()
        }, secret, { expiresIn: '1h' });
        // res.cookie('jwt',token,{httpOnly: true, maxAge: 8640000});
        res.status(200).json({
            token: token,
            username: loadedUser.username,
            email: loadedUser.email,
            address: loadedUser.address,
            message: "Login Successful"
        });
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
});
exports.login = login;
// export const login:RequestHandler = async (req, res, next) =>{
// This function is muted becase Heroku deployment doest support cookie setting.
//     try {
//         const errors:any = validationResult(req)                        //  store error ,if any , during route’s validation 
//         if(!errors.isEmpty()){							                // if error happens in route’s validation
//             const error:any = new Error(errors.errors[0].msg);	        // set error message
//             error.statusCode = 422;						                // give error status code
//             error.data = errors.array();                  	            //keep error information from validationResult
//             throw error;							
//          }
//         const email = req.body.email;
//         const password = req.body.password;
//         const loadedUser = await User.findOne({email:email});
//         if (!loadedUser){
//             const error:any = new Error('No Such User');
//             error.statusCode = 401;
//             throw error;
//         } 
//         const hashedPw = await bcrypt.compare(password,loadedUser.password);
//         if(!hashedPw){
//             const error:any = new Error('Wrong Password');
//             error.statusCode = 401;
//             throw error;
//         } 
//         const token = jwt.sign(
//             {
//                 email:email,
//                 userId: loadedUser._id.toString()
//             },
//             'Secret',
//             {expiresIn: '1h'}
//         );
//         res.cookie('jwt',token,{httpOnly: true, maxAge: 8640000});
//         res.status(200).json({
//             token:token,
//             username: loadedUser.username,
//             email: loadedUser.email,
//             address: loadedUser.address,
//             message:"Login Successful"
//         })
//     } catch(err:any) {
//         if(!err.statusCode){
//             err.statusCode = 500;
//         }
//         next(err);
//     }
// }
const logout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // This is an non-cookie approach to log out
    try {
        if (!req.header('authorization')) { // Check if jwt exist. 
            const error = new Error('No Token Logout'); // if not exist. it means the use is already not in log in state
            error.statusCode = 200; // though unlikely happen, but the aim of log out is achieve
            error.message = "No Token Logout";
            throw error;
        }
        const authHeader = req.header('authorization');
        const jwt = authHeader.split(' ')[1]; // save token in to DB
        const token = new token_1.default({
            token: jwt
        });
        yield token.save();
        res.status(200).json({
            message: "Logout Successful"
        });
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
});
exports.logout = logout;
// export const logout:RequestHandler = async (req, res, next) =>{
// This function is muted becase Heroku deployment doest support cookie setting.
//     //  ** SHOULD NOT CHECK IF JWT EXIST FOR LOGOUT. JUST LOGOUT
//     // if(!req.cookies.jwt){
//     //     const error:any = new Error('No Token in Cookies');
//     //     error.statusCode = 406;
//     //     throw error;
//     // }
//     try{
//         res.cookie('jwt','',{maxAge:1});              // rest cookie. remove jwt token and expire i 1 ms        
//         res.status(200).json({
//             message:"Logout Successful"
//         })
//     } catch(err:any) {
//         if(!err.statusCode){
//             err.statusCode = 500;
//         }
//         next(err);
//     }
// }
const isLogin = (req, res, next) => {
    res.status(200).json({
        message: "Login Valid"
    });
};
exports.isLogin = isLogin;
