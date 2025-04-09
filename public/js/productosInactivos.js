import { desactivadoLogicoProductos } from "./registroProductos.js"; 
import { obtenerProductos } from "./api/productos.js";
import { obtenerCategorys } from "./api/productos.js";
import {mostrarProductosAdmin} from "./mostrarProductosAdmin.js";

const btnInactivar=document.getElementById("mostrarInactivosBtn") 
let entrada=true

console.log(btnInactivar) 

btnInactivar.addEventListener('click',productosInactivos) 


async function productosInactivos() {
    const tBody = document.getElementById("cuerpo-productos");
    const productos = await obtenerProductos();
    const categorias = await obtenerCategorys();
    const categoriasActivas = categorias.filter(cat => cat.activo === true);

    // Alternar estado
    if (entrada) {
        btnInactivar.textContent = "Mostrar activos";
        const productosInactivos = productos.filter(p => p.activacion !== true);

        if (productosInactivos.length > 0) {
            tBody.innerHTML = "";

            productosInactivos.forEach(producto => {
                const nombreCategoria = categoriasActivas.find(c => c.categoria_id === producto.categoria_id)?.nombre_categoria;

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

                tBody.innerHTML += `
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
                            <button class="btn btn-primary btn-sm btn-editar" data-id="${producto.producto_id}" data-talle-id="${talleIds}" data-color-id="${colorIds}" data-bs-toggle="modal" data-bs-target="#editProductModal"><i class="fas fa-edit"></i> Editar</button>
                            <button class="btn btn-danger btn-sm btn-eliminar" data-id="${producto.producto_id}" data-talle-id="${talleIds}" data-color-id="${colorIds}" data-bs-toggle="modal" data-bs-target="#exampleModal"><i class="fas fa-trash"></i> Eliminar</button>
                        </td>
                    </tr>
                `;
            });

            const checkBox = [...document.querySelectorAll(".check")];
            checkBox.forEach((check) => {
                check.addEventListener("change", (e) => {
                    if (!e.target.checked) {
                        const fila = e.target.closest("tr");
                        if (fila) fila.remove();
                    }
                });
            });

            desactivadoLogicoProductos(checkBox);
        }

    } else {
        // Mostrar activos otra vez
        btnInactivar.textContent = "Mostrar inactivos";
        mostrarProductosAdmin(); // <- reutilizamos la lógica ya perfecta
    }

    entrada = !entrada;
}
