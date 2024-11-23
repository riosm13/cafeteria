async function checkInventoryNotifications() {
    try {
        // Obtener los datos de inventario desde la base de datos
        const { data: inventory, error } = await supabase.from('inventario').select('Nombre, Cantidad_disponible, Punto_reorden, Unidad_medida');

        if (error) {
            console.error("Error al cargar el inventario:", error);
            return;
        }

        // Contenedor de notificaciones
        const notificationContainer = document.getElementById('notification-container');
        const noNotifications = document.getElementById('no-notifications');

        // Limpiar notificaciones previas
        notificationContainer.innerHTML = '';

        let hasNotifications = false;

        // Iterar por el inventario para verificar el punto de reorden
        inventory.forEach(item => {
            if (item.Cantidad_disponible <= item.Punto_reorden) {
                hasNotifications = true;

                // Crear una notificación
                const notification = document.createElement('div');
                notification.classList.add('notification');
                notification.innerHTML = `
                    <p><strong>${item.Nombre}</strong> está cerca o por debajo del punto de reorden.</p>
                    <p>Cantidad disponible: ${item.Cantidad_disponible} ${item.Unidad_medida}</p>
                `;
                notificationContainer.appendChild(notification);
            }
        });

        // Mostrar mensaje de "No hay notificaciones" si no hay alertas
        if (!hasNotifications) {
            notificationContainer.innerHTML = '<p id="no-notifications">No hay notificaciones recientes</p>';
        }
    } catch (error) {
        console.error("Error al verificar notificaciones del inventario:", error);
    }
}

// Llama a la función al cargar la página
document.addEventListener('DOMContentLoaded', checkInventoryNotifications);
