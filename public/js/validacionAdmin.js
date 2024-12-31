

export function validarFormularioProducto() {
    let inputNombre = document.querySelector("#nombre").value;
    let inputPrecio = document.querySelector("#precio").value;
    let inputCategoria = document.querySelector("#categoria").value;
    let inputStock = document.querySelector("#stock").value;
 
    
    let entrada = true;

    // Expresiones regulares
    let nombreValidado = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s\-]+$/; // Nombre con letras y espacios
    let precioValidado = /^[0-9]+(\.[0-9]{1,2})?$/; // Precio, con 2 decimales opcionales
    let stockValidado = /^[0-9]+$/; // Solo números para stock

    // Contenedores de iconos de error
    const containerIconNombre = document.getElementById('container-ingreso-1');
    const containerIconPrecio = document.getElementById('container-ingreso-2');
    const containerIconCategoria = document.getElementById('container-ingreso-3');
    const containerIconStock = document.getElementById('container-ingreso-4');


    const errorMensaje= document.querySelector('.error-message');

    // Limpiar iconos antes de la validación
    containerIconNombre.style.display = 'none';
    containerIconPrecio.style.display = 'none';
    containerIconCategoria.style.display = 'none';
    containerIconStock.style.display = 'none';
 

    // Validación del nombre
    if (!inputNombre) {
        containerIconNombre.style.display = 'block'; // Muestra el error
        errorMensaje.style.display = 'block'
        entrada = false;
    } else if (!nombreValidado.test(inputNombre)) {
        containerIconNombre.style.display = 'flex'; // Muestra el error
         errorMensaje.style.display = 'block'
        entrada = false;
    }

    // Validación del precio
    if (!inputPrecio) {
        containerIconPrecio.style.display = 'flex'; // Muestra el error
           errorMensaje.style.display = 'block'
        entrada = false;
    } else if (!precioValidado.test(inputPrecio)) {
        containerIconPrecio.style.display = 'flex'; // Muestra el error
        entrada = false;
    }

    // Validación de la categoría
    if (!inputCategoria) {
        containerIconCategoria.style.display = 'flex'; // Muestra el error
           errorMensaje.style.display = 'block'
        entrada = false;
    }

    // Validación del stock
    if (!inputStock) {
        containerIconStock.style.display = 'flex'; // Muestra el error
        entrada = false;
    } else if (!stockValidado.test(inputStock)) {
        containerIconStock.style.display = 'flex'; // Muestra el error
           errorMensaje.style.display = 'block'
        entrada = false;
    }

    // Validación de la imagen


    return entrada; // Devuelve el estado de entrada
}
