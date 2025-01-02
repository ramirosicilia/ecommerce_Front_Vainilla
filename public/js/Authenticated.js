


export async function  authenticatenUser(){

    try {  
        const obtenerToken = localStorage.getItem('token');
        const obtenerUsuario = localStorage.getItem('dni'); 

        console.log(obtenerUsuario, 'obtenerUsuario');

        if (!obtenerToken || !obtenerUsuario) {
            return;
        } 

        const respuesta = await fetch('http://localhost:1200/ruta-protegida', {
            headers: {
                'Authorization': `Bearer ${obtenerToken}`
            } 
        }); 

        const datos = await respuesta.json(); 

        console.log(datos, 'datos'); 
        document.cookie = `token=${datos.token}`;
        document.cookie = `usuario=${obtenerUsuario}`;

        if (datos.err) {
            Swal.fire({
                title: datos.err,
                showClass: {
                    popup: `
                        animate__animated
                        animate__fadeInUp
                        animate__faster
                    `
                },
                hideClass: {
                    popup: `
                        animate__animated
                        animate__fadeOutDown
                        animate__faster
                    `
                }
            });
        } else {    
            Swal.fire({
                title: `el usuario fue: ${datos.respuesta}`,
                showClass: {
                    popup: `
                        animate__animated
                        animate__fadeInUp
                        animate__faster
                    `
                },
                hideClass: {
                    popup: `
                        animate__animated
                        animate__fadeOutDown
                        animate__faster
                    `
                }   
            }); 

        } 

    }

    catch (err) {
        console.log("Error en la ruta protegida", err);
    }

} 



