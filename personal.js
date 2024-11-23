// Configuración de Supabase 

const supabaseUrl = 'https://egakurwqaikfjbxwvmhz.supabase.co'; // Tu URL de Supabase 

const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnYWt1cndxYWlrZmpieHd2bWh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA0MDc2OTUsImV4cCI6MjA0NTk4MzY5NX0.l2rRqLzFWc5rSJ8FJy-4GEQoz-DkCimbzkY7BLsKm1U'; // Tu clave pública de Supabase 

const supabase = window.supabase.createClient(supabaseUrl, supabaseKey); 



// Cargar personal al inicio

window.onload = async function() {

  console.log("Cargando personal...");

  await loadPersonal();

};

// Función para cargar los empleados

async function loadPersonal() {

  try {

    const { data: personal, error } = await supabase.from('personal').select('*');

    if (error) {

      console.error("Error al cargar personal:", error);

      return;
    }

    // Verificar la estructura de los datos

    const personalBody = document.getElementById('personalBody');

    personalBody.innerHTML = ''; // Limpiar tabla


    personal.forEach(personal => {

      const row = document.createElement('tr');

      row.innerHTML = `

        <td>${personal.empleado_id}</td>

        <td>${personal.Nombre}</td>

        <td>${personal.Apellido_p}</td>

        <td>${personal.Apellido_m}</td>

        <td>${personal.Puesto}</td>

        <td>${personal.Area}</td>

        <td>${personal.Telefono}</td>

        <td>${personal.Email}</td>

        <td>${personal.Fecha_contratacion}</td>

        <td>${personal.Estado_empleado}</td>

        <td>${personal.Salario_quincenal}</td>

        <td>${personal.Turno_inicio}</td>

        <td>${personal.Turno_fin}</td>

        <td>${personal.Notas}</td>

      `;

      personalBody.appendChild(row);

    });

    console.log("Personal cargado exitosamente.");

  } catch (error) {

    console.error("Error en loadPersonal:", error);

  }

}

// Función para agregar un empleado

async function addPersonal() {

  const personal = getPersonalData();

  if (!personal.Nombre || !personal.Apellido_p || !personal.Apellido_m || !personal.Puesto) {

    showNotification("Por favor, complete todos los campos requeridos.", "error");

    return;

  }


  try {

    const { data, error } = await supabase.from('personal').insert([personal]);

    if (error) {

      console.error("Error al agregar empleado:", error);

      showNotification("Error al agregar empleado.", "error");

      return;

    }

    showNotification("Empleado agregado con éxito", "success");

    clearForm();

    loadPersonal();

  } catch (error) {

    console.error("Error en addPersonal:", error);

    showNotification("Ocurrió un error inesperado.", "error");

  }

}


// Función para actualizar un empleado

async function updatePersonal() {

  const personal = getPersonalData();

  const id = prompt("Ingrese el ID del producto a actualizar");

  if (!id) {

    showNotification("Por favor, ingrese un ID válido.", "error");

    return;

  }


  if (!personal.Nombre || !personal.Apellido_p || !personal.Apellido_m || !personal.Puesto) {
    showNotification("Por favor, complete todos los campos requeridos.", "error");

    return;

  }



  try {

    const { data, error } = await supabase.from('personal').update(personal).eq('empleado_id', id);

    if (error) {

      console.error("Error al actualizar empleado", error);

      showNotification("Error al actualizar empleado.", "error");

      return;

    }

    showNotification("Empleado actualizado con éxito.", "success");

    clearForm();

    loadPersonal();

  } catch (error) {

    console.error("Error en updatePersonal:", error);

    showNotification("Ocurrió un error inesperado.", "error");

  }

}

// Función para eliminar un empleado
async function deletePersonal() {

  const id = prompt("Ingrese el ID del empleado a eliminar:");

  if (!id) {

    showNotification("Por favor, ingresa un ID válido.", "error");

    return;

  }



  try {

    const { data, error } = await supabase.from('personal').delete().eq('empleado_id', id);

    if (error) {

      console.error("Error al eliminar empleado:", error);

      showNotification("Error al eliminar empleado.", "error");

      return;

    }

    showNotification("Empleado eliminado con éxito", "success");

    loadPersonal();

  } catch (error) {

    console.error("Error en deletePersonal:", error);

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

  document.getElementById('Apellido_p').value = '';

  document.getElementById('Apellido_m').value = '';

  document.getElementById('Puesto').value = '';

  document.getElementById('Area').value = '';

  document.getElementById('Telefono').value = '';

  document.getElementById('Email').value = '';

  document.getElementById('Fecha_contratacion').value = '';

  document.getElementById('Estado_empleado').value = '';

  document.getElementById('Salario_quincenal').value = '';

  document.getElementById('Turno_inicio').value = '';

  document.getElementById('Turno_fin').value = '';

  document.getElementById('Notas').value = '';

}

// Obtener datos del formulario

function getPersonalData() {

  return {

    Nombre: document.getElementById('Nombre').value,

    Apellido_p: document.getElementById('Apellido_p').value,

    Apellido_m: document.getElementById('Apellido_m').value,

    Puesto: document.getElementById('Puesto').value,

    Area: document.getElementById('Area').value,

    Telefono: parseFloat(document.getElementById('Telefono').value),

    Email: document.getElementById('Email').value,

    Fecha_contratacion: document.getElementById('Fecha_contratacion').value,

    Estado_empleado: document.getElementById('Estado_empleado').value,

    Salario_quincenal: parseFloat(document.getElementById('Salario_quincenal').value),

    Turno_inicio: document.getElementById('Turno_inicio').value,

    Turno_fin: document.getElementById('Turno_fin').value,

    Notas: document.getElementById('Notas').value,


  };

}
