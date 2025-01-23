
let btnEditar=[] 
let btnEliminar=[] 
let categoriasUnicas
let dataCategory=[] 
let checkbox

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

        dataCategory = await response.json();
        console.log(dataCategory);

        let categoriasLocales = JSON.parse(localStorage.getItem("category")) || [];
        console.log("Categorías locales:", categoriasLocales);

        categoriasUnicas = new Set();
        dataCategory.forEach((category) => categoriasUnicas.add(category.categorias.nombre_categoria));
        categoriasLocales.forEach((categoria) => categoriasUnicas.add(categoria.categoria));

        cuerpocategoria.innerHTML = "";

        let hayCoincidencias = false;

        categoriasUnicas.forEach((categoriaNombre) => {
            if (categoriaNombre === valorInputID.toLowerCase()) {
                hayCoincidencias = true;

                const fila = document.createElement("tr");

                fila.innerHTML = `
                    <td><input type="checkbox" class="form-check-input select-category" data-id="${categoriaNombre}"></td>
                    <td>${categoriaNombre}</td>
                    <td>
                        <button class="btn btn-warning btn-sm btn__editar" data-bs-toggle="modal" data-bs-target="#editCategoryModal">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        <button class="btn btn-danger btn-sm btn-eliminar btn__borrar">
                            <i class="fas fa-trash"></i> Eliminar
                        </button>
                    </td>
                `;

                cuerpocategoria.appendChild(fila);

                const checkbox = fila.querySelector(".select-category");
                checkbox.addEventListener("change", () => {
                    funcionChequeado(checkbox, categoriaNombre, fila);
                });

                btnEditar = [...document.querySelectorAll(".btn__editar")];
                btnEliminar = [...document.querySelectorAll(".btn__borrar")];

                updateCategoria(categoriaNombre);
                eliminarCategoria(btnEliminar, categoriaNombre, fila);

                // Restaurar estado del checkbox y fila
                restaurarEstado(categoriaNombre, checkbox, fila);
            }
        });

        if (!hayCoincidencias) {
            Swal.fire({
                title: "¡La Categoria no Existe!",
                icon: "error",
                confirmButtonText: "Intenta de nuevo",
            });
        }
    } catch (err) {
        console.log(err.message);
    }
});

function guardarEstado(categoriaNombre, check, fila) {
    const estado = {
        checked: check.checked,
        tieneClase: fila.classList.contains("table-danger")
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

function restaurarEstado(categoriaNombre, check, fila) {
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

async function funcionChequeado(check, categoriaNombre, fila) {
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

        guardarEstado(categoriaNombre, check, fila);

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

    function updateCategoria(name){   

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

             setTimeout(() => {
                window.location.reload();
                
            }, 1000);
            

           } 

           

           catch(err){
            console.log(message.err)
           }

        }) 

        

   
    }



 // Función para eliminar categoría
function eliminarCategoria(botones, nombre, fila) {
    botones.forEach(btn => {
        btn.addEventListener('click', async () => {
            try {
                const response = await fetch("http://localhost:1200/eliminar-categoria", {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ nombre }),
                });

                const data = await response.json();

                if (response.ok) {
                    console.log("Categoría eliminada en el servidor:", nombre);

                    // Eliminar del localStorage
                    let categorias = JSON.parse(localStorage.getItem("category")) || [];
                    categorias = categorias.filter(categoria => categoria.categoria !== nombre);
                    localStorage.setItem("category", JSON.stringify(categorias));

                    console.log("Categoría eliminada del localStorage:", nombre);

                    // Eliminar la fila del DOM
                    fila.remove();
                } else {
                    console.error("No se pudo eliminar la categoría:", data.message);
                }
            } catch (err) {
                console.log('No se eliminó la categoría', err);
            }
        });
    });
}