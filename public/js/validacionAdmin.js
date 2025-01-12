

export function validarFormularioProducto() {
    let errores = {
      nombre: "",
      precio: "",
      categoria: "",
      stock: "",
      imagen: "",
    };
  
    const nombre = document.getElementById("productName").value;
    const precio = document.getElementById("productPrice").value;
    const categoria = document.getElementById("productCategory").value;
    const stock = document.getElementById("productStock").value;
    const imagen = document.getElementById("productImage"); 

  
    const nombreValidado = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s\-]+$/;
    const precioValidado = /^[0-9]+(\.[0-9]{1,2})?$/;
    const stockValidado = /^[0-9]+$/;
  
    // Validaciones
    if (!nombre || !nombreValidado.test(nombre)) {
      errores.nombre = "El nombre solo debe contener letras y espacios.";
    }
    if (!precio || !precioValidado.test(precio)) {
      errores.precio = "El precio debe ser un número válido.";
    }
    if (!categoria) {
      errores.categoria = "Debe seleccionar una categoría.";
    }
    if (!stock || !stockValidado.test(stock)) {
      errores.stock = "El stock debe ser un número entero.";
    }
    if (!imagen) {
      errores.imagen = "Debe subir una imagen.";
    }
  
    // Mostrar errores
    document.getElementById("error-nombre").textContent = errores.nombre;
    document.getElementById("error-precio").textContent = errores.precio;
    document.getElementById("error-categoria").textContent = errores.categoria;
    document.getElementById("error-stock").textContent = errores.stock;
    document.getElementById("error-imagen").textContent = errores.imagen;
  
    // Retornar resultado
    return !Object.values(errores).some((error) => error !== "");
  } 

  export function validarFormularioProductoUpdate() {
    let err = {
      nombre: "",
      precio: "",
      categoria: "",
      stock: "",
      imagen: "",
    };
  
    const nombre = document.getElementById("productName-update").value;
    const precio = document.getElementById("productPrice-update").value;
    const categoria = document.getElementById("productCategory-update").value;
    const stock = document.getElementById("productStock-update").value;
    const imagen = document.getElementById("productImage-update"); 

    
    const nombreValidado = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s\-]+$/;
    const precioValidado = /^[0-9]+(\.[0-9]{1,2})?$/;
    const stockValidado = /^[0-9]+$/;
  
    // Validaciones
    if (!nombre || !nombreValidado.test(nombre)) {
      err.nombre = "El nombre solo debe contener letras y espacios.";
    }
    if (!precio || !precioValidado.test(precio)) {
      err.precio = "El precio debe ser un número válido.";
    }
    if (!categoria) {
      err.categoria = "Debe seleccionar una categoría.";
    }
    if (!stock || !stockValidado.test(stock)) {
      err.stock = "El stock debe ser un número entero.";
    }
    if (!imagen) {
      err.imagen = "Debe subir una imagen.";
    }
  
    // Mostrar errores
    document.getElementById("error-nombre-update").textContent = err.nombre;
    document.getElementById("error-precio-update").textContent = err.precio;
    document.getElementById("error-categoria-update").textContent = err.categoria;
    document.getElementById("error-stock-update").textContent = err.stock;
    document.getElementById("error-imagen-update").textContent = err.imagen;
  
    // Retornar resultado
    return !Object.values(err).some((error) => error !== "");
  }
  
  