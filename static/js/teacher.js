
        const form = document.getElementById('form');
        form.addEventListener('submit',stret);
    
        async function stret(event){
            event.preventDefault(); 
    
            const link = document.getElementById('link').value;
            const Module_name = document.getElementById('name').value;
    
            const result = await fetch('/api/sent',{
                method:'POST',
                headers : {'Content-Type' : 'application/json'},
                body:JSON.stringify({
                    link,
                    Module_name
                })
            }).then((res) => res.json())
    
            if(result){
                console.log(result.arr);
                alert('Sucess');
                form.reset();
            }else{
                alert(result.error)
            }
    
        }
        const list = document.getElementById('list');
        const box = document.getElementById('box');
        list.addEventListener('click', async function(){
            const result = await fetch('/api/list',{
                method:'POST',
                headers : {'Content-Type' : 'application/json'},
                body:JSON.stringify({})
            }).then((res) => res.json())
            
            if(result){
               box.innerHTML = '';
                // alert('Sucess');
                // console.log(result[1].username);
                for(var i=0;i<result.length;i++){
                    var div = document.createElement('div');
                    div.classList.add('min_box');
                    div.innerText = result[i].username;
                    console.log(result[i].username);
                    box.append(div);
                }
                if(form.style.display === 'none'){
                    form.style.display = 'flex'
                    box.style.display = 'none'
                }else{
                    form.style.display = 'none'
                    box.style.display = 'flex'
                }
                
                form.reset();
            }else{
                alert(result.error)
            }
        })

    