// Configuración de Supabase 

const supabaseUrl = 'https://egakurwqaikfjbxwvmhz.supabase.co'; // Tu URL de Supabase 

const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnYWt1cndxYWlrZmpieHd2bWh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA0MDc2OTUsImV4cCI6MjA0NTk4MzY5NX0.l2rRqLzFWc5rSJ8FJy-4GEQoz-DkCimbzkY7BLsKm1U'; // Tu clave pública de Supabase 

const supabase = window.supabase.createClient(supabaseUrl, supabaseKey); 



// Cargar ofertas al inicio

window.onload = async function() {

  console.log("Cargando ofertas...");

  await loadOfertas();

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

// Función para cargar las ofertas

async function loadOfertas() {

  try {

    const { data: ofertas, error } = await supabase.from('ofertas').select('*');

    if (error) {

      console.error("Error al cargar ofertas:", error);

      return;
    }

    // Verificar la estructura de los datos

    const ofertasBody = document.getElementById('ofertasBody');

    ofertasBody.innerHTML = ''; // Limpiar tabla


    ofertas.forEach(ofertas => {

      const row = document.createElement('tr');

      row.innerHTML = `

        <td>${ofertas.oferta_id}</td>

        <td>${ofertas.Nombre_oferta}</td>

        <td>${ofertas.Descripcion}</td>

        <td>${ofertas.Precio_descuento}</td>

        <td>${ofertas.Tipo_oferta}</td>

        <td>${ofertas.Aplica}</td>

        <td>${ofertas.Fecha_inicio}</td>

        <td>${ofertas.Fecha_fin}</td>


      `;

      ofertasBody.appendChild(row);

    });

    console.log("Ofertas cargadas exitosamente.");

  } catch (error) {

    console.error("Error en loadOfertas:", error);

  }

}

// Función para agregar oferta

async function addOferta() {

  const ofertas = getOfertasData();

  if (!ofertas.Nombre_oferta || !ofertas.Descripcion || !ofertas.Precio_descuento || !ofertas.Tipo_oferta) {

    showNotification("Por favor, complete todos los campos requeridos.", "error");

    return;

  }


  try {

    const { data, error } = await supabase.from('ofertas').insert([ofertas]);

    if (error) {

      console.error("Error al agregar oferta:", error);

      showNotification("Error al agregar oferta.", "error");

      return;

    }

    showNotification("Oferta agregada con éxito", "success");

    clearForm();

    loadOfertas();

  } catch (error) {

    console.error("Error en addOferta:", error);

    showNotification("Ocurrió un error inesperado.", "error");

  }

}

// Función para actualizar una oferta

async function updateOferta() {

  const ofertas = getOfertasData();

  const id = prompt("Ingrese el ID de la oferta a actualizar");

  if (!id) {

    showNotification("Por favor, ingrese un ID válido.", "error");

    return;

  }


  if (!ofertas.Nombre_oferta || !ofertas.Descripcion || !ofertas.Precio_descuento || !ofertas.Tipo_oferta) {

    showNotification("Por favor, complete todos los campos requeridos.", "error");

    return;

  }



  try {

    const { data, error } = await supabase.from('ofertas').update(ofertas).eq('oferta_id', id);

    if (error) {

      console.error("Error al actualizar oferta", error);

      showNotification("Error al actualizar oferta.", "error");

      return;

    }

    showNotification("Oferta actualizada con éxito.", "success");

    clearForm();

    loadOfertas();

  } catch (error) {

    console.error("Error en updateOferta:", error);

    showNotification("Ocurrió un error inesperado.", "error");

  }

}

// Función para eliminar una oferta
async function deleteOferta() {

  const id = prompt("Ingrese el ID de la oferta a eliminar:");

  if (!id) {

    showNotification("Por favor, ingresa un ID válido.", "error");

    return;

  }



  try {

    const { data, error } = await supabase.from('ofertas').delete().eq('oferta_id', id);

    if (error) {

      console.error("Error al eliminar oferta:", error);

      showNotification("Error al eliminar oferta.", "error");

      return;

    }

    showNotification("Oferta eliminada con éxito", "success");

    loadOfertas();

  } catch (error) {

    console.error("Error en deleteOferta:", error);

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

  document.getElementById('Nombre_oferta').value = '';


  document.getElementById('Descripcion').value = '';

  document.getElementById('Precio_descuento').value = '';

  document.getElementById('Tipo_oferta').value = '';

  document.getElementById('Aplica').value = '';

  document.getElementById('Fecha_inicio').value = '';

  document.getElementById('Fecha_fin').value = '';


}



// Obtener datos del formulario

function getOfertasData() {

  return {


    Nombre_oferta: document.getElementById('Nombre_oferta').value,

    Descripcion: document.getElementById('Descripcion').value,

    Precio_descuento: parseFloat(document.getElementById('Precio_descuento').value),

    Tipo_oferta: document.getElementById('Tipo_oferta').value,

    Aplica: document.getElementById('Aplica').value,

    Fecha_inicio: document.getElementById('Fecha_inicio').value,

    Fecha_fin: document.getElementById('Fecha_fin').value,


  };

}
