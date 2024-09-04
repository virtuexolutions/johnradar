const express = require('express')

const AuthController = require('../controllers/AuthController.js')
const checkUserAuth = require('../middleware/Auth_Middleware.js')
const MainController = require('../controllers/MainController.js')

const Route = express.Router()

Route.use('/getUserData', checkUserAuth)
Route.use('/myLocation', checkUserAuth)


//Public Routes
Route.post('/Register', AuthController.Register)
Route.post('/Login', AuthController.Login)
Route.post('/ForgetPasswordEmail', AuthController.ForgetPasswordEmail)
Route.post('/VerifyOtp', AuthController.VerifyOtp)
Route.post('/resetForgetPassword', AuthController.resetForgetPassword)


//Private/Protected Routes

Route.get('/getUserData', MainController.GetMyData)
Route.post('/RegisterYourLocation', MainController.RegisterYourLocation)
Route.post('/AdsRegister', MainController.AdsRegister)
Route.get('/AllAds/:id', MainController.AdsByid)
Route.get('/allLocation', MainController.allLocation)
Route.get('/myLocation', MainController.myLocation)


module.exports = Route