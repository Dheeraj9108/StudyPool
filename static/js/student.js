
        const form2 = document.getElementById('form2');
        form2.addEventListener('submit',recv);

        async function recv(event){
            event.preventDefault();

            const modname = document.getElementById('modname').value;
            const txt = document.getElementById('txt');

            const result = await fetch('/api/recv',{
                method : 'POST',
                headers : {'Content-Type' : 'application/json'},
                body:JSON.stringify({
                    modname
                })
            }).then((res) => res.json())

            if(result){
                alert("Sucess");
                txt.href = result.link
                txt.append(result.link);
                // console.log(result.link,result.Module_name)
                console.log(result.link);
                form2.reset();

            }else{
                alert("No data found")
            }
        }