
import { obtenerImagenes } from "./api/productos.js"; 
import { productoID } from "./mostrarProductosAdmin.js";


   
export const renderImages = async () => { 
    const modalImage = document.getElementById("modal-images-update");

    // Variables globales para que los eventos puedan acceder a ellas
    let selectedIndex = null;
    let selectedImageURL = null;
    let selectedImageID = null; 

    const images = await obtenerImagenes();
    console.log("Imagenes obtenidas:", images); 

    if (modalImage) {
        const imagesFiltradas = images.filter(img => img.producto_id === productoID);

        if (!Array.isArray(images)) {
            console.error("Error: obtenerImagenes() no devolvió un array", images);
            return;
        }

        modalImage.innerHTML = ""; // Limpiar antes de agregar elementos nuevos

        imagesFiltradas.forEach((img, index) => {
            const div = document.createElement("div");
            div.classList.add("formulario-update-imagenes");

            const imagesHTML = Array.isArray(img.urls)
                ? img.urls.map((url, urlIndex) => 
                    `<img src="${url}" class="img-fluid imagen-producto-update" 
                        data-id="${img.producto_id}" 
                        alt="Imagen del Producto" 
                        data-index="${urlIndex}" 
                        data-parent-index="${index}">`
                ).join('')
                : `<img src="${img.urls}" class="img-fluid imagen-producto-update" 
                        alt="Imagen del Producto" 
                        data-id="${img.producto_id}" 
                        data-index="0" 
                        data-parent-index="${index}">`;

            div.innerHTML = `
                ${imagesHTML}
                <input type="file" class="input-imagen-update" name="images" 
                    data-parent-index="${index}" data-index="0">
                <button type="submit" class="input-submit-update" 
                    style="padding: 5px 20px; background-color: #0056b3; border-radius: 10px; color: white; font-weight: 600; font-size: 11px; border: none;">
                    Actualizar Imágenes
                </button>
            `;

            modalImage.appendChild(div);
        });
    }

    // Evento para seleccionar imágenes
    const imagenes = document.querySelectorAll('.imagen-producto-update');
    console.log(imagenes);
    imagenes.forEach(img => {
        img.addEventListener('click', (event) => {
            imagenes.forEach(img => img.style.border = "none");

            selectedIndex = event.target.getAttribute('data-index');
            selectedImageID = event.target.getAttribute('data-id'); 
            selectedImageURL = event.target.getAttribute('src'); 

            console.log("Imagen seleccionada - URL:", selectedImageURL);
            console.log("ID de la imagen seleccionada:", selectedImageID);

            event.target.style.border = "3px solid navy";
        });
    });

    // Evento para actualizar imágenes
    const botonEnviar = document.querySelectorAll('.input-submit-update');
    botonEnviar.forEach(boton => {
        boton.addEventListener('click', async (event) => {
            event.preventDefault();

            if (selectedIndex === null || !selectedImageURL) {
                alert("Por favor, selecciona una imagen antes de actualizar.");
                return;
            }

            const parentDiv = event.target.closest('.formulario-update-imagenes');
            const input = parentDiv.querySelector('.input-imagen-update').files[0];

            if (!input) {
                alert("Por favor, selecciona una imagen antes de actualizar.");
                return;
            }

            console.log("ID de la imagen a actualizar:", selectedImageID);
            console.log("URL antigua de la imagen:", selectedImageURL);

            const formData = new FormData();
            formData.append('images', input);
            formData.append('urlAntigua', selectedImageURL);

            try {
                const response = await fetch(`http://localhost:1200/actualizar-imagenes/${selectedImageID}`, {
                    method: 'PUT',
                    body: formData
                });

                if (!response.ok) {
                    throw new Error("No se pudo actualizar la imagen");
                }

                const data = await response.json();
                console.log("Imagen actualizada:", data); 
                
                Swal.fire({
                    title: `La imagen fue actualizada`,
                    showClass: {
                        popup: `animate__animated animate__fadeInUp animate__faster`
                    },
                    hideClass: {
                        popup: `animate__animated animate__fadeOutDown animate__faster`
                    }   
                }); 

                // Recargar las imágenes
                await renderImages(); 

            } catch (error) {
                console.error(error);
            }
        });
    });
};

renderImages(); 




const openModalButton = document.getElementById('openImageModal-2');
      const modalElement = document.getElementById('imageModal-insert-modal');
    
      // Crear una instancia del modal
      const modal = new bootstrap.Modal(modalElement);
    
      // Agregar un listener al botón para abrir el modal
      openModalButton.addEventListener('click', () => {
        modal.show();  // Mostrar el modal al hacer clic en el botón 
        agregarImagenesArray()

      });





export const agregarImagenesArray = async () => { 
  
    const images = await obtenerImagenes();
    console.log("Imágenes actuales:", images);

    const modalImage = document.getElementById("imageModal-insert-modal"); 
    const modalBody = document.querySelector("#imageModal-insert-modal .modal-body");

    console.log(modalImage)
    if (modalImage) { 
      
     modalBody.innerHTML = ""; // Limpiar contenido actual del modal

        const imagesFiltradas = images.filter(img => img.producto_id === productoID); 

        if(imagesFiltradas.length>0){ 
            imagesFiltradas.forEach((img) => {  


                console.log(img);
                const div = document.createElement("div");
                div.classList.add("formulario-insert-imagenes");
                div.style.border = "1px solid #ddd";
                div.style.padding = "10px";
                div.style.marginBottom = "10px";
                div.style.borderRadius = "8px";
                div.style.backgroundColor = "#f9f9f9";
            
                const imagesHTML = img.urls ? img.urls.map(url =>
                    `<img src="${url}" class="img-fluid imagen-producto-insert" 
                        data-id="${img.imagenes_id}" alt="Imagen del Producto" 
                        style="width: 100px; height: 100px; object-fit: cover; border-radius: 5px; margin-right: 5px;">`
                ).join('') : '';
            
                div.innerHTML= `
                    ${imagesHTML}
                    <div class="input-container" style="margin-top: 10px;">
                        <input type="file" class="input-imagen-insert" name="images" 
                            data-parent-index="${img.imagenes_id}" data-index="0" multiple 
                            style="display: block; padding: 5px; border: 1px solid #ccc; border-radius: 5px; width: 100%;">
                    </div>
                    
                    <button type="submit" class="enviar-imagenes" 
                        style="padding: 5px 20px; background-color: green; border-radius: 10px; color: white; font-weight: 600; font-size: 11px; border: none; margin-top: 10px; cursor: pointer;">
                        Enviar Imágenes
                    </button>
                `;
               modalBody.appendChild(div); 
        
            }); 
          

        }

       
        
    } 

    
    // Evento para agregar un nuevo input de archivo
   

    // Evento para enviar las imágenes al backend
    const botonEnviar = document.querySelectorAll('.enviar-imagenes');
    console.log(botonEnviar)
    botonEnviar.forEach(boton => {
        boton.addEventListener('click', async (event) => {
            event.preventDefault();
               console.log('holaaa')
            // Obtener el input de imágenes
            const parentDiv = event.target.closest('.formulario-insert-imagenes');
            const inputFiles = parentDiv.querySelectorAll('.input-imagen-insert');
            console.log(inputFiles)


            // Crear FormData y agregar todas las imágenes seleccionadas
            const formData = new FormData();
            formData.append('productoID', productoID); // Agregar el ID del producto
                    
            inputFiles.forEach(input => {
                Array.from(input.files).forEach(file => {
                    formData.append('images', file);
                });
            });


            try { 

            
                // Realizar la solicitud POST para agregar las imágenes
                const response = await fetch(`http://localhost:1200/agregar-imagenes`, {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    throw new Error("No se pudo agregar las imágenes");
                }

                const data = await response.json();
                console.log("Imágenes agregadas:", data);

                // Actualizar la interfaz con las nuevas imágenes
                await renderImages();  // Aquí volvemos a renderizar las imágenes después de agregar nuevas

                Swal.fire({
                    title: `Las imágenes fueron agregadas exitosamente`,
                    showClass: {
                        popup: `animate__animated animate__fadeInUp animate__faster`
                    },
                    hideClass: {
                        popup: `animate__animated animate__fadeOutDown animate__faster`
                    }   
                });

            } catch (error) {
                console.error(error);
            }
        });
    });
};   

 let card=document.querySelector(".card")
let div=document.createElement("div")
div.innerHTML=` 
    <div class="modal fade modal-delete-imagenes-custom" id="imageModal-delete-modal" tabindex="-1" aria-labelledby="imageModalDeleteLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-delete-imagenes-custom">
                    <div class="modal-content modal-content-delete-imagenes-custom" id="modal-imagenes-delete">
                      <div class="modal-header">
                        <h5 class="modal-title" id="imageModalDeleteLabel">Eliminar Imágenes</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                      </div>
                      <div class="modal-body text-center">
                
                     </div> 
                    </div>
            </div>
    </div>
 
`
card.append(div)




const openModalButtonDelete = document.getElementById("openImageModalDelete");
const modalElementDelete = document.getElementById("imageModal-delete-modal"); // CORREGIDO


if(openModalButtonDelete){
    
console.log(modalElementDelete, openModalButtonDelete, '7777');
    const modale= new bootstrap.Modal(modalElementDelete); // Instanciamos el modal en el div correcto

  openModalButtonDelete.addEventListener("click", () => { 
   
    modale.show(); 
  })


}

