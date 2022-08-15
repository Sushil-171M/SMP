const jwt = require("jsonwebtoken")
const User = require('../models/user')
const env = require('dotenv').config();

module.exports =  (req,res,next) =>{
   
    const {authorization} = req.headers;

    if(!authorization)
    {
        return res.status(404).json({
            error:'You must be Logged in !! ):'
        })
    }

    const token = authorization.replace("Bearer ",'');

    jwt.verify(token,process.env.JWT_SECRET_KEY,(err,payload)=>{
        if(err)
          return res.status(401).json({
              error:'you must be Logged in !!'
          });

          const {_id} = payload;

          User.findById(_id).then(user=>{
              req.user = user
          });

          next();

    })

}
