const supabaseUrl = 'https://egakurwqaikfjbxwvmhz.supabase.co'; // Tu URL de Supabase
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnYWt1cndxYWlrZmpieHd2bWh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA0MDc2OTUsImV4cCI6MjA0NTk4MzY5NX0.l2rRqLzFWc5rSJ8FJy-4GEQoz-DkCimbzkY7BLsKm1U'; // Tu clave pública de Supabase
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// Cargar pedidos al inicio

window.onload = async function() {
    console.log("Cargando pedidos...");
    await loadPedidos();
};

// Función para cargar los pedidos
async function loadPedidos() {
    try {
        const { data: pedidos, error } = await supabase.from('pedidos').select('*');
        if (error) {
            console.error("Error al cargar pedidos:", error);
            return;
        }

        const pedidosBody = document.getElementById('pedidosBody');

        pedidosBody.innerHTML = ''; // Limpiar tabla

        pedidos.forEach(pedido => {

            const row = document.createElement('tr');

            row.innerHTML = `

                <td>${pedido.pedido_id}</td>

                <td>${pedido.cliente_id}</td>

                <td>${new Date(pedido.Fecha_pedido).toLocaleString()}</td>

                <td>${pedido.Estado}</td>

                <td>${pedido.Tipo}</td>

                <td>${pedido.Cantidad}</td>

                <td>${pedido.menu_id}</td>

                <td>${pedido.Metodo_pago}</td>

                <td>${pedido.Descuento}</td>

                <td>${pedido.Notas}</td>

                <td>${pedido.empleado_id}</td>
            `;

            pedidosBody.appendChild(row);

        });

        console.log("Pedidos cargados exitosamente.");

    } catch (error) {

        console.error("Error en loadPedidos:", error);

    }
}


// Función para agregar un pedido

async function addPedido() {

    const pedido = getPedidoData();

    if (!pedido.cliente_id || !pedido.Cantidad || !pedido.menu_id) {

        showNotification("Por favor, completa todos los campos requeridos.", "error");
        return;

    }

    try {

        const { data, error } = await supabase.from('pedidos').insert([pedido]);

        if (error) {

            console.error("Error al agregar pedido:", error);

            showNotification("Error al agregar el pedido.", "error");

            return;

        }

        showNotification("Pedido agregado con éxito", "success");

        clearForm();

        loadPedidos();

    } catch (error) {

        console.error("Error en addPedido:", error);

        showNotification("Ocurrió un error inesperado.", "error");

    }

}

// Función para actualizar un pedido

async function updatePedido() {

  const pedido = getPedidoData();

  const id = prompt("Ingresa el ID del pedido a actualizar");

  if (!id) {

    showNotification("Por favor, ingresa un ID válido.", "error");

    return;

  }


  if (!pedido.cliente_id || !pedido.Cantidad || !pedido.menu_id) {

    showNotification("Por favor, completa todos los campos requeridos.", "error");

    return;

  }

  try {

    const { data, error } = await supabase.from('pedidos').update(pedido).eq('pedido_id', id);

    if (error) {

      console.error("Error al actualizar pedido", error);

      showNotification("Error al actualizar pedido.", "error");

      return;

    }

    showNotification("Pedido actualizado con éxito.", "success");

    clearForm();

    loadPedidos();

  } catch (error) {

    console.error("Error en updatePedido:", error);

    showNotification("Ocurrió un error inesperado.", "error");

  }

}

// Función para eliminar un pedido
async function deletePedido() {

  const id = prompt("Ingresa el ID del pedido a eliminar:");

  if (!id) {

    showNotification("Por favor, ingresa un ID válido.", "error");

    return;

  }



  try {

    const { data, error } = await supabase.from('pedidos').delete().eq('pedido_id', id);

    if (error) {

      console.error("Error al eliminar pedido:", error);

      showNotification("Error al eliminar pedido.", "error");

      return;

    }

    showNotification("Pedido eliminado con éxito", "success");

    loadPedidos();

  } catch (error) {

    console.error("Error en deletePedido:", error);
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

  document.getElementById('Fecha_pedido').value = '';

  document.getElementById('Estado').value = '';

  document.getElementById('Tipo').value = '';

  document.getElementById('Cantidad').value = '';

  document.getElementById('menu_id').value = '';

  document.getElementById('Metodo_pago').value = '';

  document.getElementById('Descuento').value = '';

  document.getElementById('Notas').value = '';

  document.getElementById('empleado_id').value = '';

}


// Función para obtener datos del formulario

function getPedidoData() {

    return {

        cliente_id: parseInt(document.getElementById('cliente_id').value),

        Fecha_pedido: new Date().toISOString(),

        Estado: document.getElementById('Estado').value,

        Tipo: document.getElementById('Tipo').value,

        Cantidad: parseInt(document.getElementById('Cantidad').value),

        menu_id: parseInt(document.getElementById('menu_id').value),

        Metodo_pago: document.getElementById('Metodo_pago').value,

        Descuento: parseFloat(document.getElementById('Descuento').value),

        Notas: document.getElementById('Notas').value,

        empleado_id: parseInt(document.getElementById('empleado_id').value)

    };

}
