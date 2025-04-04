
export const obtenerProductos=async()=>{ 

  try{ 

    const response= await fetch("http://localhost:1200/obtener-productos") 
    console.log(response,"admin") 

    if(!response.ok){ 

      const dataErrror= await response.json() 
      throw new Error(dataErrror.error)

    } 

    else{
      const productosData= await response.json()  
      console.log(productosData)
      

      return productosData
    } 

  } 


  catch (err) {
    console.error("Error:", err);
    Swal.fire({
      title: "Error",
      text: err.message,
      icon: "error",
      confirmButtonText: "Intenta de nuevo",
    });
   
  }


} 


export async function obtenerCategorys() {
  try {
      const response = await fetch("http://localhost:1200/obtener-categorias");

      if (!response.ok) {
          throw new Error("No se obtuvo la data");
      } else {
          const dataCategory = await response.json();
          return dataCategory;
      }
  } catch (err) {
      console.log(err.message);
  } 

  return []; // Retornar array vacío en caso de error
} 



export async function obtenerImagenes() {
  try {
      const response = await fetch("http://localhost:1200/obtener-imagenes");

      if (!response.ok) {
          throw new Error("No se obtuvo la data");
      } if(response) {
          const dataImagen = await response.json(); 

          console.log(dataImagen.data,"imagenes")
          return dataImagen.data;
      }
  } catch (err) {
      console.log(err.message);
  } 

  return []; // Retornar array vacío en caso de error
}  

