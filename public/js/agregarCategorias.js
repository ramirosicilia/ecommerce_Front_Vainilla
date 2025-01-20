
const formularioCategoria = document.getElementById("formulario-categoria-ingreso");
let dataCategory = JSON.parse(localStorage.getItem('category')) || []; // Cargar categorías existentes

// Agregar nueva categoría
formularioCategoria.addEventListener("submit", async (e) => {
    e.preventDefault();

    let categoryValue = document.getElementById("categoryName_new").value;
    console.log("Nueva categoría ingresada:", categoryValue);

    try {
        const response = await fetch("http://localhost:1200/agregar-categorias", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ category: categoryValue }),
        });

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.message}`);
        }

        const data = await response.json();
        console.log("Respuesta del servidor:", data);

        // Recargar categorías desde localStorage
        let categorias = JSON.parse(localStorage.getItem("category")) || [];

        // Asegurarse de que la categoría no esté ya en el localStorage
        if (!categorias.some(c => c.nombre === data[0].nombre_categoria)) {
            categorias.push({ categoria: data[0].nombre_categoria ,activo:data[0].activo});
            console.log("Categorías actualizadas:", categorias);
            localStorage.setItem('category', JSON.stringify(categorias));
        } else {
            console.log("La categoría ya existe en localStorage.");
        }

    } catch (err) {
        Swal.fire({
            title: 'La Categoria ya existe',
            text: err.message, // Muestra el mensaje del backend
            icon: 'error',
            confirmButtonText: 'Intenta de nuevo',
        });
    }

    formularioCategoria.reset();
});
