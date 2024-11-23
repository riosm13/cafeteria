// Configuración de Supabase 

const supabaseUrl = 'https://egakurwqaikfjbxwvmhz.supabase.co'; // Tu URL de Supabase 

const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnYWt1cndxYWlrZmpieHd2bWh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA0MDc2OTUsImV4cCI6MjA0NTk4MzY5NX0.l2rRqLzFWc5rSJ8FJy-4GEQoz-DkCimbzkY7BLsKm1U'; // Tu clave pública de Supabase 

const supabase = window.supabase.createClient(supabaseUrl, supabaseKey); 



// Cargar mesas

window.onload = async function() {

  console.log("Cargando mesas...");

  await loadMesas();

};

// Función para formatear las fechas
function formatFecha(fechaISO) {
    const fecha = new Date(fechaISO);
    const opciones = { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit', 
        hour12: false 
    };
    return fecha.toLocaleString('es-ES', opciones); // Formato español
}

// Función para cargar las mesas

async function loadMesas() {

  try {

    const { data: mesas, error } = await supabase.from('mesas').select('*');

    if (error) {

      console.error("Error al cargar mesas:", error);

      return;
    }

    // Verificar la estructura de los datos

    const mesasBody = document.getElementById('mesasBody');

    mesasBody.innerHTML = ''; // Limpiar tabla


    mesas.forEach(mesas => {

      const row = document.createElement('tr');

      row.innerHTML = `

        <td>${mesas.mesa_id}</td>

        <td>${mesas.Ubicacion}</td>

        <td>${mesas.Capacidad}</td>

        <td>${mesas.Tipo}</td>

        <td>${mesas.Estado}</td>

      `;

      mesasBody.appendChild(row);

    });

    console.log("Mesas cargadas exitosamente.");

  } catch (error) {

    console.error("Error en loadMesas:", error);

  }

}

// Función para agregar una mesa

async function addMesa() {

  const mesas = getMesasData();

  if (!mesas.Ubicacion || !mesas.Capacidad || !mesas.Tipo || !mesas.Estado) {

    showNotification("Por favor, complete todos los campos requeridos.", "error");

    return;

  }


  try {

    const { data, error } = await supabase.from('mesas').insert([mesas]);

    if (error) {

      console.error("Error al agregar mesa:", error);

      showNotification("Error al agregar mesa.", "error");

      return;

    }

    showNotification("Mesa agregada con éxito", "success");

    clearForm();

    loadMesas();

  } catch (error) {

    console.error("Error en addMesa:", error);

    showNotification("Ocurrió un error inesperado.", "error");

  }

}


// Función para actualizar una mesa

async function updateMesa() {

  const mesas = getMesasData();

  const id = prompt("Ingrese el ID de la mesa a actualizar");

  if (!id) {

    showNotification("Por favor, ingrese un ID válido.", "error");

    return;

  }


  if (!mesas.Ubicacion || !mesas.Capacidad || !mesas.Tipo || !mesas.Estado) {

    showNotification("Por favor, complete todos los campos requeridos.", "error");

    return;

  }



  try {

    const { data, error } = await supabase.from('mesas').update(mesas).eq('mesa_id', id);

    if (error) {

      console.error("Error al actualizar mesa", error);

      showNotification("Error al actualizar mesa.", "error");

      return;

    }

    showNotification("Mesa actualizada con éxito.", "success");

    clearForm();

    loadMesas();

  } catch (error) {

    console.error("Error en updateMesas:", error);

    showNotification("Ocurrió un error inesperado.", "error");

  }

}

// Función para eliminar una mesa
async function deleteMesa() {

  const id = prompt("Ingrese el ID de la mesa a eliminar:");

  if (!id) {

    showNotification("Por favor, ingresa un ID válido.", "error");

    return;

  }



  try {

    const { data, error } = await supabase.from('mesas').delete().eq('mesa_id', id);

    if (error) {

      console.error("Error al eliminar mesa:", error);

      showNotification("Error al eliminar mesa.", "error");

      return;

    }

    showNotification("Mesa eliminada con éxito", "success");

    loadMesa();

  } catch (error) {

    console.error("Error en deleteMesa:", error);

    showNotification("Ocurrió un error inesperado.", "error");

  }

}

// Función para mostrar notificaciones con icono

function showNotification(message, type = 'info') {
  const container = document.getElementById('notification-container');
  
  const notification = document.createElement('div');
  notification.classList.add('notification', type);
  
  const icon = document.createElement('span');
  icon.classList.add('icon');
  icon.innerHTML = type === 'success' ? '✔️' : type === 'error' ? '❌' : 'ℹ️';

  const text = document.createElement('span');
  text.innerText = message;
  
  notification.appendChild(icon);
  notification.appendChild(text);
  
  container.appendChild(notification);

  setTimeout(() => {
    notification.classList.add('show');
  }, 10);


  setTimeout(() => {
    notification.classList.replace('show', 'hide');

    setTimeout(() => {
      notification.remove();
    }, 500); // Tiempo de la animación para la desaparición
  }, 3000); // 3 segundos para la notificación visible

}


// Limpiar formulario

function clearForm() {

  document.getElementById('Ubicacion').value = '';

  document.getElementById('Capacidad').value = '';

  document.getElementById('Tipo').value = '';

  document.getElementById('Estado').value = '';

}

// Obtener datos del formulario

function getMesasData() {

  return {

    Ubicacion: document.getElementById('Ubicacion').value,

    Capacidad: document.getElementById('Capacidad').value,

    Tipo: document.getElementById('Tipo').value,

    Estado: document.getElementById('Estado').value,

  };

}