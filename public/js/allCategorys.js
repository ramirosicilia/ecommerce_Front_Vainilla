import{eliminarCategoria,updateCategoria,funcionChequeado,restaurarEstado } from "./Categorias.js" 



let btnEditar=[] 

const botonTodas=document.getElementById("allCategoriesButton") 

botonTodas.addEventListener("click",async()=>{    

   try{ 

       
    const response = await fetch("http://localhost:1200/allCategories")  
    
    console.log(response)
 
    const data = await response.json()  
    console.log(data) 
    let categoriasLocales = JSON.parse(localStorage.getItem("category")) || [];

    const categoriasUnicas = new Set();

    // Mapea categorías locales al formato uniforme
    const mapeadaCategoriaStorage = categoriasLocales.map(categoria => ({
        nombre: categoria.categoria, // Ajusta según la propiedad correcta
        id: categoria.id || null // Si no hay `id`, asigna null
    }));

    // Mapea categorías del servidor al formato uniforme
    const mapeadaCategoria = data.map(categoria => ({
        nombre: categoria.nombre_categoria,
        id: categoria.categoria_id
    }));

    // Combina ambos arrays y elimina duplicados
    const categoriasCombinadas = [
        ...new Map(
            [...mapeadaCategoriaStorage, ...mapeadaCategoria].map(categoria => [categoria.nombre, categoria])
        ).values()
    ];

    console.log(categoriasCombinadas); 


    const cuerpocategoria = document.getElementById("cuerpo-categorias");


    if(categoriasCombinadas.length>0){
        categoriasCombinadas.forEach(categoria=>{  
            const fila = document.createElement("tr");

            fila.innerHTML = `
                <td><input type="checkbox" class="form-check-input select-category" data-id="${categoria.id}"></td>
                <td>${categoria.nombre}</td>
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
                                     funcionChequeado(checkbox, categoria.nombre, fila);
                                 });
             


            const btnEliminar = fila.querySelector(".btn-eliminar");
            btnEliminar.addEventListener("click", () => {
                eliminarCategoria(categoria.id, categoria.nombre, fila);
            }); 
            const btnEditar = fila.querySelector(".btn__editar");
            btnEditar.addEventListener("click", () => {
                updateCategoria( categoria.nombre);
            }); 
             restaurarEstado(categoria.nombre, checkbox, fila);
             
        }) 
          

          
    }   
   

       

   } 

   catch(error){
    console.log(error)
   }

} )