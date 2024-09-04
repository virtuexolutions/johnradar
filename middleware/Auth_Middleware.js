const JWT = require('jsonwebtoken')
const User = require('../models/UserModel.js')
const dotenv = require('dotenv').config()

var checkUserAuth = async (req, res, next) => {
    let token

    const {authorization} = req.headers
    if(authorization && authorization?.startsWith('Bearer')){
        try{
            //get token from header
            token = authorization.split(' ')[1]

            //verify token
            const {UserID} = JWT.verify(token, process.env.TOKEN)

            

            
            //get User from token
            req.user = await User.findById(UserID).select('-password')

            
            next()

        }catch(err){
            res.send({"status": "Failed","message" :"UnAuthorized access"})
        }
    }

    if(!token){
        res.send({"status": "Failed","message" :"Please add the token into your header"})

    }

} 


module.exports  = checkUserAuth