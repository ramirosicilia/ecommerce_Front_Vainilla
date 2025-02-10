import { pedirProductos,desactivadoLogicoProductos } from "./registroProductos.js"; 
import { obtenerCategorys } from "./api/productos.js";

const btnInactivar=document.getElementById("mostrarInactivosBtn") 
let entrada=true

console.log(btnInactivar) 

btnInactivar.addEventListener('click',productosInactivos) 


async function productosInactivos() { 

    const tBody=document.getElementById("productos") 
    

    const recibirProductos=await pedirProductos() 

    const recibirCategorias=await obtenerCategorys() 

    const categoriasActivas=recibirCategorias.filter(category=>category.activo===true) 



     

       if(entrada){   

        const filaProducto = document.querySelector("tr");
        console.log(filaProducto)
       
        tBody.innerHTML=""
        btnInactivar.textContent="Mostrar activos"
        let productosInactivos=recibirProductos.filter(activo=>activo.activacion!=true) 

        if(productosInactivos.length>0){  

    
            console.log(productosInactivos)
            productosInactivos.forEach(producto => { 
                const nombreCategoria=categoriasActivas.find(category=>category.categoria_id===producto.categoria_id)?.nombre_categoria
                 
                tBody.innerHTML += `
                    <tr>    
                        <td>
                            <input type="checkbox" class="form-check-input pause-checkbox check" data-id="${producto.producto_id}">
                        </td>
                        <td><div class="contenido-celda"><img src="${producto.imagenes}" alt="Producto" style="max-width: 50px;"> ${producto.nombre_producto}</div></td>
                        <td><div class="contenido-celda">${producto.precio}</div></td>
                    <td><div class="contenido-celda">${nombreCategoria}</div></td>
                        <td><div class="contenido-celda">${producto.stock}</div></td>
                        <td class="celda-botones">
                            <button class="btn btn-primary btn-sm btn-editar" data-bs-toggle="modal" data-bs-target="#editProductModal"><i class="fas fa-edit"></i> Editar</button>
                            <button class="btn btn-danger btn-sm btn-eliminar" data-bs-toggle="modal" data-bs-target="#confirmModal"><i class="fas fa-trash"></i> Eliminar</button>
                        </td>
                    </tr>
                `;      
                
            }); 

            const checkBox = [...document.querySelectorAll(".check")];

            checkBox.forEach((check) => {
                check.addEventListener("change", (e) => {
                    if (!e.target.checked) {
                        // Encuentra la fila asociada al checkbox
                        const fila = e.target.closest("tr"); // Obtiene el elemento <tr> más cercano
                        if (fila) {
                            fila.remove(); // Elimina solo la fila asociada
                        }
                    }
                });
            });
            
              desactivadoLogicoProductos(checkBox)
             
        }

          entrada=true


       } 

       else{  

       
          tBody.innerHTML="" 
         
           
         
           btnInactivar.textContent="Mostrar Inactivos"

        let productosActivos=recibirProductos.filter(activo=>activo.activacion===true) 
        console.log(productosActivos)

        
            productosActivos.forEach(producto => { 
                const nombreCategoria=categoriasActivas.find(category=>category.categoria_id===producto.categoria_id)?.nombre_categoria
                tBody.innerHTML += `
                    <tr>    
                        <td>
                            <input type="checkbox" class="form-check-input pause-checkbox check" data-id="${producto.producto_id}">
                        </td>
                        <td><div class="contenido-celda"><img src="${producto.imagenes}" alt="Producto" style="max-width: 50px;"> ${producto.nombre_producto}</div></td>
                        <td><div class="contenido-celda">${producto.precio}</div></td>
                        <td><div class="contenido-celda">${nombreCategoria}</div></td>
                        <td><div class="contenido-celda">${producto.stock}</div></td>
                        <td class="celda-botones">
                            <button class="btn btn-primary btn-sm btn-editar" data-bs-toggle="modal" data-bs-target="#editProductModal"><i class="fas fa-edit"></i> Editar</button>
                            <button class="btn btn-danger btn-sm btn-eliminar" data-bs-toggle="modal" data-bs-target="#confirmModal"><i class="fas fa-trash"></i> Eliminar</button>
                        </td>
                    </tr>
                `;     
            });
       
             const checkBox=[...document.querySelectorAll(".check")]  
             checkBox.forEach((check) => {
                check.addEventListener("change", (e) => { 
                    e.preventDefault()
                    if (e.target.checked) {
                        // Encuentra la fila asociada al checkbox
                        const fila = e.target.closest("tr"); // Obtiene el elemento <tr> más cercano
                        if (fila) {
                            fila.remove(); // Elimina solo la fila asociada
                        }
                    }
                });
            }); 

             console.log(checkBox)
             desactivadoLogicoProductos(checkBox)
           
               entrada=false

       }

    entrada=!entrada
   
}