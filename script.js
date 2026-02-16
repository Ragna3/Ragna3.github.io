// Año actual en el footer
document.getElementById('currentYear').textContent = new Date().getFullYear();

// Menú responsive
document.getElementById('menuToggle').addEventListener('click', function() {
    document.getElementById('mainNav').classList.toggle('active');
});

// Cerrar menú al hacer clic en un enlace (en móviles)
document.querySelectorAll('#mainNav a').forEach(link => {
    link.addEventListener('click', function() {
        document.getElementById('mainNav').classList.remove('active');
    });
});

// Scroll suave para los enlaces
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if(targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if(targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Mejora para el mapa: agregar botón de cómo llegar
document.addEventListener('DOMContentLoaded', function() {
    const mapContainer = document.querySelector('.map-container');
    if (mapContainer && !mapContainer.querySelector('.map-actions')) {
        const mapActions = document.createElement('div');
        mapActions.className = 'map-actions';
        mapActions.innerHTML = `
            <a href="https://www.google.com/maps/dir//Octava+Sur+S%2FN,+Los+Naranjos,+San+Sebasti%C3%A1n,+30700+Tapachula+de+C%C3%B3rdova+y+Ord%C3%B3%C3%B1ez,+Chis./@14.9033181,-92.2724105,17z/data=!4m8!4m7!1m0!1m5!1m1!1s0x858e0fac7f644d93:0xadf84f4d44cb55e4!2m2!1d-92.2724105!2d14.9033181" 
               target="_blank" 
               class="directions-btn">
                <i class="fas fa-directions"></i> Cómo llegar
            </a>
        `;
        mapContainer.appendChild(mapActions);
        
        // Agregar estilos para el botón
        const style = document.createElement('style');
        style.textContent = `
            .map-actions {
                position: absolute;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                z-index: 10;
            }
            
            .directions-btn {
                background-color: #D32F2F;
                color: white;
                padding: 12px 24px;
                border-radius: 50px;
                text-decoration: none;
                font-weight: bold;
                display: inline-flex;
                align-items: center;
                gap: 10px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                transition: all 0.3s ease;
            }
            
            .directions-btn:hover {
                background-color: #B71C1C;
                transform: translateY(-2px);
                box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
            }
        `;
        document.head.appendChild(style);
    }
});

// Agregar efecto de carga para imágenes (si se agregarán más tarde)
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        // Estilo inicial para transición
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.5s ease';
    });
});
