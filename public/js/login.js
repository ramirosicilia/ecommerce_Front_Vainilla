
import { ValidacionformularioLogin } from "./validacionesLogin.js"; 
import { authenticatenUser } from "./Authenticated.js";



const formularioLogin = document.getElementById("login"); 
const containerCookies=document.getElementById('container-cookies') 
const botonAceptar=document.getElementById('boton-si') 
const botonRechazar=document.getElementById('boton-no') 


let cookiesDenegadas = true; 

setTimeout(() => { 

    containerCookies.classList.add('active-cookies') 
    botonAceptar.addEventListener('click',async(e)=>{  

        
        if(e.target.value==="si"){  
       
           cookiesDenegadas=false
           containerCookies.classList.remove('active-cookies') 
           Swal.fire({
            title: "usted acepto las cookies ahora puede enviar el formulario de logueo",
            showClass: {
              popup: `
                animate__animated
                animate__fadeInUp
                animate__faster
              `
            },
            hideClass: {
              popup: `
                animate__animated
                animate__fadeOutDown
                animate__faster
              `
            }
          });

            
        }  
        

    }) 

    botonRechazar.addEventListener('click',async(e)=>{  

        if(e.target.value==="no"){  
           
            cookiesDenegadas = true; 
            Swal.fire({
                title: "no va a poder ingresar tiene que aceptar las cookies",
                showClass: {
                  popup: `
                    animate__animated
                    animate__fadeInUp
                    animate__faster
                  `
                },
                hideClass: {
                  popup: `
                    animate__animated
                    animate__fadeOutDown
                    animate__faster
                  `
                }
              });
            containerCookies.classList.remove('active-cookies') 
             
            setTimeout(() => {
                window.location.reload()
                
            }, 2000);
            
        }  
      

    }) 
  
}, 800);


 


formularioLogin.addEventListener("submit", async (e) => { 
    e.preventDefault(); 
    
    if (cookiesDenegadas) {
        e.preventDefault();  // Esto evita que el formulario se envíe
        Swal.fire({
            title: "Debe de aceptar las cookies para continuar",
            showClass: {
              popup: `
                animate__animated
                animate__fadeInUp
                animate__faster
              `
            },
            hideClass: {
              popup: `
                animate__animated
                animate__fadeOutDown
                animate__faster
              `
            }
          });

          setTimeout(() => {
            window.location.reload()
            
        }, 2000);
    }
   

    const usuarioIngresado = document.getElementById("usuario-ingresado").value; 
    const passWordIngresado = document.getElementById("usuario-password").value; 
    console.log(usuarioIngresado,passWordIngresado)  
    console.log(passWordIngresado)

    // Validación del formulario
    if (!ValidacionformularioLogin()) {   
        return;
    }

    try {
        // Solicitud al backend para iniciar sesión 
      
        const peticion = await fetch(`http://localhost:1200/login-logeado`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include", 
            body: JSON.stringify({
                userInto: usuarioIngresado,
                passwordInto: passWordIngresado,
            }),
        }); 
       
           console.log(peticion,'peticion') 
  

        // Manejo de errores de la petición
        if (!peticion.ok) {
            const errorDatos = await peticion.json();
            alert("Error " + errorDatos.err);
            return;
        } 
        
        // Procesamiento de la respuesta del servidor
        let datos = await peticion.json();


        if(datos.err){
          alert(datos.err)
        } 

        if (datos.token) {
          document.cookie = `token=${datos.token}; path=/;`; 
          await authenticatenUser();
      }
      
        

        if(datos){ 

          Swal.fire({
            title: `el usuario fue: ${datos.respuesta}`,
            showClass: {
              popup: `
                animate__animated
                animate__fadeInUp
                animate__faster
              `
            },
            hideClass: {
              popup: `
                animate__animated
                animate__fadeOutDown
                animate__faster
              `
            }
          });

        
        }
       
        


        else {
            alert("Token no recibido");
            return;
        }

    
      

       
         
    } catch (err) {
        console.error("Error al ingresar los datos:", err);
    }  

 

        e.target.reset
   
        
});  





