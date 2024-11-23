// Configuración de Supabase 

const supabaseUrl = 'https://egakurwqaikfjbxwvmhz.supabase.co'; // Tu URL de Supabase 

const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnYWt1cndxYWlrZmpieHd2bWh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA0MDc2OTUsImV4cCI6MjA0NTk4MzY5NX0.l2rRqLzFWc5rSJ8FJy-4GEQoz-DkCimbzkY7BLsKm1U'; // Tu clave pública de Supabase 

const supabase = window.supabase.createClient(supabaseUrl, supabaseKey); 


function loadPage(page) {
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = '<p>Cargando...</p>'; // Muestra un mensaje mientras carga

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

            // Actualiza la URL en la barra de direcciones
            window.history.pushState({ page: page }, "", page);
        })
        .catch(error => {
            console.error(error);
            mainContent.innerHTML = '<p>Error al cargar la página.</p>';
        });
}


async function fetchWeather() {
    const apiKey = '342cc9a1b4f92f1ce466a26dffc9944e'; 
    const city = 'Puerto Vallarta';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=es&appid=${apiKey}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Verifica si la solicitud fue exitosa
        if (response.ok) {
            const temperature = data.main.temp;
            const description = data.weather[0].description;
            const weatherElement = document.getElementById('weather-widget');

            weatherElement.innerHTML = `
                <span>${temperature}°C, ${description.charAt(0).toUpperCase() + description.slice(1)}</span>
            `;
        } else {
            console.error('Error al obtener el clima:', data.message);
        }
    } catch (error) {
        console.error('Error de conexión:', error);
    }
}

// Llama a la función para cargar el clima
fetchWeather();

