import { validarFormularioProducto, validarFormularioProductoUpdate } from "./validacionAdmin.js"; 
import { obtenerCategorys } from "./api/productos.js";
import { obtenerProductos } from "./api/productos.js";

 
 



async function mostrarProductosAdmin() { 

  let productos= await obtenerProductos()

  const selectCategorias = document.getElementById("categoria-select-products") 
  const tbody = document.querySelector("#productos");

  console.log(selectCategorias); // Verifica si el elemento existe en la consola
  


  let productosActivos = productos.filter(producto => producto?.activacion === true); 
  



  let categorias = await obtenerCategorys(); 


  let categoriasFiltradas=categorias.filter(categorys=>categorys?.activo===true) 

  let productosActivosFiltrados = productosActivos.filter(producto =>
    categoriasFiltradas.some(categoria => categoria.categoria_id === producto.categoria_id)
);

  // Limpiar y agregar solo una vez la lista de categorías
  if (selectCategorias.options.length <= 1) {  
    selectCategorias.innerHTML = `<option value="">Selecciona una categoría</option>`;  
    categoriasFiltradas.forEach(categoria => {  
        let option = document.createElement("option");  
        option.value = categoria.nombre_categoria;  
        option.textContent = categoria.nombre_categoria;  
        selectCategorias.appendChild(option);  
    });  
}
     


  if (productosActivosFiltrados.length > 0 ) {
      productosActivosFiltrados.forEach((producto) => {
          let categoriaProducto = categoriasFiltradas.find(c => c.categoria_id === producto.categoria_id)?.nombre_categoria ;
   
       
          tbody.innerHTML += `
              <tr>    
                  <td>
                      <input type="checkbox" class="form-check-input pause-checkbox check" data-id="${producto.producto_id}">
                  </td>
                  <td><div class="contenido-celda"><img src="${producto.imagenes}" alt="Producto" style="max-width: 50px;"> ${producto.nombre_producto}</div></td>
                  <td><div class="contenido-celda">${producto.precio}</div></td>
                  <td><div class="contenido-celda">${categoriaProducto}</div></td>
                  <td><div class="contenido-celda">${producto.stock}</div></td>
                  <td class="celda-botones">
                      <button class="btn btn-primary btn-sm btn-editar" data-id="${producto.producto_id}" data-bs-toggle="modal" data-bs-target="#editProductModal"><i class="fas fa-edit"></i> Editar</button>
                      <button class="btn btn-danger btn-sm btn-eliminar" data-id="${producto.producto_id}" data-bs-toggle="modal" data-bs-target="#confirmModal"><i class="fas fa-trash"></i> Eliminar</button>
                  </td>
              </tr>
          `;
      });

      const botonesEditar = [...document.querySelectorAll(".btn-editar")];
      const botonesEliminar = [...document.querySelectorAll(".btn-eliminar")]; 
      const checkBox = [...document.querySelectorAll(".check")];

      activarBotones(botonesEditar, botonesEliminar);
      desactivadoLogicoProductos(checkBox); 

      return
  } else {
      console.log("No hay productos activos para mostrar.");
  }
} 

mostrarProductosAdmin()




//Formulario Actualizacion 

const formulario = document.getElementById("formulario-producto"); 
console.log(formulario) 




const selector = document.getElementById("productCategory");
console.log(selector); // Verifica si el elemento existe



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
    setTimeout(() => { 
      window.location.reload()
      
    }, 2000);



  } catch (err) {
    Swal.fire({
      title: "Error",
      text: err.message,
      icon: "error",
      confirmButtonText: "Intenta de nuevo",
    });
  }  

 
 
}); 

  export function activarBotones(botonesEdit,botonesElim){ 

    botonesEdit.forEach((boton)=>{ 

      boton.addEventListener('click',async()=>{  

       const productoID=boton.getAttribute("data-id")
         actualizarEnvioUpdate(productoID)


      })

    })  


    botonesElim.forEach((boton)=>{ 

      boton.addEventListener('click',async()=>{  

      
        const productoID=boton.getAttribute("data-id")
        eliminarProductoSinVentas(productoID)


      })

    })  

   } 


   // Desactivar productos lógicamente
  export function desactivadoLogicoProductos(check) {
    const estadosGuardados = JSON.parse(localStorage.getItem("productosEstado")) || {};
  
    check.forEach((ck) => {
      const dataID = ck.getAttribute("data-id");
      
      const filaProducto = ck.closest("tr");
    

      const celdasContenido = filaProducto?.querySelectorAll(".contenido-celda") || [];
     const botonesAccion = filaProducto?.querySelectorAll(".btn-editar, .btn-eliminar") || [];

  
      // Restaurar estado desde localStorage
      if (estadosGuardados[dataID] === "desactivado") {
        ck.checked = true;
        filaProducto.classList.add("desactivado");
        celdasContenido.forEach((celda) => (celda.style.opacity = "0.4"));
        botonesAccion.forEach((boton) => (boton.style.opacity = "1")); // Botones sin opacidad
      } else {
        ck.checked = false;
        filaProducto.classList.remove("desactivado");
        celdasContenido.forEach((celda) => (celda.style.opacity = "1"));
      }
  
      ck.addEventListener("change", async (e) => {
        const desactivado = e.target.checked;
  
        try {
          const response = await fetch(`http://localhost:1200/desactivar-productos/${dataID}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ activo: !desactivado }),
          });
  
          if (!response.ok) throw new Error("Error al actualizar el producto");
  
          if (desactivado) {
            filaProducto.classList.add("desactivado");
            celdasContenido.forEach((celda) => (celda.style.opacity = "0.4"));
            botonesAccion.forEach((boton) => (boton.style.opacity = desactivado ? "0.4" : "1"));

            estadosGuardados[dataID] = "desactivado";
          } else {
            filaProducto.classList.remove("desactivado");
            celdasContenido.forEach((celda) => (celda.style.opacity = "1"));
            delete estadosGuardados[dataID];
          }
  
          localStorage.setItem("productosEstado", JSON.stringify(estadosGuardados));
  
          Swal.fire({
            title: desactivado
              ? "Producto desactivado correctamente"
              : "Producto activado correctamente",
            icon: "success",
            confirmButtonText: "Entendido",
          });
        } catch (error) {
          Swal.fire({
            title: "Error",
            text: "No se pudo actualizar el estado del producto.",
            icon: "error",
            confirmButtonText: "Intentar nuevamente",
          });
          e.target.checked = !desactivado; // Restaurar estado visual
        }
      });
    });
  }
  


  const formularioUpdate = document.getElementById("formulario-producto-update"); 
 console.log(formularioUpdate) 


 
 async function actualizarEnvioUpdate(id) {  
  const selectCategorias = document.getElementById("productCategory-update"); 
  
  // Limpia el contenido antes de agregar nuevas opciones
  selectCategorias.innerHTML = `<option value="">Selecciona una categoría</option>`;

  let categorias = await obtenerCategorys(); 

  categorias.forEach((categoria) => { 
    selectCategorias.innerHTML += `<option value="${categoria.nombre_categoria}">${categoria.nombre_categoria}</option>`;
  });

  formularioUpdate.addEventListener("submit", async (e) => {
    e.preventDefault(); 
  
    const formData = new FormData(formularioUpdate); 

    if (!validarFormularioProductoUpdate()) {
      return; // Detener si hay errores
    }
   
    try {  
      const response = await fetch(`http://localhost:1200/actualizar-productos/${id}`, {
        method: "PUT",
        body: formData,
      }); 

      if (!response.ok) {
        throw new Error("Error al enviar los datos");
      }

      Swal.fire({
        title: "Éxito",
        text: "Producto actualizado correctamente",
        icon: "success",
        confirmButtonText: "OK",
      });

      formularioUpdate.reset(); 
      setTimeout(() => window.location.reload(), 2000);

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


 async function  eliminarProductoSinVentas(id) { 
  const botonConfirmacion=document.getElementById("boton-confirmacion-borrar")

      botonConfirmacion.addEventListener('click',async()=>{ 

        console.log('se confirmooo el:', id)  

        try {  


          const response = await fetch(`http://localhost:1200/borrar-productos/${id}`, {
            method: "DELETE",
         
          }); 
      
          console.log(response)
      
          if (!response.ok) {
            throw new Error("Error al enviar los datos");
          }
    
          Swal.fire({
            title: "Éxito",
            text: "Producto eliminado correctamente",
            icon: "success",
            confirmButtonText: "OK",
          }).then(() => {
            // Cerrar el modal después del mensaje de éxito
            const modalElement = document.getElementById("confirmModal");
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            modalInstance.hide();
          });

          setTimeout(() => { 
            window.location.reload()
            
          }, 2000);
    
  
           const datos=response.json() 
           console.log(datos.eliminado) 

           
    
     
        } catch (err) {
          Swal.fire({
            title: "Error",
            text: err.message,
            icon: "error",
            confirmButtonText: "Intenta de nuevo",
          });
        }  
      



      })

    

  
 }










