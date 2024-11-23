// Conexión a la API de Supabase
const supabaseUrl = 'https://egakurwqaikfjbxwvmhz.supabase.co';

const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnYWt1cndxYWlrZmpieHd2bWh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA0MDc2OTUsImV4cCI6MjA0NTk4MzY5NX0.l2rRqLzFWc5rSJ8FJy-4GEQoz-DkCimbzkY7BLsKm1U';

const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// Cargar el menú al inicio cuando la página se haya cargado
window.onload = async function() {

    console.log("Cargando menú...");

    await fetchMenu();
};


// Función para obtener el menú desde Supabase

async function fetchMenu() {

    const { data, error } = await supabase.from('menu').select('*');


    if (error) {

        console.error('Error cargando menu:', error);
        return;
    }

    renderMenu(data);
}

// Función para renderizar el menú en la interfaz

function renderMenu(menuItems) {

    const menuContainer = document.getElementById('menuContainer');

    menuContainer.innerHTML = ''; // Limpiar contenido previo

    menuItems.forEach(item => {

        // Crear tarjeta de platillo

        const card = document.createElement('div');
        card.classList.add('card');

        // Verificar disponibilidad y agregar clase si no está disponible

        if (!item.Disponibilidad) {

            card.classList.add('unavailable');
        }

        card.innerHTML = `
        <div class="card-header">
            <img src="${item.Imagen_url}" alt="${item.Nombre}">
            <button class="view-details-button" onclick="viewDetails(${item.menu_id})">
                &#x22EE; <!-- Icono de tres puntos verticales -->
            </button>
        </div>
            <div class="card-content">

                <h3>${item.Nombre}</h3>

                <p>${item.Categoria}</p>

                <p class="price">$${item.Costo_unitario} MXN</p>

                <p>${item.Descripcion}</p>

                <span class="more-icon" onclick="viewDetails('${item.id}')">⋮</span>

            </div>
        `;

        // Añadir tarjeta al contenedor

        menuContainer.appendChild(card);
    });
}

// Función "Ver detalles" que se activa al hacer clic en el botón de tres puntos

function viewDetails(id) {
    if (id) {
        sessionStorage.setItem('menuId', id); // Almacena el id en sessionStorage
        console.log("ID almacenado en sessionStorage:", id); // Verifica el ID almacenado
        window.location.href = "detalles_menu.html"; // Redirige sin `id` en la URL
    } else {
        console.error("ID de menú no proporcionado");
    }
}

// Función de búsqueda

function filterMenu() {

    const query = document.getElementById('searchInput').value.toLowerCase();

    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {

        const title = card.querySelector('h3').textContent.toLowerCase();

        const category = card.querySelector('p').textContent.toLowerCase();

        card.style.display = title.includes(query) || category.includes(query) ? '' : 'none';

    });
}

// Eventos de cambio en los filtros

document.getElementById('mainDishes').addEventListener('change', (e) => filterMenuByCategory(e.target.value, 'Platillos Principales'));
document.getElementById('desserts').addEventListener('change', (e) => filterMenuByCategory(e.target.value, 'Postres y Snacks'));
document.getElementById('drinks').addEventListener('change', (e) => filterMenuByCategory(e.target.value, 'Bebidas'));
document.getElementById('diets').addEventListener('change', (e) => filterMenuByCategory(e.target.value, 'Dietas y Preferencias Especiales'));

// Evento para el botón "Quitar Filtro"

document.getElementById('clearFilters').addEventListener('click', async () => {
    // Restablecer los selectores
    document.getElementById('mainDishes').value = '';
    document.getElementById('desserts').value = '';
    document.getElementById('drinks').value = '';
    document.getElementById('diets').value = '';

    // Volver a cargar todo el menú sin filtrar
    await fetchMenu();
});

// Función para filtrar por categoría en Supabase

async function filterMenuByCategory(category) {

    const { data, error } = await supabase

        .from('menu')

        .select('*')

                     .eq('Categoria', category);

    if (error) {

        console.error('Error al filtrar menú:', error);
        return;
    }
    renderMenu(data);
}


// Asignar eventos de cambio para cada filtro de categoría
document.getElementById('mainDishes').addEventListener('change', (event) => {
    const selectedCategory = event.target.value;
    clearOtherFilters('mainDishes');
    if (selectedCategory) {
        filterMenuByCategory(selectedCategory);
    }
});

document.getElementById('desserts').addEventListener('change', (event) => {
    const selectedCategory = event.target.value;
    clearOtherFilters('desserts');
    if (selectedCategory) {
        filterMenuByCategory(selectedCategory);
    }
});

document.getElementById('drinks').addEventListener('change', (event) => {
    const selectedCategory = event.target.value;
    clearOtherFilters('drinks');
    if (selectedCategory) {
        filterMenuByCategory(selectedCategory);
    }
});

document.getElementById('diets').addEventListener('change', (event) => {
    const selectedCategory = event.target.value;
    clearOtherFilters('diets');
    if (selectedCategory) {
        filterMenuByCategory(selectedCategory);
    }
});


function clearOtherFilters(selectedId) {
    const filters = ['mainDishes', 'desserts', 'drinks', 'diets'];
    filters.forEach(id => {
        if (id !== selectedId) {
            document.getElementById(id).value = '';
        }
    });
}
