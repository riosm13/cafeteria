// Configuración de Supabase 

const supabaseUrl = 'https://egakurwqaikfjbxwvmhz.supabase.co'; // Tu URL de Supabase 

const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnYWt1cndxYWlrZmpieHd2bWh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA0MDc2OTUsImV4cCI6MjA0NTk4MzY5NX0.l2rRqLzFWc5rSJ8FJy-4GEQoz-DkCimbzkY7BLsKm1U'; // Tu clave pública de Supabase 

const supabase = window.supabase.createClient(supabaseUrl, supabaseKey); 



// Cargar inventario al inicio

window.onload = async function() {

  console.log("Cargando inventario...");

  await loadInventario();

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


// Función para cargar los productos del inventario

async function loadInventario() {

  try {

    const { data: inventario, error } = await supabase.from('inventario').select('*');

    if (error) {

      console.error("Error al cargar inventario:", error);

      return;
    }



    // Verificar la estructura de los datos

    const inventarioBody = document.getElementById('inventarioBody');

    inventarioBody.innerHTML = ''; // Limpiar tabla


    inventario.forEach(inventario => {

      const row = document.createElement('tr');

      row.innerHTML = `

        <td>${inventario.item_id}</td>

        <td>${inventario.Nombre}</td>

        <td>${inventario.Descripcion}</td>

        <td>${inventario.Cantidad_disponible}</td>

        <td>${inventario.Unidad_medida}</td>

        <td>${inventario.Costo_unitario}</td>

        <td>${inventario.Punto_reorden}</td>

        <td>${formatFecha(inventario.Fecha_actualizacion)}</td>

        <td>${inventario.Codigo_barras}</td>

        <td>${inventario.Fecha_vencimiento}</td>

        <td>${inventario.Observaciones}</td>

        <td>${inventario.Categoria}</td>

        <td>${inventario.Proveedor_id}</td>

        <td>${inventario.Disponibilidad}</td>

      `;

      inventarioBody.appendChild(row);

    });

    console.log("Inventario cargado exitosamente.");

  } catch (error) {

    console.error("Error en loadInventario:", error);

  }

}

// Función para agregar un producto al inventario

async function addInventario() {

  const inventario = getInventarioData();

  if (!inventario.Nombre || !inventario.Descripcion || !inventario.Cantidad_disponible || !inventario.Unidad_medida) {

    showNotification("Por favor, complete todos los campos requeridos.", "error");

    return;

  }


  try {

    const { data, error } = await supabase.from('inventario').insert([inventario]);

    if (error) {

      console.error("Error al agregar producto:", error);

      showNotification("Error al agregar el producto.", "error");

      return;

    }

    showNotification("Producto agregado con éxito", "success");

    clearForm();

    loadInventario();

  } catch (error) {

    console.error("Error en addInventario:", error);

    showNotification("Ocurrió un error inesperado.", "error");

  }

}


// Función para actualizar un producto

async function updateInventario() {

  const inventario = getInventarioData();

  const id = prompt("Ingrese el ID del producto a actualizar");

  if (!id) {

    showNotification("Por favor, ingrese un ID válido.", "error");

    return;

  }


  if (!inventario.Nombre || !inventario.Descripcion || !inventario.Cantidad_disponible || !inventario.Unidad_medida) {

    showNotification("Por favor, complete todos los campos requeridos.", "error");

    return;

  }



  try {

    const { data, error } = await supabase.from('inventario').update(inventario).eq('item_id', id);

    if (error) {

      console.error("Error al actualizar producto", error);

      showNotification("Error al actualizar el producto.", "error");

      return;

    }

    showNotification("Producto actualizado con éxito.", "success");

    clearForm();

    loadInventario();

  } catch (error) {

    console.error("Error en updateInventario:", error);

    showNotification("Ocurrió un error inesperado.", "error");

  }

}



// Función para eliminar un producto del inventario
async function deleteInventario() {

  const id = prompt("Ingrese el ID del producto a eliminar:");

  if (!id) {

    showNotification("Por favor, ingresa un ID válido.", "error");

    return;

  }



  try {

    const { data, error } = await supabase.from('inventario').delete().eq('item_id', id);

    if (error) {

      console.error("Error al eliminar producto:", error);

      showNotification("Error al eliminar el producto.", "error");

      return;

    }

    showNotification("Producto eliminado con éxito", "success");

    loadInventario();

  } catch (error) {

    console.error("Error en deleteInventario:", error);

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

  document.getElementById('Descripcion').value = '';

  document.getElementById('Cantidad_disponible').value = '';

  document.getElementById('Unidad_medida').value = '';

  document.getElementById('Costo_unitario').value = '';

  document.getElementById('Punto_reorden').value = '';

  document.getElementById('Fecha_actualizacion').value = '';

  document.getElementById('Codigo_barras').value = '';

  document.getElementById('Fecha_vencimiento').value = '';

  document.getElementById('Observaciones').value = '';

  document.getElementById('Categoria').value = '';

  document.getElementById('Proveedor_id').value = '';

  document.getElementById('Disponibilidad').value = '';

}



// Obtener datos del formulario

function getInventarioData() {

  return {

    Nombre: document.getElementById('Nombre').value,

    Descripcion: document.getElementById('Descripcion').value,

    Cantidad_disponible: document.getElementById('Cantidad_disponible').value,

    Unidad_medida: parseInt(document.getElementById('Unidad_medida').value),

    Costo_unitario: document.getElementById('Costo_unitario').value,

    Punto_reorden: parseFloat(document.getElementById('Punto_reorden').value),

    Fecha_actualizacion: new Date().toISOString(),  // Asigna la fecha y hora actual en formato ISO

    Codigo_barras: document.getElementById('Codigo_barras').value,

    Fecha_vencimiento: document.getElementById('Fecha_vencimiento').value,

    Observaciones: document.getElementById('Observaciones').value,

    Categoria: document.getElementById('Categoria').value,

    Proveedor_id: document.getElementById('Proveedor_id').value,

    Disponibilidad: document.getElementById('Disponibilidad').value,

  };

}

