"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
// import isAuth from "../middleware/is-auth";
const user_1 = __importDefault(require("../models/user"));
const authController = require("../controllers/auth");
const router = (0, express_1.Router)();
// POST /auth/signup 
// router.post('/signup',[
//     body('email')
//     .normalizeEmail()
//         .escape()
//         .notEmpty()
//         .withMessage('Email Should not be empty')
//         .isEmail()
//         .withMessage('Please enter a valid email')
//         .custom((value, {req})=>{
//             return user.findOne({email:value}).then(user=>{
//                 if(user){
//                     return Promise.reject('E-mail is already in use')
//                 }
//             });
//         }),
//     body('password').trim().not().isEmpty().isLength({min:6,max:30}),
//     body('username').trim().not().isEmpty().isLength({max:30}),
//     body('address').not().isEmpty().trim().isLength({max:250}).escape(),
// ],authController.createUser);
router.post("/signup", authController.createUser);
// POST /auth/login
router.post('/login', [
    (0, express_validator_1.body)('password').trim().not().isEmpty().isLength({ min: 6, max: 30 }),
    (0, express_validator_1.body)('email')
        .normalizeEmail()
        .escape()
        .notEmpty()
        .withMessage('Email Should not be empty')
        .isEmail()
        .withMessage('Please Enter a Valid Email')
        .custom((value, { req }) => {
        return user_1.default.findOne({ email: value }).then(user => {
            if (!user) {
                return Promise.reject('No such E-mail is found');
            }
        });
    })
], authController.login);
// POST /auth/logout
router.post('/logout', authController.logout);
// POST /auth/is-login
// router.post('/is-login', isAuth, authController.isLogin);
// // POST /auth/reset
// router.post('/rest', authController.reset);
exports.default = router;
