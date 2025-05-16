import { recibirPublicKey } from "./api/productos.js"; 


 let mp

async function recibirKey(){ 
    let publicKey=await recibirPublicKey()  
    console.log(publicKey)

    mp = new MercadoPago(publicKey, {
    locale: "es-AR" 
});

} 
  
(async()=>{ 
    await  recibirKey()

})()




 export async function enviarCompra(boton){ 
    let sumary=document.getElementById("summary")

    let isButtonInitialized=false

    const carritoProductos=JSON.parse(localStorage.getItem("productos")) 
     let carritoCompra=carritoProductos.map(item=>({...item}))
           
       
        carritoCompra=carritoProductos.map(item=>({
            id:item.producto_id,
            name: item.nombre_producto,
            quantity:item.cantidad,
            unit_price: item.precio_producto,
       

        }))  
        
       console.log(carritoCompra)
       console.log(carritoProductos)

      

    try {  

         const response = await fetch(`http://localhost:1600/create_preference`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ mp:carritoCompra,ecommerce:carritoProductos })
        });

        const data = await response.json();

        // Inicializar el botón solo si no ha sido creado
        if (!isButtonInitialized) { 
           console.log(sumary)
            let crear=document.createElement("div") 
            crear.id="wallet_container"
           boton.insertAdjacentElement("beforebegin", crear); 
         
        
          if (crear) {
            initializeMercadoPagoButton(data.id);
            isButtonInitialized = true;
          } else {
            console.error("El contenedor 'wallet_container' no existe aún.");
          }
     
}

    } catch (error) {
        console.error("Error al crear la preferencia de pago ->", error);
    }

  

 } 


 const initializeMercadoPagoButton = (preferenceId) => {
    const bricksBuilder = mp.bricks();
    const renderButton = async () => {  
        if (window.initializeMercadoPagoButton) window.initializeMercadoPagoButton.unmount();
        await bricksBuilder.create("wallet", "wallet_container", {
            initialization: {
                preferenceId: preferenceId,
            },
        });
    };
    renderButton();
};
 

 