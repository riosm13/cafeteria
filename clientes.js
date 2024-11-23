// Configuración de Supabase 

const supabaseUrl = 'https://egakurwqaikfjbxwvmhz.supabase.co'; // Tu URL de Supabase 

const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnYWt1cndxYWlrZmpieHd2bWh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA0MDc2OTUsImV4cCI6MjA0NTk4MzY5NX0.l2rRqLzFWc5rSJ8FJy-4GEQoz-DkCimbzkY7BLsKm1U'; // Tu clave pública de Supabase 

const supabase = window.supabase.createClient(supabaseUrl, supabaseKey); 

// Cargar clientes al inicio 

window.onload = async function() { 

  console.log("Cargando clientes..."); 

  await loadClientes(); 

}; 

  

// Función para cargar los clientes

async function loadClientes() { 

  try { 

    const { data: clientes, error } = await supabase.from('clientes').select('*'); 

    if (error) { 

      console.error("Error al cargar clientes:", error); 

      return; 

    } 

     

    const clientesBody = document.getElementById('clientesBody'); 

    clientesBody.innerHTML = ''; // Limpiar tabla 


    clientes.forEach(cliente => { 

      const row = document.createElement('tr'); 

      row.innerHTML = ` 

        <td>${cliente.cliente_id}</td>  

        <td>${cliente.Nombre}</td> 

        <td>${cliente.Genero}</td> 

        <td>${cliente.Email}</td> 

        <td>${cliente.Telefono}</td>  

        <td>${cliente.Preferencia_pago}</td> 

        <td>${cliente.Notas}</td> <!-- Cambié 'Notas' por 'notas' --> 

      `; 

      clientesBody.appendChild(row); 

    }); 

    console.log("Clientes cargados exitosamente."); 

  } catch (error) { 

    console.error("Error en loadClientes:", error); 

  } 

} 

  

async function addCliente() { 

  const cliente = getClienteData(); 

  if (!cliente.Nombre || !cliente.Email || !cliente.Telefono) { 

    showNotification("Por favor, completa todos los campos requeridos.", "error"); 

    return; 

  } 

  

  try { 

    const { data, error } = await supabase.from('clientes').insert([cliente]); 

    if (error) { 

      console.error("Error al agregar cliente:", error); 

      return; 

    } 

    showNotification("Cliente agregado con éxito", "success");

    clearForm(); 

    loadClientes(); 

  } catch (error) { 

    console.error("Error en addCliente:", error);

    showNotification("Ocurrió un error inesperado.", "error"); 

  } 

} 

  

async function updateCliente() { 

  const cliente = getClienteData(); 

  const id = prompt("Ingrese el ID del cliente a actualizar:"); 

  if (!id) { 

    showNotification("Por favor, ingrese un ID válido.", "error"); 

    return; 

  } 

  

  if (!cliente.Nombre || !cliente.Email || !cliente.Telefono) { 

    showNotification("Por favor, complete todos los campos requeridos.", "error"); 

    return; 

  } 

  

  try { 

    const { data, error } = await supabase.from('clientes').update(cliente).eq('cliente_id', id); // Cambié 'id' por 'cliente_id' 

    if (error) { 

      console.error("Error al actualizar cliente:", error); 

      showNotification("Error al actualizar cliente.", "error");

      return; 

    } 

    showNotification("Cliente actualizado con éxito.", "success");

    clearForm(); 

    loadClientes(); 

  } catch (error) { 

    console.error("Error en updateCliente:", error); 

    showNotification("Ocurrió un error inesperado.", "error");

  } 

} 

  

async function deleteCliente() { 

  const id = prompt("Ingrese el ID del cliente a eliminar:"); 

  if (!id) { 

    showNotification("Por favor, ingrese un ID válido.", "error"); 

    return; 

  } 

  

  try { 

    const { data, error } = await supabase.from('clientes').delete().eq('cliente_id', id); // Cambié 'id' por 'cliente_id' 

    if (error) { 

      console.error("Error al eliminar cliente:", error); 

      showNotification("Error al eliminar cliente.", "error");

      return; 

    } 

    showNotification("Cliente eliminado con éxito", "success");

    loadClientes(); 

  } catch (error) { 

    console.error("Error en deleteCliente:", error); 
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

  document.getElementById('Genero').value = ''; 

  document.getElementById('Email').value = ''; 

  document.getElementById('Telefono').value = ''; 

  document.getElementById('Preferencia_pago').value = ''; 

  document.getElementById('Notas').value = ''; 

} 

  

// Obtener datos del formulario
function getClienteData() { 

  return { 

    Nombre: document.getElementById('Nombre').value, 

    Genero: document.getElementById('Genero').value, 

    Email: document.getElementById('Email').value, 

    Telefono: document.getElementById('Telefono').value, 

    Preferencia_pago: document.getElementById('Preferencia_pago').value, 

    Notas: document.getElementById('Notas').value, 

  }; 

} 

 