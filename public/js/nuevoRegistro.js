import {validacionNuevoFormulario} from "./validationNewForm.js"

const formulario=document.getElementById("form-new-register") 

formulario.addEventListener('submit', async function(event){ 

    event.preventDefault() 

    const usuarioIngresado = document.getElementById("usuario-new-ingresado").value; 
    const passWordIngresado = document.getElementById("usuario-new-password").value; 
    console.log(usuarioIngresado,passWordIngresado)  
    console.log(passWordIngresado) 
 
 

     if(!validacionNuevoFormulario()){ 
        return

     } 

     try{ 

        const response= await fetch('http://localhost:1200/nuevo-registro',{  
            method:"POST",
            headers:{
                'Content-Type':'application/json'
            }, 
            body:JSON.stringify({ 
                usuario:usuarioIngresado,
                password:passWordIngresado,
    

            })

        }) 

        const data = await response.json()  

        if(data.error){ 
            alert(data.error) 

        }

        if(data.reedireccion){ 
            window.location.href = data.reedireccion

        } 

       
     
      
     } 

     catch(error){
        console.log('no se pudo logear el usuario',error)
     }



    this.reset()

})