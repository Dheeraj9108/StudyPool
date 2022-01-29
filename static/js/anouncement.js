
        const form = document.getElementById('form');
        form.addEventListener('submit',stret);
    
        async function stret(event){
            event.preventDefault(); 
    
            const textarea = document.getElementById('textarea').value;
    
            const result = await fetch('/api/anouncement',{
                method:'POST',
                headers : {'Content-Type' : 'application/json'},
                body:JSON.stringify({
                    textarea
                })
            }).then((res) => res.json())
    
            if(result.status === 'ok'){
                alert('Anouncement Sucessfull');
                form.reset();
            }else{
                alert(result.error)
            }
    
        }

    