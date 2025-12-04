const jwt = require('jsonwebtoken')

const auth = (req,res,next)=>{
    try {
        const bearerHeader = req.headers['authorization']
        if(typeof bearerHeader != 'undefined'){
            const token = bearerHeader.split(' ')[1]
            const user = jwt.verify(token,process.env.JWT_SECRET)
            req.token = user
            next()
        }else{
            res.status(401).json({message:'no token provided'})
        }
    } catch (error) {
        res.status(400).json({message:'Token invalid or expired.'});
    }
}

module.exports = auth