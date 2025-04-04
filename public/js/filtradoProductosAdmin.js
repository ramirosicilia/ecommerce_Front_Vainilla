import {desactivadoLogicoProductos} from "./registroProductos.js";
import { activarBotones } from "./mostrarProductosAdmin.js";
import { obtenerProductos } from "./api/productos.js";
import { obtenerCategorys } from "./api/productos.js";



const selector=document.getElementById("categoria-select-products"); 
const cuerpo=document.getElementById("cuerpo-productos"); 
let productosFiltrados=[]

console.log(selector)

async function filtrarProductos(){ 

    selector.innerHTML=''

    const categorias= await obtenerCategorys()
    console.log(categorias) 

    selector.innerHTML=`<option value="" selected>Todas</option>  ` 

    let categoryFiltradas=categorias.filter(dataCategory=>dataCategory.activo===true)

    if(categoryFiltradas.length>0){
        categoryFiltradas.forEach(categoria=>{
            selector.innerHTML+= `<option value="${categoria.nombre_categoria}">${categoria.nombre_categoria}</option>`
        })
    } 

    const productos = await obtenerProductos();
     productosFiltrados = productos.filter(product => product.activacion === true);
    console.log(productosFiltrados)



}  

filtrarProductos() 




selector.addEventListener("change", async (e) => {    

    let entrada=false
    const categoriaSeleccionada = e.target.value;
    cuerpo.innerHTML = "";

    const categorias = await obtenerCategorys();
    console.log(categorias);
    
    let categoriasFiltradas = categorias.filter(dataCategory => dataCategory.activo === true);
    
    // Buscar la categoría seleccionada
    const categoriaFiltrada = categoriasFiltradas.find(categoria => categoria.nombre_categoria === categoriaSeleccionada);
    
    if (categoriaFiltrada && !entrada) {
        productosFiltrados.forEach(producto => {
            if (producto.categoria_id === categoriaFiltrada.categoria_id) {
                cuerpo.innerHTML += `
                    <tr>    
                        <td>
                            <input type="checkbox" class="form-check-input pause-checkbox check" data-id="${producto.producto_id}">
                        </td>
                        <td>
                            <div class="contenido-celda">
                                <img src="${producto.imagenes}" alt="Producto" style="max-width: 50px;"> 
                                ${producto.nombre_producto}
                            </div>
                        </td>
                        <td><div class="contenido-celda">${producto.precio}</div></td>
                        <td><div class="contenido-celda">${categoriaFiltrada.nombre_categoria}</div></td>
                        <td><div class="contenido-celda">${producto.stock}</div></td>
                        <td class="celda-botones">
                            <button class="btn btn-primary btn-sm btn-editar" data-bs-toggle="modal" data-bs-target="#editProductModal">
                                <i class="fas fa-edit"></i> Editar
                            </button>
                            <button class="btn btn-danger btn-sm btn-eliminar" data-bs-toggle="modal" data-bs-target="#confirmModal">
                                <i class="fas fa-trash"></i> Eliminar
                            </button>
                        </td>
                    </tr>
                `;
            }
        });
    } else {  
        productosFiltrados.forEach(producto => {  
            // Buscar la categoría en `categoriasFiltradas` en lugar de `productosFiltrados`
            const categoriaEncontrada = categoriasFiltradas.find(cat => cat.categoria_id === producto.categoria_id);
            const nombreFiltrado = categoriaEncontrada ? categoriaEncontrada.nombre_categoria : "Categoría desconocida";

            cuerpo.innerHTML += `
                <tr>    
                    <td>
                        <input type="checkbox" class="form-check-input pause-checkbox check" data-id="${producto.producto_id}">
                    </td>
                    <td>
                        <div class="contenido-celda">
                            <img src="${producto.imagenes}" alt="Producto" style="max-width: 50px;"> 
                            ${producto.nombre_producto}
                        </div>
                    </td>
                    <td><div class="contenido-celda">${producto.precio}</div></td>
                    <td><div class="contenido-celda">${nombreFiltrado}</div></td>
                    <td><div class="contenido-celda">${producto.stock}</div></td>
                    <td class="celda-botones">
                        <button class="btn btn-primary btn-sm btn-editar" data-bs-toggle="modal" data-bs-target="#editProductModal">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        <button class="btn btn-danger btn-sm btn-eliminar" data-bs-toggle="modal" data-bs-target="#confirmModal">
                            <i class="fas fa-trash"></i> Eliminar
                        </button>
                    </td>
                </tr>
            `;
        });

        entrada = false;
    }

    const botonesEditar = [...document.querySelectorAll(".btn-editar")];
    const botonesEliminar = [...document.querySelectorAll(".btn-eliminar")]; 
    const checkBox = [...document.querySelectorAll(".check")];

    activarBotones(botonesEditar, botonesEliminar);  
    desactivadoLogicoProductos(checkBox); 

    entrada = !entrada;
});
