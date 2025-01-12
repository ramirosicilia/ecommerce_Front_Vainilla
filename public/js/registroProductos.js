import { validarFormularioProducto, validarFormularioProductoUpdate } from "./validacionAdmin.js"; 


 let botonesEditar=[] 

 let botonesEliminar=[]




 const pedirProductos=async()=>{ 

  try{ 

    const response= await fetch("http://localhost:1200/obtener-productos") 

    if(!response.ok){ 

      const dataErrror= await response.json() 
      throw new Error(dataErrror.error)

    } 

    else{
      const productosData= await response.json() 
      

      mostrarProductosAdmin(productosData) 
      return productosData
    } 

  } 


  catch(err){ 

    Swal.fire({
      title: '¡Error!',
      text: err.message, // Muestra el mensaje del backend
      icon: 'error',
      confirmButtonText: 'Intenta de nuevo',
  });

  }



}

pedirProductos()  




function mostrarProductosAdmin(productos){ 

const tbody=document.getElementById("cuerpo-productos") 

tbody.innerHTML="" 
console.log(productos)

 
if(productos.length > 0){

  productos.forEach(producto=>{ 

    tbody.innerHTML+=` 
     <tr>    
                <td>
                <input type="checkbox" class="form-check-input pause-checkbox" data-id="producto-id">
                </td>
              <td><img src=${producto.imagenes} alt="Producto">${producto.nombre_producto}</td>
              <td>${producto.precio} </td>
              <td>${producto.categorias.nombre_categoria} </td>
              <td>${producto.stock} </td>
              <td>
                <button class="btn btn-primary btn-sm btn-editar " data-bs-toggle="modal" data-bs-target="#editProductModal"><i class="fas fa-edit"></i> Editar</button>

                <button class="btn btn-danger btn-sm btn-eliminar"><i class="fas fa-trash"></i> Eliminar</button>
              </td>
            </tr>
    `
    
  })  
  botonesEditar=[...document.querySelectorAll(".btn-editar")] 
  botonesEliminar=[...document.querySelectorAll(".btn-eliminar")] 
 
   activarBotones(botonesEditar)

} 


}  




//Formulario Actualizacion 

const formulario = document.getElementById("formulario-producto");

formulario.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(formulario);

  if (!validarFormularioProducto()) {
    return; // Detener si hay errores
  }

  try { 

     console.log(formData)  

    


    const response = await fetch("http://localhost:1200/subir-productos", {
      method: "POST",
      body: formData,
    }); 

    console.log(response)

    if (!response.ok) {
      throw new Error("Error al enviar los datos");
    }

    Swal.fire({
      title: "Éxito",
      text: "Producto guardado correctamente",
      icon: "success",
      confirmButtonText: "OK",
    });
    formulario.reset();
  } catch (err) {
    Swal.fire({
      title: "Error",
      text: err.message,
      icon: "error",
      confirmButtonText: "Intenta de nuevo",
    });
  }  

 
 
}); 

   function activarBotones(botones){ 

    botones.forEach((boton,index)=>{ 

      boton.addEventListener('click',async()=>{  

        const productos= await pedirProductos() 

        const productoID=productos[index].producto_id 

         actualizarEnvioUpdate(productoID)


      })

    })

   }




  const formularioUpdate = document.getElementById("formulario-producto-update"); 
 console.log(formularioUpdate) 

    

 function actualizarEnvioUpdate(id){ 

  formularioUpdate.addEventListener("submit", async (e) => {
    e.preventDefault(); 
  
      
  
    const formData = new FormData(formularioUpdate); 
  

    console.log(validarFormularioProductoUpdate())
  
    if (!validarFormularioProductoUpdate()) {
      return; // Detener si hay errores
    }
   
    try {  

      
  
      const response = await fetch(`http://localhost:1200/actualizar-productos/${id}`, {
        method: "PUT",
        body: formData,
      }); 
  
      console.log(response)
  
      if (!response.ok) {
        throw new Error("Error al enviar los datos");
      }
  
      Swal.fire({
        title: "Éxito",
        text: "Producto actualizado correctamente",
        icon: "success",
        confirmButtonText: "OK",
      });



      
         
       const datos=response.json() 
       console.log(datos.data)

      formulario.reset();
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: err.message,
        icon: "error",
        confirmButtonText: "Intenta de nuevo",
      });
    }  
  
   
   
  });

 }










