const jwt = require('jsonwebtoken');
const model = require('../models/student');
const model1 = require('../models/teacher');


const auth = async (req, res, next) =>{
    try{
        const token = req.cookies.jwt;
        // console.log(req.params.select);
        const verify = jwt.verify(token,'uyszdugziupi27$&%zdfkusonx&cvhkdgoig*sihsvcn&%shdfkhsdghdfgmbjxcfmbw34863');
        console.log(verify);
        const user = await model.findOne({_id:verify.id , select:verify.select}) ;
        const teacher = await model1.findOne({_id:verify.id , select:verify.select});
        // console.log(user);
        // console.log(teacher);
        req.token = token;
        if(!user){
            req.user = teacher;
        }else{
            req.user = user;
        }
        
        next();
    }catch(error){
        // res.status({status : 'error', error : error});
        // res.status(401).send(error);
        res.redirect('/login');
    }
}
module.exports = auth;