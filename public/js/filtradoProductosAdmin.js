import {desactivadoLogicoProductos} from "./registroProductos.js";
import { activarBotones } from "./mostrarProductosAdmin.js";
import { obtenerProductos } from "./api/productos.js";
import { obtenerCategorys } from "./api/productos.js";



const selector=document.getElementById("categoria-select-products"); 

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



const tbody = document.querySelector("#cuerpo-productos");


selector.addEventListener("change", async (e) => {
   
    const categoriaSeleccionada = e.target.value;
    const productos = await obtenerProductos();
    const categorias = await obtenerCategorys();

    let productosActivos = productos.filter(producto => producto?.activacion === true);
    let categoriasActivas = categorias.filter(cat => cat?.activo === true);

    let productosFiltrados = productosActivos.filter(producto =>
        categoriasActivas.some(cat => cat.categoria_id === producto.categoria_id)
    );

    // Si no hay categoría seleccionada, mostrar todos
    if (categoriaSeleccionada === "") {
        tbody.innerHTML = "";

        productosFiltrados.forEach(producto => {
            const categoriaProducto = categoriasActivas.find(cat => cat.categoria_id === producto.categoria_id);
            const nombreCategoria = categoriaProducto?.nombre_categoria || "Sin categoría";

            const stockTotal = producto.productos_variantes?.reduce((acc, variante) => acc + (variante.stock || 0), 0) || 0;
            const imagenUrl = producto.imagenes[0]?.urls?.[0];

            const talles = producto.productos_variantes
                .map(v => v.talles?.insertar_talle)
                .filter(Boolean)
                .join(", ") || "";

            const colores = producto.productos_variantes
                .map(v => v.colores?.insertar_color)
                .filter(Boolean)
                .join(", ") || "";

            const talleIds = producto.productos_variantes
                .map(v => v.talles?.talle_id)
                .filter(Boolean)
                .join(", ") || "N/A";

            const colorIds = producto.productos_variantes
                .map(v => v.colores?.color_id)
                .filter(Boolean)
                .join(", ") || "N/A";

            tbody.innerHTML += `
                <tr>    
                    <td>
                        <input type="checkbox" class="form-check-input pause-checkbox check" data-id="${producto.producto_id}">
                    </td>
                    <td><div class="contenido-celda"><img src="${imagenUrl}" alt="Producto" style="max-width: 50px;"> ${producto.nombre_producto || ""}</div></td>
                    <td><div class="contenido-celda">${producto.precio === null ? "" : "$ " + producto.precio}</div></td>
                    <td><div class="contenido-celda">${nombreCategoria}</div></td>
                    <td><div class="contenido-celda">${stockTotal}</div></td>
                    <td><div class="contenido-celda">${talles}</div></td>
                    <td><div class="contenido-celda">${colores}</div></td>
                    <td class="celda-botones">
                        <button class="btn btn-primary btn-sm btn-editar" data-id="${producto.producto_id}" data-talle-id="${talleIds}" data-color-id="${colorIds}" data-bs-toggle="modal" data-bs-target="#editProductModal">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        <button class="btn btn-danger btn-sm btn-eliminar" data-id="${producto.producto_id}" data-talle-id="${talleIds}" data-color-id="${colorIds}" data-bs-toggle="modal" data-bs-target="#exampleModal">
                            <i class="fas fa-trash"></i> Eliminar
                        </button>
                    </td>
                </tr>
            `;
        });

        const botonesEditar = [...document.querySelectorAll(".btn-editar")];
        const botonesEliminar = [...document.querySelectorAll(".btn-eliminar")];
        const checkBox = [...document.querySelectorAll(".check")];

        activarBotones(botonesEditar, botonesEliminar);
        desactivadoLogicoProductos(checkBox);
        return;
    }

    tbody.innerHTML = "";

    // Buscar categoría seleccionada
    const categoriaObj = categoriasActivas.find(cat => cat.nombre_categoria === categoriaSeleccionada);

    if (categoriaObj) {
        let productosCategoria = productosFiltrados.filter(prod => prod.categoria_id === categoriaObj.categoria_id);

        productosCategoria.forEach(producto => {
            const stockTotal = producto.productos_variantes?.reduce((acc, variante) => acc + (variante.stock || 0), 0) || 0;
            const imagenUrl = producto.imagenes[0]?.urls?.[0];

            const talles = producto.productos_variantes
                .map(v => v.talles?.insertar_talle)
                .filter(Boolean)
                .join(", ") || "";

            const colores = producto.productos_variantes
                .map(v => v.colores?.insertar_color)
                .filter(Boolean)
                .join(", ") || "";

            const talleIds = producto.productos_variantes
                .map(v => v.talles?.talle_id)
                .filter(Boolean)
                .join(", ") || "N/A";

            const colorIds = producto.productos_variantes
                .map(v => v.colores?.color_id)
                .filter(Boolean)
                .join(", ") || "N/A";

            tbody.innerHTML += `
                <tr>    
                    <td>
                        <input type="checkbox" class="form-check-input pause-checkbox check" data-id="${producto.producto_id}">
                    </td>
                    <td><div class="contenido-celda"><img src="${imagenUrl}" alt="Producto" style="max-width: 50px;"> ${producto.nombre_producto || ""}</div></td>
                    <td><div class="contenido-celda">${producto.precio === null ? "" : "$ " + producto.precio}</div></td>
                    <td><div class="contenido-celda">${categoriaSeleccionada}</div></td>
                    <td><div class="contenido-celda">${stockTotal}</div></td>
                    <td><div class="contenido-celda">${talles}</div></td>
                    <td><div class="contenido-celda">${colores}</div></td>
                    <td class="celda-botones">
                        <button class="btn btn-primary btn-sm btn-editar" data-id="${producto.producto_id}" data-talle-id="${talleIds}" data-color-id="${colorIds}" data-bs-toggle="modal" data-bs-target="#editProductModal">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        <button class="btn btn-danger btn-sm btn-eliminar" data-id="${producto.producto_id}" data-talle-id="${talleIds}" data-color-id="${colorIds}" data-bs-toggle="modal" data-bs-target="#exampleModal">
                            <i class="fas fa-trash"></i> Eliminar
                        </button>
                    </td>
                </tr>
            `;
        });

        const botonesEditar = [...document.querySelectorAll(".btn-editar")];
        const botonesEliminar = [...document.querySelectorAll(".btn-eliminar")];
        const checkBox = [...document.querySelectorAll(".check")];

        activarBotones(botonesEditar, botonesEliminar);
        desactivadoLogicoProductos(checkBox);
    }
});
