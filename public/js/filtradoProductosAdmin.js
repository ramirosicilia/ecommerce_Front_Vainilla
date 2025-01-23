import { pedirProductos ,desactivadoLogicoProductos,activarBotones} from "./registroProductos.js";



const selector=document.getElementById("categoria-select-products"); 
const cuerpo=document.getElementById("cuerpo-productos");


async function filtrarProductos(){ 

    const productos= await pedirProductos() 
    console.log(productos)
    
  
    let categoriasStorage=JSON.parse(localStorage.getItem("category")) || [];  

    let categoriasUnicas = productos.reduce((resultado, producto) => {
        if (producto.categorias && typeof producto.categorias === "object") {
            const categoria = producto.categorias.nombre_categoria; // Extrae el nombre de la categoría
            const activo = producto.categorias.activo; // Extrae el estado activo
    
            // Verifica si ya existe en el resultado antes de agregarlo
            if (!resultado.some(cat => cat.categoria === categoria)) {
                resultado.push({ categoria, activo });
            }
        }
        return resultado;
    }, []);
    
    console.log(categoriasUnicas);
    
    

 
    let categoriasDB=categoriasStorage.map(categoria=>({
        categoria:categoria.categoria,
        activo:categoria.activo
    }))  

    

    let categoriasCombinadas=[...categoriasUnicas,...categoriasDB] 
    console.log(categoriasCombinadas)
    
    

  
     if(categoriasCombinadas.length>0 ){
        categoriasCombinadas.forEach(categoria=>{ 
            if(categoria.activo===true){ 
                selector.innerHTML+=`<option value="${categoria.categoria}">${categoria.categoria}</option>`
            }
          
        })
     }


 
    
    selector.addEventListener("change",(e)=>{  

        const categoria=e.target.value 
       cuerpo.innerHTML=""
    
        let filtradoProductos=productos.filter(producto=>producto.categorias.nombre_categoria===categoria) 
        console.log(filtradoProductos)
        let filtradoCategorias=categoriasStorage.filter(categoria=>categoria.categoria===categoria)
        
     
            if(filtradoProductos.length>0 || filtradoCategorias.length>0){ 
                cuerpo.innerHTML="" 
                filtradoProductos.forEach(producto=>{ 
                    cuerpo.innerHTML+=`
                    <tr>    
                            <td>
                                <input type="checkbox" class="form-check-input pause-checkbox check" data-id="${producto.producto_id}">
                            </td>
                            <td><div class="contenido-celda"><img src="${producto.imagenes}" alt="Producto" style="max-width: 50px;"> ${producto.nombre_producto}</div></td>
                            <td><div class="contenido-celda">${producto.precio}</div></td>
                            <td><div class="contenido-celda">${producto.categorias.nombre_categoria}</div></td>
                            <td><div class="contenido-celda">${producto.stock}</div></td>
                            <td class="celda-botones">
                                <button class="btn btn-primary btn-sm btn-editar" data-bs-toggle="modal" data-bs-target="#editProductModal"><i class="fas fa-edit"></i> Editar</button>
                                <button class="btn btn-danger btn-sm btn-eliminar" data-bs-toggle="modal" data-bs-target="#confirmModal"><i class="fas fa-trash"></i> Eliminar</button>
                            </td>
                    </tr>
                    
                    
                    `
                  
                }) 

                      const botonesEditar = [...document.querySelectorAll(".btn-editar")];
                      const botonesEliminar = [...document.querySelectorAll(".btn-eliminar")]; 
                      const checkBox=[...document.querySelectorAll(".check")] 
                
                
                
                      activarBotones(botonesEditar,botonesEliminar);  
                
                      desactivadoLogicoProductos(checkBox)
                  

            }
     
     
     }); 
     

} 

filtrarProductos()







   