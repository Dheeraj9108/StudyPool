const express = require('express');
const path = require('path');
const bp = require('body-parser');
const mongoose = require('mongoose');
const notes = require('./models/notes');
const student  = require('./models/student');
const teacher = require('./models/teacher');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const auth = require('./middleware/auth');
// var nodemailer = require('nodemailer');
// const temp1 = require('./models/temp1')  

const JWT_SECRET = 'uyszdugziupi27$&%zdfkusonx&cvhkdgoig*sihsvcn&%shdfkhsdghdfgmbjxcfmbw34863'

mongoose.connect('mongodb://localhost:27017/studypool-db',{
    useNewUrlParser : true,
    useUnifiedTopology: true
})

const app = express();
app.use('/',express.static(path.join(__dirname,'static')))
app.use(bp.json());
app.use(cookieParser());
// -------------Register--------------

app.get('/' ,(req,res)=>{
    res.redirect('index.html');
})
app.get('/register' ,(req,res)=>{
    res.redirect('register.html');
})
app.get('/login' ,(req,res)=>{
    res.redirect('login.html');
})
app.get('/disforum' ,(req,res)=>{
    res.redirect('disforum.html');
})
app.get('/notes', auth ,(req,res)=>{
    if(req.user.select === "Teacher"){
        res.redirect('teacher.html');
    }else{
        res.redirect('student.html')
    }
    console.log(req.cookies.jwt);
    // res.redirect('secret.html');
})
app.get('/teacher' , async(req,res)=>{
    // var arr = await student.find({},{username:1 ,_id:0});
    // for(var i=0;i<arr.length;i++){
    //     console.log(arr[i].username);
    // }
    // console.log(req.cookies.jwt);
    res.redirect('teacher.html');
})
app.get('/student' ,(req,res)=>{
    // console.log(req.cookies.jwt);
    res.redirect('student.html');
})
app.get('/anouncement' ,(req,res)=>{
    // console.log(req.cookies.jwt);
    res.redirect('anouncement.html');
})
app.get('/logout', auth , async(req,res)=>{
   try{
        // console.log(req.user);

        //logout from single device
        
        req.user.tokens = req.user.tokens.filter((currEle)=>{
            return currEle.token != req.token;
        })

        //logout from all devices

        // req.user.tokens = [];

        res.clearCookie('jwt');


        console.log('logout');
        await req.user.save();
        res.redirect('/login');
   }catch(error){
       res.status(500).send(error); 
   }
})
app.post('/api/register', async (req,res)=>{
    const{username,password,email,select} = req.body;

    if(!username || typeof username != 'string'){
        return res.json({status:'error',error:'Invalid username/password'})
    }
    if(!password || typeof password !='string'){
        return res.json({status:'error', error:'Invalid username password'});
    }
    if(password.length < 8){
        return res.json({status : 'error' , error:'Password should contain atleast 8 characters'});
    }
    if(!email){
        return res.json({status:'error',error:'Invalid email'});
    }

    // console.log("body",req.body)
    // console.log(req.body.username)
    // console.log(req.body.password)
    // console.log(req.body.email)

    // const password = await bcrypt.hash(password,10);

    if(select === "Student"){
        

    try{
        // const response = await student.create({
        //     username,
        //     password,
        //     email
        // })

        
        const register  = new student({
            username,password,email,select
        })
        const token = await register.generateToken(); 

        res.cookie("jwt", token,{
             // expires : new Date(Date.now() + 3000),
            httpOnly:true
        });

        const  registered = await register.save();

        // var transporter = nodemailer.createTransport({
        //     host:'smtp.gmail.com',
        //     port:587,
        //     secure:false,
        //     requireTLS:true,
        //     auth:{
        //         user:'poojarydheeraj665@gmail.com',
        //         pass:'dheeraj@9108'
        //     }
        // })
        // var mailoptions={
        //     from:'poojarydheeraj665@gmail.com',
        //     to:email,
        //     subject:'Conformation mail',
        //     text : 'Sucessfully Registered to STUDYPOOL'
        // }
        // transporter.sendMail(mailoptions,function(error,info){
        //     if(error){
        //         console.log(error);
        //     }else{
        //         console.log('mail sent sucessfully');
        //     }
        // })
        
        console.log('User created Sucessfully :' , register)
    }catch(error){
        if(error.code === 11000){
            return res.json({status:'error' , error : 'Username already exists'})
        }
        throw error
    }
    res.json({status : 'ok'});
}else{
    try{
     
    const register  = new teacher({
        username,password,email,select
    })
    const token = await register.generateToken(); 

    res.cookie("jwt", token,{
         // expires : new Date(Date.now() + 3000),
        httpOnly:true
    });

    const  registered = await register.save();
    // var transporter = nodemailer.createTransport({
        //     host:'smtp.gmail.com',
        //     port:587,
        //     secure:false,
        //     requireTLS:true,
        //     auth:{
        //         user:'poojarydheeraj665@gmail.com',
        //         pass:'dheeraj@9108'
        //     }
        // })
        // var mailoptions={
        //     from:'poojarydheeraj665@gmail.com',
        //     to:email,
        //     subject:'Conformation mail',
        //     text : 'Sucessfully Registered to STUDYPOOL'
        // }
        // transporter.sendMail(mailoptions,function(error,info){
        //     if(error){
        //         console.log(error);
        //     }else{
        //         console.log('mail sent sucessfully');
        //     }
        // })
    console.log('User created Sucessfully :' , register)
}catch(error){
    if(error.code === 11000){
        return res.json({status:'error' , error : 'Username already exists'})
    }
    throw error
}
res.json({status : 'ok'});

}
    // const Student = await student.findOne({username}).lean();
    // res.status(200).json({data : Student.email});

})


// --------------Login--------------

app.post('/api/login',async (req,res) =>{
    const {username,password,email,select} = req.body
    if(select === "Student"){
    const Student = await student.findOne({username})
    // console.log(Student);

    if(!Student){
        return res.json({status : 'error',error:'Invalid username/password'})
    }
    if(await bcrypt.compare(password,Student.password)){
        const token = await Student.generateToken();
        res.cookie("jwt", token,{
            // expires : new Date(Date.now() + 3000),
            httpOnly:true
        });
       
        return res.json({status : 'ok' , data : token})
    }
    res.json({status : 'error' , error : 'Invalid username/passsword'})
    }else{
        const Teacher = await teacher.findOne({username})
    // console.log(Student);

    if(!Teacher){
        return res.json({status : 'error',error:'Invalid username/password'})
    }
    if(await bcrypt.compare(password,Teacher.password)){
        const token = await Teacher.generateToken();
        res.cookie("jwt", token,{
            // expires : new Date(Date.now() + 3000),
            httpOnly:true
        });
       
        return res.json({status : 'ok' , data : token})
    }
    res.json({status : 'error' , error : 'Invalid username/passsword'})
    }
    // const isMatch = await bcrypt.compare(password,Student.password);

    // console.log(password);
    // console.log(Student.password);

   
    // console.log(token);
    // console.log(await bcrypt.compare(password,Student.password))

    // if(isMatch){
    //     return res.json({status : 'ok' , data : token})
    //     // const token = jwt.sign({
    //     //     id : Student._id,
    //     //     username:Student.username,
    //     //     email : Student.email
    //     // },
    //     // JWT_SECRET
    //     // )
    // }else{
    //     res.json({status : 'error' , error : 'Invalid username/passsword'})
    // }
})




app.post('/api/sent', async (req,res) =>{
    const {link,Module_name} = req.body
    try{
        const response = await notes.create({
            link,
            Module_name
        })
        console.log("user created successfully",link);
        console.log(Module_name);
        // var arr = await student.find({},{email:1 ,_id:0});
        //  var transporter = nodemailer.createTransport({
        //     host:'smtp.gmail.com',
        //     port:587,
        //     secure:false,
        //     requireTLS:true,
        //     auth:{
        //         user:'poojarydheeraj665@gmail.com',
        //         pass:'dheeraj@9108'
        //     }
        // })
        // for(var i=0;i<arr.length;i++){
        //     var mailoptions={
        //         from:'poojarydheeraj665@gmail.com',
        //         to:arr[i].email,
        //         subject:'Conformation mail',
        //         text : `${Module_name} uploaded sucessfully`
        //     }
        //     transporter.sendMail(mailoptions,function(error,info){
        //         if(error){
        //             console.log(error);
        //         }else{
        //             console.log('mail sent sucessfully');
        //         }
        //     })
        // }
    }catch(error){
        return res.json({status : 'error',error : 'not successfull'})
    }
    
    
    res.json({status : 'ok'})
})
app.post('/api/recv', async (req,res) =>{
    const {modname} = req.body
    try{
        const result1 = await notes.findOne({Module_name:modname});
        // console.log(result1);
        res.status(200).json(result1)
    }catch(error){
        return res.json({status : 'error',error : 'not successfull'})
    }
    
    
    // res.json({status : 'ok'})
})
app.post('/api/list', async (req,res) =>{
    // const {modname} = req.body
    try{
        const arr = await student.find({},{username:1 ,_id:0});
        // console.log(result1);
        // console.log(arr);
        res.status(200).json(arr);
    }catch(error){
        return res.json({status : 'error',error : 'not successfull'})
    }
    
    
    // res.json({status : 'ok'})
})
app.post('/api/anouncement', async (req,res) =>{
    const {textarea} = req.body
    console.log(textarea);
    var arr = await student.find({},{email:1 ,_id:0});
    // for(var i=0;i<arr.length;i++){
    //     console.log(arr[i].username);
    // }
    try{
        //  var transporter = nodemailer.createTransport({
        //     host:'smtp.gmail.com',
        //     port:587,
        //     secure:false,
        //     requireTLS:true,
        //     auth:{
        //         user:'poojarydheeraj665@gmail.com',
        //         pass:'dheeraj@9108'
        //     }
        // })
        // for(var i=0;i<arr.length;i++){
        //     var mailoptions={
        //         from:'poojarydheeraj665@gmail.com',
        //         to:arr[i].email,
        //         subject:'Conformation mail',
        //         text : textarea
        //     }
        //     transporter.sendMail(mailoptions,function(error,info){
        //         if(error){
        //             console.log(error);
        //         }else{
        //             console.log('mail sent sucessfully');
        //         }
        //     })
        // }
        // const result1 = await notes.findOne({Module_name:modname});
        // console.log(result1);
        res.json({status:'ok'});
        // res.status(200).json(result1)
    }catch(error){
        return res.json({status : 'error',error : 'not successfull'})
    }
    
    
    // res.json({status : 'ok'})
})
app.listen(8999,()=>{
    console.log('Server is listening at 8999')
})