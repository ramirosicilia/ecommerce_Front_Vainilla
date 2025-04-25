import { obtenerCategorys, obtenerProductos } from "./api/productos.js";


  let categorias = []
  let productos = []
  const container=document.querySelector(".container")

 async function obtenerDatos(){  
    
     categorias = await obtenerCategorys();
     productos = await obtenerProductos() 
    
}


async function reendedizarDetallesProductos() {
    await obtenerDatos();
  
    const imgID = JSON.parse(localStorage.getItem("id-imagen"));
    const talleID = JSON.parse(localStorage.getItem("id-talle"));
    const colorID = JSON.parse(localStorage.getItem("id-color"));
  
    const productosActivos = productos.filter(producto => producto?.activacion === true);
    const categoriasFiltradas = categorias.filter(categoria => categoria?.activo === true);
    const productosActivosFiltrados = productosActivos.filter(producto =>
      categoriasFiltradas.some(categoria => categoria.categoria_id === producto.categoria_id)
    );
  
    let varianteSeleccionada;
    let imagenSeleccionada; // ✅ declarar variable para la imagen
    const productoSeleccionado = productosActivosFiltrados.find(producto => {
      const variante = producto.productos_variantes.find(v =>
        v.producto_id === imgID &&
        v.color_id === colorID &&
        v.talle_id === talleID
      );
  
      if (variante) {
        // ✅ Guardar la imagen relacionada
        imagenSeleccionada = producto.imagenes.find(img =>
          img.producto_id === imgID
        );
        varianteSeleccionada = variante;
        return true;
      }
     return false;
    }
  
  );
  

    if (!productoSeleccionado || !varianteSeleccionada) {
      console.error("Producto o variante no encontrados.");
      return;
    }
  
    // ✅ Usar la imagen seleccionada
    const imagenPrincipal = imagenSeleccionada?.urls?.[0] || './images/default.jpg';
    console.log(imagenPrincipal);
  
    // Miniaturas (excluye la primera imagen, que ya se usa como principal)
   // Miniaturas (excluye la imagen principal)
    const todasLasImagenes = imagenSeleccionada?.urls || [];
    const miniaturas = todasLasImagenes.slice(1).map(url => `
      <img src="${url}" style="width: 70px; height: 70px; border-radius: 5px; cursor: pointer; transition: transform 0.3s, box-shadow 0.3s; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);"
           onmouseover="this.style.transform='scale(1.1)'; this.style.boxShadow='0 8px 20px rgba(0, 0, 0, 0.2)';"   
           onclick="document.querySelector('#imagen-principal').src='${url}'">
    `).join('');

    const nombre = productoSeleccionado.nombre_producto || "Producto sin nombre";
    const descripcion = productoSeleccionado.descripcion || "Sin descripción";
    const detalle= productoSeleccionado.detalles || "Sin detalle";
  
    const precioBase = productoSeleccionado.precio || 0;
    const precio = (precioBase / 100).toFixed(2);
    const precioOriginal = (precioBase * 1.3 / 100).toFixed(2);
    const descuento = Math.round(100 - (precio / precioOriginal) * 100);
    
    const talles = productoSeleccionado.productos_variantes.map(v => v.talles);
    const colores = productoSeleccionado.productos_variantes.map(v => v.colores);
  
    const tallesHTML = talles.map(talle => `
      <button style="padding: 10px; border: 1px solid gray; background: white; cursor: pointer; border-radius: 5px; margin: 5px;">
        ${talle.insertar_talle}
      </button>
    `).join('');
  
    const coloresHTML = colores.map(color => `
      <button style="padding: 10px; border: 1px solid gray; background: white; cursor: pointer; border-radius: 5px; margin: 5px;">
        ${color.insertar_color}
      </button>
    `).join('');
  
    container.innerHTML = `
      <div style="max-width: 1200px; width: 100%; display: flex; justify-content: center; align-items: center; gap: 50px; flex-wrap: wrap;">
        <div style="flex: 1; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 25px;">
          <img src="${imagenPrincipal}" alt="${nombre}"
               style="width: 300px; height: auto; margin-bottom: 30px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); animation: rotate 5s infinite linear; transition: transform 0.3s ease;">
          
          <div style="display: flex; justify-content: center; gap: 2rem;">
            ${miniaturas}
          </div>
        </div>
  
        <div style="flex: 1; max-width: 500px; padding-left: 20px;">
          <h1 style="font-size: 2rem; font-weight: bold; color: #333;">${nombre}</h1>
          <p>${detalle}</p>
          <p>
            <span style="color: red; font-size: 24px; font-weight: bold;">$/ ${precio}</span>
            <span style="text-decoration: line-through; color: gray; margin-left: 10px;">$/ ${precioOriginal}</span>
            <span style="background-color: red; color: white; padding: 2px 5px; border-radius: 3px; font-size: 14px;">-${descuento}%</span>
          </p>
  
          <h3>Talla:</h3>
          <div>${tallesHTML}</div>
  
          <h3>Colores:</h3>
          <div>${coloresHTML}</div>
  
          <h3>Descripción del producto</h3>
          <p>${descripcion}</p>
  
          <h3>Opciones de entrega:</h3>
          <p>✔ Llega mañana | ✔ Retira mañana</p>
  
          <div>
            <button style="padding: 12px 20px; border: none; font-size: 16px; border-radius: 5px; cursor: pointer; margin: 10px 0; background: #ff6600; color: white;">Agregar al carrito</button>
            <button style="padding: 12px 20px; border: none; font-size: 16px; border-radius: 5px; cursor: pointer; margin: 10px 0; background: black; color: white; margin-left: 10px;">Comprar ahora</button>
          </div>
        </div>
      </div>
    `;
  }
  
  reendedizarDetallesProductos();
  