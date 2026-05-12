// ==========================================
// 1. ESTADO DE LA APLICACIÓN (Datos)
// ==========================================
let videojuegos = JSON.parse(localStorage.getItem('misJuegos')) || [
    { id: 1, titulo: "The Legend of Zelda", plataforma: "Nintendo Switch", anio: 2023, genero: "Aventura", favorito: true },
    { id: 2, titulo: "Elden Ring", plataforma: "PC", anio: 2022, genero: "RPG", favorito: false }
];

// ==========================================
// 2. FUNCIONES DE RENDERIZADO Y DOM
// ==========================================

// Carga Nav y Footer automáticamente
function cargarComponentes() {
    const body = document.querySelector('body');
    
    // Cargar Menú
    fetch('components/nav.html')
        .then(res => res.text())
        .then(html => body.insertAdjacentHTML('afterbegin', html))
        .catch(err => console.error('Error cargando menú:', err));

    // Cargar Pie de Página
    fetch('components/footer.html')
        .then(res => res.text())
        .then(html => body.insertAdjacentHTML('beforeend', html))
        .catch(err => console.error('Error cargando footer:', err));
}

// Dibuja las tarjetas en pantalla
function renderizarJuegos(listaJuegos = videojuegos) {
    const contenedor = document.getElementById('contenedor-juegos');
    contenedor.innerHTML = ''; 

    if (listaJuegos.length === 0) {
        contenedor.innerHTML = '<p class="text-muted text-center mt-4">No se encontraron videojuegos.</p>';
        return;
    }

    listaJuegos.forEach(juego => {
        const tarjeta = `
            <div class="col-md-6 mb-4">
                <div class="card h-100 border-0 shadow-sm">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start">
                            <h5 class="card-title fw-bold text-truncate" style="max-width: 150px;">${juego.titulo}</h5>
                            <button onclick="cambiarFavorito(${juego.id})" class="btn btn-sm border-0 p-0">
                                <span class="badge ${juego.favorito ? 'bg-warning text-dark' : 'bg-secondary'} rounded-pill">
                                    ${juego.favorito ? '★ Favorito' : '☆ Normal'}
                                </span>
                            </button>
                        </div>
                        <p class="card-text text-muted mb-1"><small>${juego.plataforma} • ${juego.anio}</small></p>
                        <p class="card-text"><span class="badge bg-light text-dark border">${juego.genero || 'Sin género'}</span></p>
                    </div>
                    <div class="card-footer bg-white border-0 text-end">
                        <button onclick="eliminarJuego(${juego.id})" class="btn btn-sm btn-outline-danger">Eliminar</button>
                    </div>
                </div>
            </div>
        `;
        contenedor.innerHTML += tarjeta;
    });

    actualizarEstadisticas();
}

function actualizarEstadisticas() {
    const total = videojuegos.length;
    const favoritos = videojuegos.filter(j => j.favorito).length;
    document.getElementById('stats-total').innerText = `Total de juegos: ${total}`;
    document.getElementById('stats-favoritos').innerText = `Favoritos: ${favoritos}`;
}

// ==========================================
// 3. LÓGICA CRUD
// ==========================================

function guardarEnStorage() {
    localStorage.setItem('misJuegos', JSON.stringify(videojuegos));
}

function agregarJuego(evento) {
    evento.preventDefault();
    const titulo = document.getElementById('titulo').value.trim();
    const plataforma = document.getElementById('plataforma').value;
    const anio = parseInt(document.getElementById('anio').value);
    const genero = document.getElementById('genero').value.trim();
    const favorito = document.getElementById('favorito').checked;
    const alerta = document.getElementById('alerta-error');

    if (titulo === '' || plataforma === '' || isNaN(anio) || anio < 1950 || anio > 2030) {
        alerta.innerText = "Completa los campos obligatorios (*) con datos válidos.";
        alerta.classList.remove('d-none');
        return;
    }

    alerta.classList.add('d-none');
    const nuevoJuego = { id: Date.now(), titulo, plataforma, anio, genero, favorito };

    videojuegos.push(nuevoJuego);
    guardarEnStorage();
    renderizarJuegos();
    document.getElementById('formulario-juego').reset();
}

function eliminarJuego(id) {
    if(confirm("¿Eliminar este videojuego de la colección?")) {
        videojuegos = videojuegos.filter(juego => juego.id !== id);
        guardarEnStorage();
        renderizarJuegos();
    }
}

function cambiarFavorito(id) {
    videojuegos = videojuegos.map(juego => {
        if (juego.id === id) juego.favorito = !juego.favorito;
        return juego;
    });
    guardarEnStorage();
    renderizarJuegos();
}

// ==========================================
// 4. BÚSQUEDA Y FILTROS
// ==========================================

function filtrarJuegos() {
    const textoBuscador = document.getElementById('buscador').value.toLowerCase();
    const textoGenero = document.getElementById('filtro-genero').value.toLowerCase();

    const juegosFiltrados = videojuegos.filter(juego => {
        const coincideTitulo = juego.titulo.toLowerCase().includes(textoBuscador);
        const coincideGenero = juego.genero.toLowerCase().includes(textoGenero);
        return coincideTitulo && coincideGenero;
    });

    renderizarJuegos(juegosFiltrados);
}

// ==========================================
// 5. INICIO
// ==========================================
window.addEventListener('DOMContentLoaded', () => {
    cargarComponentes();
    renderizarJuegos();

    document.getElementById('formulario-juego').addEventListener('submit', agregarJuego);
    document.getElementById('buscador').addEventListener('input', filtrarJuegos);
    document.getElementById('filtro-genero').addEventListener('input', filtrarJuegos);
});