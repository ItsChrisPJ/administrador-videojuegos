// 1. FUNCIÓN PARA CARGAR COMPONENTES REUTILIZABLES (Uso de fetch)
function cargarComponentes() {
    // Busca el inicio del body para inyectar el menú
    const body = document.querySelector('body');
    
    fetch('components/nav.html')
        .then(respuesta => respuesta.text())
        .then(html => {
            // Inserta el HTML del menú justo al principio del body
            body.insertAdjacentHTML('afterbegin', html);
        })
        .catch(error => console.error('Error cargando el menú:', error));
}

// 2. ARREGLO DE OBJETOS CON LOCALSTORAGE
// Intentamos cargar los juegos guardados. Si no hay ninguno, cargamos los de prueba.
let videojuegos = JSON.parse(localStorage.getItem('misJuegos')) || [
    { id: 1, titulo: "The Legend of Zelda", plataforma: "Nintendo Switch", anio: 2023, genero: "Aventura", favorito: true },
    { id: 2, titulo: "Elden Ring", plataforma: "PC", anio: 2022, genero: "RPG", favorito: false },
    { id: 3, titulo: "Hollow Knight", plataforma: "PS5", anio: 2017, genero: "Metroidvania", favorito: true }
];

// FUNCIÓN PARA ACTUALIZAR LOCALSTORAGE
// Esta función la llamaremos cada vez que agreguemos o eliminemos un juego
function actualizarLocalStorage() {
    localStorage.setItem('misJuegos', JSON.stringify(videojuegos));
}

// 3. FUNCIÓN PARA MANIPULAR EL DOM Y RENDERIZAR JUEGOS
function renderizarJuegos() {
    const contenedor = document.getElementById('contenedor-juegos');
    
    // Limpiamos el contenedor antes de volver a dibujar
    contenedor.innerHTML = '';

    // Recorremos el arreglo de videojuegos
    videojuegos.forEach(juego => {
        // Creamos un div para cada tarjeta manteniendo un diseño simple y sin bordes pesados
        const tarjetaHTML = `
            <div class="col-md-6 mb-4">
                <div class="card h-100 border-0 shadow-sm">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start">
                            <h5 class="card-title fw-bold">${juego.titulo}</h5>
                            <span class="badge ${juego.favorito ? 'bg-warning text-dark' : 'bg-secondary'} rounded-pill">
                                ${juego.favorito ? '★ Favorito' : 'Normal'}
                            </span>
                        </div>
                        <p class="card-text text-muted mb-1"><small>${juego.plataforma} • ${juego.anio}</small></p>
                        <p class="card-text"><span class="badge bg-light text-dark border">${juego.genero}</span></p>
                    </div>
                    <div class="card-footer bg-white border-0 text-end">
                        <button class="btn btn-sm btn-outline-danger">Eliminar</button>
                    </div>
                </div>
            </div>
        `;
        // Inyectamos la tarjeta en el HTML
        contenedor.innerHTML += tarjetaHTML;
    });
}

// 4. INICIALIZAR LA APLICACIÓN
// Cuando la ventana cargue, ejecutamos nuestras funciones principales
window.addEventListener('DOMContentLoaded', () => {
    cargarComponentes();
    renderizarJuegos();
});