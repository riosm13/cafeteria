// Configuración de Supabase 

const supabaseUrl = 'https://egakurwqaikfjbxwvmhz.supabase.co'; // Tu URL de Supabase 

const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnYWt1cndxYWlrZmpieHd2bWh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA0MDc2OTUsImV4cCI6MjA0NTk4MzY5NX0.l2rRqLzFWc5rSJ8FJy-4GEQoz-DkCimbzkY7BLsKm1U'; // Tu clave pública de Supabase 

const supabase = window.supabase.createClient(supabaseUrl, supabaseKey); 

// Cargar reservas al inicio

window.onload = async function() {

  console.log("Cargando reservas...");

  await loadReservas();

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


// Función para cargar las reservas

async function loadReservas() {

  try {

    const { data: reservas, error } = await supabase.from('reservas').select('*');

    if (error) {

      console.error("Error al cargar reservas:", error);

      return;
}
  
    // Verificar la estructura de los datos

    const reservasBody = document.getElementById('reservasBody');

    reservasBody.innerHTML = ''; // Limpiar tabla

    reservas.forEach(reservas => {

      const row = document.createElement('tr');

      row.innerHTML = `

        <td>${reservas.reserva_id}</td>

        <td>${reservas.cliente_id}</td>

        <td>${reservas.Fecha_reserva}</td>

        <td>${reservas.Tipo_reserva}</td>

        <td>${reservas.mesa_id}</td>

        <td>${reservas.Num_personas}</td>

        <td>${reservas.Estado_reserva}</td>

        <td>${reservas.Fecha_creacion}</td>

        <td>${reservas.Notas}</td>

        <td>${formatFecha(reservas.Ultima_actualizacion)}</td>

      `;

      reservasBody.appendChild(row);

    });

    console.log("Reservas cargadas exitosamente.");

  } catch (error) {

    console.error("Error en loadReservas:", error);

  }

}

// Función para agregar una reserva

async function addReserva() {

  const reservas = getReservasData();

  if (!reservas.cliente_id || !reservas.Fecha_reserva || !reservas.Tipo_reserva || !reservas.mesa_id) {

    showNotification("Por favor, complete todos los campos requeridos.", "error");

    return;

  }


  try {

    const { data, error } = await supabase.from('reservas').insert([reservas]);

    if (error) {

      console.error("Error al agregar reserva:", error);

      showNotification("Error al agregar reserva.", "error");

      return;

    }

    showNotification("Reserva agregada con éxito", "success");

    clearForm();

    loadReservas();

  } catch (error) {

    console.error("Error en addReserva:", error);

    showNotification("Ocurrió un error inesperado.", "error");

  }

}

// Función para actualizar una reserva

async function updateReserva() {

  const reservas = getReservasData();

  const id = prompt("Ingresa el ID de la reserva a actualizar");

  if (!id) {

    showNotification("Por favor, ingresa un ID válido.", "error");

    return;

  }


  if (!reservas.cliente_id || !reservas.Fecha_reserva || !reservas.Tipo_reserva || !reservas.mesa_id) {

    showNotification("Por favor, complete todos los campos requeridos.", "error");

    return;

  }



  try {

    const { data, error } = await supabase.from('reservas').update(reservas).eq('reserva_id', id);

    if (error) {

      console.error("Error al actualizar reserva", error);

      showNotification("Error al actualizar reserva.", "error");

      return;

    }

    showNotification("Reserva actualizada con éxito.", "success");

    clearForm();

    loadReservas();

  } catch (error) {

    console.error("Error en updateReserva:", error);

    showNotification("Ocurrió un error inesperado.", "error");

  }

}

// Función para eliminar una reserva
async function deleteReserva() {

  const id = prompt("Ingrese el ID de la reserva a eliminar:");

  if (!id) {

    showNotification("Por favor, ingresa un ID válido.", "error");

    return;

  }



  try {

    const { data, error } = await supabase.from('reservas').delete().eq('reserva_id', id);

    if (error) {

      console.error("Error al eliminar reserva:", error);

      showNotification("Error al eliminar reserva.", "error");

      return;

    }

    showNotification("Reserva eliminada con éxito", "success");

    loadReservas();

  } catch (error) {

    console.error("Error en deleteReserva:", error);
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

  document.getElementById('cliente_id').value = '';
  document.getElementById('Fecha_reserva').value = '';
  document.getElementById('Tipo_reserva').value = '';
  document.getElementById('mesa_id').value = '';
  document.getElementById('Num_personas').value = '';
  document.getElementById('Estado_reserva').value = '';
  document.getElementById('Fecha_creacion').value = '';
  document.getElementById('Notas').value = '';
  document.getElementById('Ultima_actualizacion').value = '';

}

// Obtener datos del formulario

function getReservasData() {

  return {

    cliente_id: document.getElementById('cliente_id').value,

    Fecha_reserva: document.getElementById('Fecha_reserva').value,

    Tipo_reserva: document.getElementById('Tipo_reserva').value,

    mesa_id: document.getElementById('mesa_id').value,

    Num_personas: parseFloat(document.getElementById('Num_personas').value),

    Estado_reserva: document.getElementById('Estado_reserva').value,

    Fecha_creacion: document.getElementById('Fecha_creacion').value,

    Notas: document.getElementById('Notas').value,

    Ultima_actualizacion: new Date().toISOString(),  // Asigna la fecha y hora actual en formato ISO


  };

}
