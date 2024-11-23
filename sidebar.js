// Agregar listener al contenedor del menú
document.getElementById('menu').addEventListener('click', (event) => {
  const target = event.target;

  // Verificar si se hizo clic en un elemento que tiene el atributo data-page
  if (target && target.dataset.page) {
    const page = target.dataset.page;
    loadPage(page); // Llama a la función de carga de página
  }
});

function loadPage(page) {
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = '<p>Cargando...</p>'; // Muestra un mensaje mientras carga
    console.log(`Cargando página: ${page}`);

    // Usa fetch para cargar el archivo HTML correspondiente
    fetch(page)
        .then(response => {
            if (!response.ok) {
                throw new Error(`No se pudo cargar la página: ${response.statusText}`);
            }
            return response.text(); // Devuelve el contenido del archivo HTML como texto
        })
        .then(html => {
            mainContent.innerHTML = html; // Inserta el contenido HTML en el contenedor

            // Ejecutar scripts dentro del contenido cargado
            const scripts = mainContent.querySelectorAll("script");
            scripts.forEach(script => {
                const newScript = document.createElement("script");
                newScript.textContent = script.textContent;
                document.body.appendChild(newScript);
                document.body.removeChild(newScript);
            });


            // Cargar estilos específicos según la página
            const cssMapping = {
                "inicio.html": "inicio.css",
                "menu.html": "menu.css",  // Aquí solo cargamos menu.css
                "inventario.html": "inventario_styles.css",
                "pedidos.html": "inventario_styles.css",
                "reservas.html": "inventario_styles.css",
                "clientes.html": "inventario_styles.css",
                "ofertas.html": "inventario_styles.css",
                "proveedores.html": "inventario_styles.css",
                "mesas.html": "inventario_styles.css",
                "personal.html": "inventario_styles.css",
            };

            if (cssMapping[page]) {
                loadCSS(cssMapping[page]);
            } else {
                console.warn(`No se definió un archivo CSS para la página: ${page}`);
            }



            // Actualiza la URL en la barra de direcciones
            window.history.pushState({ page: page }, "", page);
            reinitializeScripts();
        })
        .catch(error => {
            console.error(error);
            mainContent.innerHTML = '<p>Error al cargar la página.</p>';
        });
}

function loadCSS(href) {
    // Evita cargar duplicados
    if (document.querySelector(`link[href="${href}"]`)) {
        console.log(`El archivo CSS ${href} ya está cargado.`);
        return;
    }

    let link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
    console.log(`Archivo CSS cargado: ${href}`);

}

// Reiniciar scripts si es necesario
function reinitializeScripts() {
  console.log("Scripts reinicializados después de cargar la página.");

}


window.addEventListener('popstate', (event) => {
    if (event.state && event.state.page) {
        loadPage(event.state.page);
    }
});