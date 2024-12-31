import { validarFormularioProducto } from "./validacionAdmin.js";


const formulario = document.getElementById('formulario-producto');

formulario.addEventListener('submit', async (event) => {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const precio = document.getElementById('precio').value;
    const imagen = document.getElementById('imagen').files[0];
    const categoria = document.getElementById('categoria').value;
    const stock = document.getElementById('stock').value; 

    if (!validarFormularioProducto()) {
      return; // Si hay errores, no continuar
    } 


    try {  

        let formData=new FormData()  
        formData.append("nombre",nombre) 
        formData.append("precio",precio)
        formData.append("imagen",imagen)
        formData.append("categoria",categoria)
        formData.append("stock",stock)
        console.log(formData)
    
        
        const response = await fetch(`http://localhost:1200/subir-productos`, {
          method: "POST",
          body:formData
        }); 
        console.log(response)
    
    

     
      if (!response.ok) {
        console.log(await response.json())
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log(response)
      let data = await response.json(); 
      console.log(data)
  
      // Manejar la respuesta del servidor
      if (!data) {
        alert(data.error);
      } 

    } catch (error) {   
        console.log("Error: no se pudieron subir los productos" );
        }

   

    formulario.reset()
});