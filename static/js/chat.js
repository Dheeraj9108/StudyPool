const socket = io("http://localhost:8000",{transports:['websocket']});

const form = document.getElementById('form');

const inp = document.getElementById('inp');

const msgcontainer = document.querySelector('.container');

//Append Function
const append = (message,position)=>{
    const msgele = document.createElement('div');
    msgele.innerText = message;
    msgele.classList.add('message');
    msgele.classList.add(position);
    msgcontainer.append(msgele);
}

const nm = prompt("Enter your name");

socket.emit('new-user-joined',nm);


// User-joined function
socket.on('user-joined',name=>{
    append(`${name} : joined the chat `,'right');
})


// receive event
socket.on('receive',data=>{
    append(`${data.name}:${data.message}`,'left');
})




//left event
socket.on('left',name=>{
    append(`${name} left the chat`,'right');
})



form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const msg = inp.value;
    append(`You:${msg}`,'right');
    socket.emit('send',msg);
    inp.value='';
})



//leave button event
// const leave = document.querySelector('.leave');
// leave.addEventListener('click',()=>{
//     var ans = window.confirm('Are you sure you want to leave the chat ?')
//     if(ans){
//         window.open("./index.html",'_blank');
//     }
// })





