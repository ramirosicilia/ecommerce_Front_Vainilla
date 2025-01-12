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
            credentials:"include",
            body:JSON.stringify({ 
                usuario:usuarioIngresado,
                password:passWordIngresado,
    

            })

        }) 

        if (!response.ok) {
            // Si hay un error, lanza un error con el mensaje del backend
            const errorData = await response.json();
            throw new Error(errorData.error);
        } 

        const data = await response.json()  

        
        if(data.reedireccion){ 
            window.location.href = data.reedireccion

        }  

     }  

     




     catch (err) {
        // Captura el error y muestra una alerta al usuario
     
        Swal.fire({
            title: '¡Error!',
            text: err.message, // Muestra el mensaje del backend
            icon: 'error',
            confirmButtonText: 'Intenta de nuevo',
        });
    }
    


    this.reset()

})