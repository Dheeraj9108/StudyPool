const form = document.getElementById('form');
form.addEventListener('submit',loginUser);

async function loginUser(event){
    event.preventDefault();

    const username = document.getElementById('name').value;
    const password = document.getElementById('password').value;
    const email = document.getElementById('email').value;
    const select = document.getElementById('select').value;

    const result = await fetch('/api/login',{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({
            username,
            password,
            email,
            select
        })
    }).then((res) => res.json())

    if(result.status === 'ok'){
        alert("Sucess");
        form.reset();
        if(select === "Teacher"){
            window.location.href = '/teacher'
        }else{
            window.location.href ='/student'
        }
    }else{
        alert(result.error);
        form.reset();
    }
}