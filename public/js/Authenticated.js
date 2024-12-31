


export async function  authenticatenUser(){

    try { 
        const token = document.cookie.split('; ').find(row => row.startsWith('token=')); 
       console.log(token)
        if (token) {
            const tokenValue = token.split('=')[1];

            const response = await fetch(`http://localhost:1200/ruta-protegida`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${tokenValue}`
                },
                credentials: "include",
            });

            if (!response.ok) {
                const errorDatos = await response.json();
                console.log("Error en la ruta protegida: ", errorDatos);
                return;
            }

            const data = await response.json();
        

            

        } else {
            console.log("No se encontró el token en las cookies");
        }
    } catch (err) {
        console.log("Error en la ruta protegida", err);
    }

} 

