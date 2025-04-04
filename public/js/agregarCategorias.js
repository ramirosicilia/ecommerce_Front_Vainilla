
const formularioCategoria = document.getElementById("formulario-categoria-ingreso");


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
