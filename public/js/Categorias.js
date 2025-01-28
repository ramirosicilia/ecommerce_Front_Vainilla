
let btnEditar=[] 



document.getElementById("clearButton").addEventListener("click", () => {
    const inputID = document.getElementById("searchCategory");
    console.log(inputID);
    inputID.value = "";
});



const btnBuscar = document.getElementById("searchButton");
const cuerpocategoria = document.getElementById("cuerpo-categorias");

// Función para eliminar una fila específica
function eliminar(fila) {
    fila.remove(); // Elimina solo la fila específica
}
 
document.addEventListener("DOMContentLoaded", () => {
    restaurarEstados();
}); 


btnBuscar.addEventListener("click", async (e) => {
    e.preventDefault();

    const valorInputID = document.getElementById("searchCategory").value.trim();

    try {
        const response = await fetch("http://localhost:1200/obtener-categorias");

        if (!response.ok) {
            throw new Error("No se obtuvo la data");
        }

        const dataCategory = await response.json();
        console.log(dataCategory);

        // Obtener categorías locales desde localStorage
        const categoriasLocales = JSON.parse(localStorage.getItem("category")) || [];
        console.log("Categorías locales:", categoriasLocales);

        // Conjunto para almacenar nombres únicos de categorías
        const categoriasUnicas = new Set();

        // Agregar nombres únicos desde dataCategory
        dataCategory.forEach((category) => {
            if (category.categorias && category.categorias.nombre_categoria) {
                categoriasUnicas.add(category.categorias.nombre_categoria);
            }
        });

        // Agregar nombres únicos desde categoriasLocales
        categoriasLocales.forEach((categoria) => categoriasUnicas.add(categoria.categoria));

        let hayCoincidencias = false;

        // Recorrer las categorías combinadas para buscar coincidencias
        [...dataCategory, ...categoriasLocales].forEach((category) => {
            const categoriaNombre = category.categoria?.toLowerCase() || category.categorias?.nombre_categoria?.toLowerCase();
            const categoriaID = category.categoria_id || category.id; // Usar el ID según la fuente

            if (categoriaNombre === valorInputID.toLowerCase()) {
                hayCoincidencias = true;

                // Verificar si la categoría ya está en la tabla
                const yaExiste = [...cuerpocategoria.querySelectorAll("tr")].some(
                    (fila) => fila.querySelector("td:nth-child(2)").innerText.toLowerCase() === categoriaNombre
                );

                if (!yaExiste) {
                    // Crear una nueva fila para la tabla
                    const fila = document.createElement("tr");

                    fila.innerHTML = `
                        <td><input type="checkbox" class="form-check-input select-category" data-id="${categoriaID}"></td>
                        <td>${categoriaNombre}</td>
                        <td>
                            <button class="btn btn-warning btn-sm btn__editar" data-bs-toggle="modal" data-bs-target="#editCategoryModal">
                                <i class="fas fa-edit"></i> Editar
                            </button>
                            <button class="btn btn-danger btn-sm btn-eliminar btn__borrar" data-bs-toggle="modal" data-bs-target="#deleteCategoryModal">
                                <i class="fas fa-trash"></i> Eliminar
                            </button>
                        </td>
                    `;

                    // Agregar la fila al cuerpo de la tabla
                    cuerpocategoria.appendChild(fila);

                    // Manejar el evento del checkbox
                    const checkbox = fila.querySelector(".select-category");
                    checkbox.addEventListener("change", () => {
                        funcionChequeado(checkbox, categoriaNombre, fila);
                    });

                    console.log("ID agregado:", categoriaID);

                    // Actualizar botones de edición y eliminación
                    btnEditar = [...document.querySelectorAll(".btn__editar")];

                    const btnEliminar = fila.querySelector(".btn-eliminar");
                    btnEliminar.addEventListener("click", () => {
                        eliminarCategoria(categoriaID, categoriaNombre, fila);
                    });

                    // Llamadas a funciones adicionales
                    updateCategoria(categoriaNombre);

                    // Restaurar estado del checkbox y fila
                    restaurarEstado(categoriaNombre, checkbox, fila,);
                }
            }
        });

        // Mostrar alerta si no hay coincidencias
        if (!hayCoincidencias) {
            Swal.fire({
                title: "¡La Categoria no Existe!",
                icon: "error",
                confirmButtonText: "Intenta de nuevo",
            });
        }
    } catch (err) {
        console.log("Error:", err.message);
    }
});



 function guardarEstado(categoriaNombre, check, fila,activo) {
    const estado = {
        checked: check.checked,
        tieneClase: fila.classList.contains("table-danger"),
        activo:activo
    };
    localStorage.setItem(categoriaNombre, JSON.stringify(estado)); 
    
}

 function restaurarEstados() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"][data-id]');

    checkboxes.forEach((checkbox) => {
        const categoriaNombre = checkbox.getAttribute("data-id");
        const fila = checkbox.closest("tr");
        restaurarEstado(categoriaNombre, checkbox, fila);
    });
}

export function restaurarEstado(categoriaNombre, check, fila) {
    const estadoGuardado = JSON.parse(localStorage.getItem(categoriaNombre));

    if (estadoGuardado) {
        check.checked = estadoGuardado.checked;
        if (estadoGuardado.tieneClase) {
            fila.classList.add("table-danger");
            fila.style.opacity = "0.4";
        } else {
            fila.classList.remove("table-danger");
            fila.style.opacity = "1";
        }
    }
}

export async function funcionChequeado(check, categoriaNombre, fila) {
    const activo = check.checked;

    try {
        const response = await fetch("http://localhost:1200/desactivar-categoria", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                categoria: categoriaNombre,
                activo: !activo,
            }),
        });

        if (!response.ok) {
            throw new Error("Error al actualizar la categoría");
        }

        const result = await response.json();

        if (result.desactivar === false) {
            fila.style.opacity = ".4";
            fila.classList.add("table-danger");
            check.checked = true;
        } else {
            fila.style.opacity = "1";
            fila.classList.remove("table-danger");
            check.checked = false;
        }
        let categoriasLocales = JSON.parse(localStorage.getItem("category")) || [];
        const categoriaExistente = categoriasLocales.find(c => c.categoria === categoriaNombre);
        
        if (categoriaExistente) {
            categoriaExistente.activo = !activo;  // Cambia el estado de 'activo'
        } else {
            // Si no se encuentra la categoría, puedes agregarla
            categoriasLocales.push({ categoria: categoriaNombre, activo: !activo });
        }
        
        // Guardar el array actualizado en localStorage
        localStorage.setItem('category', JSON.stringify(categoriasLocales));
        
        guardarEstado(categoriaNombre, check, fila, activo);

        Swal.fire({
            title: activo
                ? "Categoría desactivada correctamente"
                : "Categoría activada correctamente",
            icon: "success",
            confirmButtonText: "Entendido",
        });
    } catch (error) {
        console.error("Error al realizar la actualización:", error);
        check.checked = !activo; // Revertir el estado en caso de error
        guardarEstado(categoriaNombre, check, fila);
    }
}

   export function updateCategoria(name){   

        let formularioActualizar=document.getElementById('formulario-categoria-update') 

        formularioActualizar.addEventListener("submit",async(e)=>{ 
            e.preventDefault() 

            let nuevoNombre=document.getElementById("newCategoryName").value

           try{ 

            const response= await fetch(`http://localhost:1200/actualizar-categoria/${name}`,{
                method:"put",
                headers:{
                    "Content-Type":"application/json"
                } ,
                body:JSON.stringify({nuevoNombre})
            }) 

             console.log(response) 

             const data= await response.json() 
             console.log(data) 

             let categoriasLocales = JSON.parse(localStorage.getItem("category")) || []; 
             console.log(categoriasLocales) 

             const categoriaExistente = categoriasLocales.find(category => category.categoria === name);

             if (categoriaExistente) {
                // Remover la categoría antigua
                categoriasLocales = categoriasLocales.filter(category => category.categoria !== name);

                // Agregar la categoría actualizada con el nuevo nombre y conservar el estado de `activo`
                categoriasLocales.push({ 
                    categoria: nuevoNombre, 
                    activo: categoriaExistente.activo || true // Conservar el valor de `activo` o asignar `true` si no existe
                }); 
            } else {
                // Si no existía en `localStorage`, agregarla con el nuevo nombre y `activo: true`
                categoriasLocales.push({ 
                    categoria: nuevoNombre, 
                    activo: true 
                });
            }
             localStorage.setItem("category", JSON.stringify(categoriasLocales));  
             const modal = bootstrap.Modal.getInstance(document.getElementById('editCategoryModal'));
             modal.hide();
                 
             setTimeout(() => {
                window.location.reload();
                
             }, 1000);
            

           } 

           

           catch(err){
            console.log(message.err)
           }

        }) 

        
   
    } 

    
   export function eliminarCategoria(id, nombre, fila) {
        const botonEliminar = document.getElementById("confirmDelete");
    
        if (!botonEliminar) {
            console.error("Botón de confirmación no encontrado");
            return;
        }
    
        botonEliminar.addEventListener("click", async () => {
            try {
                const response = await fetch(`http://localhost:1200/eliminar-categoria/${id}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
    
                const data = await response.json();
    
                if (response.ok) {
                    console.log("Categoría eliminada en el servidor:", id);
    
                    // Eliminar del localStorage
                    let categorias = JSON.parse(localStorage.getItem("category")) || [];
                    categorias = categorias.filter((categoria) => categoria.id !== id);  // Usar id en lugar de nombre
                    localStorage.setItem("category", JSON.stringify(categorias));
    
                    console.log("Categoría eliminada del localStorage:", nombre);
    
                    // Eliminar la fila del DOM
                    fila.remove();
    
                    // Cerrar el modal programáticamente después de eliminar
                    const modal = bootstrap.Modal.getInstance(document.getElementById('deleteCategoryModal'));
                    if (modal) modal.hide();

                    // Verificar si quedan categorías en la tabla
                    
                } else {
                    console.error("No se pudo eliminar la categoría:", data.message);
                }
            } catch (err) {
                console.error("Error al intentar eliminar la categoría:", err);
            }
        });
    }
    