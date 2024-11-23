// Conexión a la API de Supabase

const supabaseUrl = 'https://egakurwqaikfjbxwvmhz.supabase.co';

const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnYWt1cndxYWlrZmpieHd2bWh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA0MDc2OTUsImV4cCI6MjA0NTk4MzY5NX0.l2rRqLzFWc5rSJ8FJy-4GEQoz-DkCimbzkY7BLsKm1U';

const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// Obtener el ID del producto de la URL

const urlParams = new URLSearchParams(window.location.search);

const menuId = parseInt(urlParams.get('id') || 1);

// Función para obtener los detalles del producto desde Supabase

async function fetchProductDetails(id) {

    const { data, error } = await supabase

        .from('menu')

        .select('*')

        .eq('menu_id', id) // Usamos 'menu_id' como identificador de la tabla 'menu'
        .single();

    if (error) {
        console.error('Error obteniendo detalles del producto:', error);
        return;
    }

    renderProductDetails(data);
}

// Función para mostrar los detalles del producto en la interfaz

function renderProductDetails(menuItem) {

    const container = document.getElementById('productDetailsContainer');

    // Formatea los ingredientes como lista
    const ingredientesList = menuItem.Ingredientes.map(item => 
        `<li>${item.Cantidad} de ${item.Ingrediente}</li>`
    ).join('');

    container.innerHTML = `

        <div class="product-image">

            <img src="${menuItem.Imagen_url}" alt="${menuItem.Nombre}">

        </div>

        <div class="menu-item-detail">
            <h3>${menuItem.Nombre}</h3>
            <p><strong>Categoría:</strong> ${menuItem.Categoria}</p>
            <p>${menuItem.Descripcion}</p>
            <p><strong>Ingredientes:</strong></p>
            <ul>${ingredientesList}</ul> <!-- Lista de ingredientes -->
            <p><strong>Precio:</strong> $${menuItem.Costo_unitario} MXN</p>
            <p><strong>Tamaño:</strong> ${menuItem.Tamaño}</p>
            <p><strong>Disponibilidad:</strong> ${menuItem.Disponibilidad ? 'Disponible' : 'No disponible'}</p>
            ${menuItem.Oferta_especial ? `<p><strong>Oferta Especial:</strong> ${menuItem.Nombre_oferta}</p>` : ''}
        </div>
    `;
}

// Cargar los detalles del menú al cargar la página
window.onload = async function() {
    const menuId = sessionStorage.getItem('menuId'); // Recupera el id

    if (menuId && !isNaN(menuId)) {
        await fetchProductDetails(parseInt(menuId));
    } else {
        console.error('ID de menú no encontrado en sessionStorage');
        document.getElementById('productDetailsContainer').innerHTML = "<p>Error: Producto no encontrado.</p>";
    }
};