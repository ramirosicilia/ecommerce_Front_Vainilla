

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

        // Recuperar categorías locales
        let categoriasLocales = JSON.parse(localStorage.getItem("category")) || [];
        console.log("Categorías locales:", categoriasLocales);

        // Crear un Set para mantener categorías únicas
        categoriasUnicas = new Set();

        // Agregar categorías de la base de datos al Set
        dataCategory.forEach((category) => {
            categoriasUnicas.add(category.categorias.nombre_categoria);
        });

        // Agregar categorías del localStorage al Set
        categoriasLocales.forEach((categoria) => {
            categoriasUnicas.add(categoria.categoria);
        });

        // Limpia el contenido previo del cuerpo de la tabla
        cuerpocategoria.innerHTML = "";

        // Indicador para verificar si hubo coincidencias
        let hayCoincidencias = false;

        // Verificar coincidencias con el valor del input y mostrar resultados únicos
        categoriasUnicas.forEach((categoriaNombre) => {
            if (categoriaNombre === valorInputID.toLowerCase()) {
                hayCoincidencias = true;

                // Crear una fila para agregarla al cuerpo de la tabla
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

                
                // Añadir la fila al cuerpo de la tabla
                cuerpocategoria.appendChild(fila);

                // Agregar eventos al checkbox
                const checkbox = fila.querySelector(".select-category");
                checkbox.addEventListener("change", () => {
                    funcionChequeado(checkbox, categoriaNombre,fila);
                });

                btnEditar = [...document.querySelectorAll(".btn__editar")];
                btnEliminar = [...document.querySelectorAll(".btn__borrar")];

                updateCategoria(categoriaNombre);
                eliminarCategoria(btnEliminar, categoriaNombre, fila);
            }
        });

        // Si no hay coincidencias, muestra un mensaje de alerta
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

async function funcionChequeado(check, categoriaNombre,fila) {
    const activo = check.checked;

    console.log(`Estado del checkbox para ${categoriaNombre}: ${activo ? false : true}`);

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


         if(result.desactivar===false){ 
            fila.style.opacity=".4"
            check.checked=true

         } 

         
         if(result.desactivar===true){ 
            fila.style.opacity="1"
            check.checked=false

         }
   
   


        Swal.fire({
            title: activo
                ? "Categoría desactivada correctamente"
                : "Categoría activada correctamente",
            icon: "success",
            confirmButtonText: "Entendido",
        });
    } catch (error) {
        console.error("Error al realizar la actualización:", error);

        Swal.fire({
            title: "Error al actualizar la categoría",
            text: "Inténtalo de nuevo más tarde.",
            icon: "error",
            confirmButtonText: "Entendido",
        });

        // Restaurar el estado del checkbox si ocurrió un error
        check.checked= !activo;
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
