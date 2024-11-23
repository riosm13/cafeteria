// Configuración de Supabase 

const supabaseUrl = 'https://egakurwqaikfjbxwvmhz.supabase.co'; // Tu URL de Supabase 

const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnYWt1cndxYWlrZmpieHd2bWh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA0MDc2OTUsImV4cCI6MjA0NTk4MzY5NX0.l2rRqLzFWc5rSJ8FJy-4GEQoz-DkCimbzkY7BLsKm1U'; // Tu clave pública de Supabase 

const supabase = window.supabase.createClient(supabaseUrl, supabaseKey); 



// Cargar proveedores al inicio

window.onload = async function() {

  console.log("Cargando proveedores...");

  await loadProveedores();

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

// Función para cargar los proveedores

async function loadProveedores() {

  try {

    const { data: proveedores, error } = await supabase.from('proveedores').select('*');

    if (error) {

      console.error("Error al cargar proveedores:", error);

      return;
    }

    // Verificar la estructura de los datos

    const proveedoresBody = document.getElementById('proveedoresBody');

    proveedoresBody.innerHTML = ''; // Limpiar tabla


    proveedores.forEach(proveedores => {

      const row = document.createElement('tr');

      row.innerHTML = `

        <td>${proveedores.Proveedor_id}</td>

        <td>${proveedores.Nombre}</td>

        <td>${proveedores.Contacto}</td>

        <td>${proveedores.Telefono}</td>

        <td>${proveedores.Email}</td>

        <td>${proveedores.Direccion}</td>

        <td>${proveedores.Categoria}</td>

        <td>${proveedores.Fecha_registro}</td>

        <td>${proveedores.Notas}</td>


      `;

      proveedoresBody.appendChild(row);

    });

    console.log("Proveedores cargados exitosamente.");

  } catch (error) {

    console.error("Error en loadProveedores:", error);

  }

}

// Función para agregar un proveedor

async function addProveedor() {

  const proveedores = getProveedoresData();

  if (!proveedores.Nombre || !proveedores.Contacto || !proveedores.Telefono || !proveedores.Email) {

    showNotification("Por favor, complete todos los campos requeridos.", "error");

    return;

  }


  try {

    const { data, error } = await supabase.from('proveedores').insert([proveedores]);

    if (error) {

      console.error("Error al agregar proveedor:", error);

      showNotification("Error al agregar proveedor.", "error");

      return;

    }

    showNotification("Proveedor agregado con éxito", "success");

    clearForm();

    loadProveedores();

  } catch (error) {

    console.error("Error en addProveedor:", error);

    showNotification("Ocurrió un error inesperado.", "error");

  }

}

// Función para actualizar un proveedor

async function updateProveedor() {

  const proveedores = getProveedoresData();

  const id = prompt("Ingrese el ID del proveedor a actualizar");

  if (!id) {

    showNotification("Por favor, ingrese un ID válido.", "error");

    return;

  }


  if (!proveedores.Nombre || !proveedores.Contacto || !proveedores.Telefono || !proveedores.Email) {


    showNotification("Por favor, complete todos los campos requeridos.", "error");

    return;

  }



  try {

    const { data, error } = await supabase.from('proveedores').update(proveedores).eq('Proveedor_id', id);

    if (error) {

      console.error("Error al actualizar proveedor", error);

      showNotification("Error al actualizar proveedor.", "error");

      return;

    }

    showNotification("Proveedor actualizado con éxito.", "success");

    clearForm();

    loadProveedores();

  } catch (error) {

    console.error("Error en updateProveedor:", error);

    showNotification("Ocurrió un error inesperado.", "error");

  }

}

// Función para eliminar un proveedor

async function deleteProveedor() {

  const id = prompt("Ingrese el ID del proveedor a eliminar:");

  if (!id) {

    showNotification("Por favor, ingresa un ID válido.", "error");

    return;

  }



  try {

    const { data, error } = await supabase.from('proveedores').delete().eq('Proveedor_id', id);

    if (error) {

      console.error("Error al eliminar proveedor:", error);

      showNotification("Error al eliminar proveedor.", "error");

      return;

    }

    showNotification("Proveedor eliminado con éxito", "success");

    loadProveedores();

  } catch (error) {

    console.error("Error en deleteProveedor:", error);

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

  document.getElementById('Nombre').value = '';

  document.getElementById('Contacto').value = '';

  document.getElementById('Telefono').value = '';

  document.getElementById('Email').value = '';

  document.getElementById('Direccion').value = '';

  document.getElementById('Categoria').value = '';

  document.getElementById('Fecha_registro').value = '';

  document.getElementById('Notas').value = '';

}

// Obtener datos del formulario

function getProveedoresData() {

  return {

    Nombre: document.getElementById('Nombre').value,

    Contacto: document.getElementById('Contacto').value,

    Telefono: parseFloat(document.getElementById('Telefono').value),

    Email: document.getElementById('Email').value,

    Direccion: document.getElementById('Direccion').value,

    Categoria: document.getElementById('Categoria').value,

    Fecha_registro: document.getElementById('Fecha_registro').value,

    Notas: document.getElementById('Notas').value,

  };

}