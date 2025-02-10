
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


  catch(err){ 

   console.log('no se obtuvieron los productos',err)
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
