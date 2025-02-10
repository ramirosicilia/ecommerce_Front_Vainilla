import { obtenerCategorys } from "./api/productos.js";



let btnEditar = [];




document.getElementById("clearButton")?.addEventListener("click", () => {
    const inputID = document.getElementById("searchCategory");
    inputID.value = "";
});

const btnBuscar = document.getElementById("searchButton");
const cuerpocategoria = document.getElementById("cuerpo-categorias");

function eliminar(fila) {
    fila.remove(); 
}

document.addEventListener("DOMContentLoaded", () => {
    restaurarEstados();
});



btnBuscar && cuerpocategoria 
    ? btnBuscar?.addEventListener("click", async() => {
      await recibirCategorys()
    }) 
    : console.warn("Uno o más elementos no encontrados");

async function recibirCategorys() {
    const categorys = await obtenerCategorys();
    console.log('categorias:', categorys);

    const valorInputID = document.getElementById("searchCategory").value.trim();

   let hayCoincidencias = false;

    if (categorys.length > 0) {
        categorys.forEach(categoria => {
            if (categoria.nombre_categoria === valorInputID) {
                hayCoincidencias = true; 

                const fila = document.createElement("tr");

                fila.innerHTML = `
                    <td><input type="checkbox" class="form-check-input select-category" data-id="${categoria.categoria_id}"></td>
                    <td>${categoria.nombre_categoria}</td>
                    <td>
                        <button class="btn btn-warning btn-sm btn__editar" data-bs-toggle="modal" data-bs-target="#editCategoryModal">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        <button class="btn btn-danger btn-sm btn-eliminar btn__borrar" data-bs-toggle="modal" data-bs-target="#deleteCategoryModal">
                            <i class="fas fa-trash"></i> Eliminar
                        </button>
                    </td>
                `;

                cuerpocategoria.appendChild(fila);

                const checkbox = fila.querySelector(".select-category");
                checkbox.addEventListener("change", () => {
                    funcionChequeado(checkbox, categoria.nombre_categoria, fila);
                });

                btnEditar = [...document.querySelectorAll(".btn__editar")];

                const btnEliminar = fila.querySelector(".btn-eliminar");
                btnEliminar.addEventListener("click", () => {
                    eliminarCategoria(categoria.categoria_id, categoria.nombre_categoria, fila);
                });

                updateCategoria(categoria.nombre_categoria);

                restaurarEstado(categoria.nombre_categoria, checkbox, fila);
            }
        });
    }

    if (!hayCoincidencias && valorInputID !== '') {
        Swal.fire({
            title: "¡La Categoria no Existe!",
            icon: "error",
            confirmButtonText: "Intenta de nuevo",
        });
    }
}

function guardarEstado(categoriaNombre, check, fila, activo) {
    const estado = {
        checked: check.checked,
        tieneClase: fila.classList.contains("table-danger"),
        activo: activo
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
            categoriaExistente.activo = !activo;
        } else {
            categoriasLocales.push({ categoria: categoriaNombre, activo: !activo });
        }

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
        check.checked = !activo;
        guardarEstado(categoriaNombre, check, fila);
    }
}

export function updateCategoria(name) {
    async function actualizarCategoria(nuevoNombre) {
        try {
            const response = await fetch(`http://localhost:1200/actualizar-categoria/${name}`, {
                method: "put",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ nuevoNombre })
            });

            const data = await response.json();

            if (response.ok) {
               

                const modal = bootstrap.Modal.getInstance(document.getElementById('editCategoryModal'));
                modal.hide();

                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                console.error("No se pudo actualizar la categoría");
            }

        } catch (err) {
            console.log(err.message);
        }
    }

    document.getElementById('formulario-categoria-update').addEventListener("submit", async (e) => {
        e.preventDefault();

        const nuevoNombre = document.getElementById("newCategoryName").value;
        actualizarCategoria(nuevoNombre);
    });
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
               
              localStorage.clear()

                fila.remove();

                const modal = bootstrap.Modal.getInstance(document.getElementById('deleteCategoryModal'));
                if (modal) modal.hide();

            } else {
                console.error("No se pudo eliminar la categoría:", data.message);
            }
        } catch (err) {
            console.error("Error al intentar eliminar la categoría:", err);
        }
    });
}
