// var nodemailer = require('nodemailer');
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

const form = document.getElementById('form');

form.addEventListener('submit',registerUser);

async function registerUser(event){
    event.preventDefault();

    const username = document.getElementById('name').value;
    const password = document.getElementById('password').value;
    const email = document.getElementById('email').value;
    const select = document.getElementById('select').value;


    const result = await fetch('/api/register',{
        method:'POST',
        headers:{
            'Content-Type' : 'application/json'
        },
        body:JSON.stringify({
            username,
            password,
            email,
            select
        })
    }).then((res)=> res.json())
    if(result.status === 'ok'){
        alert('Success');
        form.reset();
        window.location.href = "/login"
        // var mailoptions={
        //     from:'poojarydheeraj665@gmail.com',
        //     to:'poojarydheeraj665@gmail.com',
        //     subject:'Conformation mail',
        //     text : 'Registered sucessfully'
        // }
        // transporter.sendMail(mailoptions,function(error,info){
        //     if(error){
        //         console.log(error);
        //     }else{
        //         console.log('mail sent sucessfully');
        //     }
        // })
        
    }else{
        alert(result.error);
        form.reset();
    }
}