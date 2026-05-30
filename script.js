// =============================================
// HEROICO CUERPO DE BOMBEROS TAPACHULA
// Script principal — versión animada
// =============================================

/* ============ PRELOADER ============ */
(function () {
    const preloader = document.getElementById('preloader');
    const bar       = document.getElementById('preloaderBar');
    const percent   = document.getElementById('preloaderPercent');
    if (!preloader || !bar || !percent) return;
    let progress = 0;

    const interval = setInterval(() => {
        const increment = progress < 80 ? Math.random() * 12 + 4 : Math.random() * 2 + 0.5;
        progress = Math.min(progress + increment, 99);
        bar.style.width     = progress + '%';
        percent.textContent = Math.floor(progress) + '%';
    }, 120);

    function finishLoader() {
        clearInterval(interval);
        bar.style.width     = '100%';
        percent.textContent = '100%';
        setTimeout(() => {
            preloader.classList.add('hidden');
            document.querySelectorAll('.hero-content > *').forEach((el, i) => {
                el.style.animation = `fadeInUp 0.7s ease ${i * 0.15}s both`;
            });
        }, 400);
    }

    if (document.readyState === 'complete') {
        finishLoader();
    } else {
        window.addEventListener('load', finishLoader);
        setTimeout(finishLoader, 4000);
    }
})();

/* ============ AÑO ACTUAL ============ */
document.getElementById('currentYear').textContent = new Date().getFullYear();

/* ============ MENÚ RESPONSIVE ============ */
const menuToggle = document.getElementById('menuToggle');
const mainNav    = document.getElementById('mainNav');

// Crear overlay dinámicamente
const navOverlay = document.createElement('div');
navOverlay.className = 'nav-overlay';
navOverlay.id = 'navOverlay';
document.body.appendChild(navOverlay);

function openMenu() {
    mainNav.classList.add('active');
    navOverlay.classList.add('active');
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    const chatbot = document.querySelector('.chatbot-container');
    if (chatbot) chatbot.style.display = 'none';
}
function closeMenu() {
    mainNav.classList.remove('active');
    navOverlay.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    const chatbot = document.querySelector('.chatbot-container');
    if (chatbot) chatbot.style.display = '';
}

menuToggle.addEventListener('click', () => {
    mainNav.classList.contains('active') ? closeMenu() : openMenu();
});
navOverlay.addEventListener('click', closeMenu);
document.querySelectorAll('#mainNav a').forEach(link => {
    // No cerrar el menú al clickear links que tienen dropdown
    if (!link.closest('.has-dropdown') || link.closest('.dropdown')) {
        link.addEventListener('click', closeMenu);
    }
});
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
});

/* ============ HEADER SCROLL ============ */
const header = document.getElementById('mainHeader');
// Ajustar padding-top del body según la altura real del header
document.body.style.paddingTop = header.offsetHeight + 'px';
window.addEventListener('resize', () => {
    document.body.style.paddingTop = header.offsetHeight + 'px';
});

let lastScrollY = window.scrollY;
window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    header.classList.toggle('scrolled', currentScrollY > 60);
    const diff = currentScrollY - lastScrollY;
    if (diff > 5 && currentScrollY > 100) {
        header.classList.add('header-hidden');
    } else if (diff < -5) {
        header.classList.remove('header-hidden');
    }
    lastScrollY = currentScrollY;
}, { passive: true });

/* ============ SCROLL SUAVE ============ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            window.scrollTo({ top: target.offsetTop - (header.offsetHeight + 8), behavior: 'smooth' });
        }
    });
});

/* ============ HERO SLIDER ============ */
const slides = document.querySelectorAll('.hero-slide');
const dots   = document.querySelectorAll('.dot');
let currentSlide = 0;
let sliderInterval;

if (slides.length > 0) {
    function goToSlide(idx) {
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        currentSlide = idx;
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }
    function nextSlide() { goToSlide((currentSlide + 1) % slides.length); }
    function startSlider() { sliderInterval = setInterval(nextSlide, 5000); }
    startSlider();
    dots.forEach(dot => {
        dot.addEventListener('click', function () {
            clearInterval(sliderInterval);
            goToSlide(parseInt(this.dataset.idx));
            startSlider();
        });
    });
}

/* ============ PARALLAX EN EL HERO ============ */
const heroSlideEls = document.querySelectorAll('.hero-slide');
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(() => {
            const scrollY = window.scrollY;
            if (scrollY < window.innerHeight) {
                heroSlideEls.forEach(slide => {
                    slide.style.transform = `translateY(${scrollY * 0.35}px)`;
                });
            }
            ticking = false;
        });
        ticking = true;
    }
}, { passive: true });

/* ============ SCROLL REVEAL ============ */
function initReveal() {
    // Sistema 100% seguro: los elementos SIEMPRE son visibles.
    // El observer solo añade una clase de animación al entrar al viewport.
    // Nunca se aplica opacity:0 de forma previa — sin riesgo de elementos ocultos.

    const safeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('safe-animated');
                safeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px 0px 0px' });

    const targets = [
        '.section-title', '.section-sub',
        '.stat-item',
        '.servicio-card', '.galeria-item',
        '.noticia-card', '.estructura-card',
        '.contacto-item', '.prev-col',
        '.voluntariado-text', '.voluntariado-img',
        '.dona-btn', '.donaciones-text', '.donaciones-metodos',
        '.estacion-info', '.footer-col', '.footer-brand',
        '.nosotros-img', '.nosotros-text',
    ];

    document.querySelectorAll(targets.join(', ')).forEach((el, i) => {
        // Stagger suave según posición en el DOM
        const delay = Math.min((i % 5) * 0.08, 0.32);
        el.style.animationDelay = delay + 's';
        safeObserver.observe(el);
    });
}
window.addEventListener('load', () => setTimeout(initReveal, 500));

/* ============ CONTADOR DE ESTADÍSTICAS ============ */
function animateCounter(el, target, suffix, duration) {
    duration = duration || 1800;
    const startTime = performance.now();
    function update(currentTime) {
        const elapsed  = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased    = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        el.textContent = Math.floor(eased * target).toLocaleString('es-MX') + suffix;
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = target.toLocaleString('es-MX') + suffix;
    }
    requestAnimationFrame(update);
}

const statsSection = document.querySelector('.stats-section');
let statsTriggered = false;
if (statsSection) {
    new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !statsTriggered) {
            statsTriggered = true;
            document.querySelectorAll('.stat-item').forEach((item, i) => {
                const target = parseInt(item.dataset.target);
                const suffix = item.dataset.suffix || '';
                const numEl  = item.querySelector('.stat-number');
                setTimeout(() => animateCounter(numEl, target, suffix), i * 150);
            });
        }
    }, { threshold: 0.3 }).observe(statsSection);
}

/* ============ BOTÓN VOLVER ARRIBA ============ */
const backToTop = document.getElementById('backToTop');
if (backToTop) {
    window.addEventListener('scroll', () => {
        backToTop.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ============ TABS ESTACIONES ============ */
const etabs  = document.querySelectorAll('.etab');
const panels = document.querySelectorAll('.estacion-panel');
etabs.forEach(tab => {
    tab.addEventListener('click', function () {
        etabs.forEach(t => t.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        this.classList.add('active');
        document.getElementById(this.dataset.tab).classList.add('active');
    });
});

/* ============ TABS PREVENCIÓN ============ */
const ptabs      = document.querySelectorAll('.ptab');
const prevPanels = document.querySelectorAll('.prev-panel');
ptabs.forEach(tab => {
    tab.addEventListener('click', function () {
        ptabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected','false'); });
        prevPanels.forEach(p => p.classList.remove('active'));
        this.classList.add('active');
        this.setAttribute('aria-selected','true');
        const target = document.getElementById('panel-' + this.dataset.panel);
        if (target) target.classList.add('active');
    });
});

/* ============ MODALES ============ */
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', e => { if (e.target === modal) modal.style.display = 'none'; });
});
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
});

/* ============ SIDEBAR FLOTANTE ============ */
const floatingSidebar = document.getElementById('floatingSidebar');
if (floatingSidebar) {
    floatingSidebar.style.cssText = 'opacity:0;transform:translateY(-50%) translateX(-100%);transition:opacity 0.4s ease,transform 0.4s ease;';
    window.addEventListener('scroll', () => {
        if (window.scrollY > 200) {
            floatingSidebar.style.opacity   = '1';
            floatingSidebar.style.transform = 'translateY(-50%) translateX(0)';
        } else {
            floatingSidebar.style.opacity   = '0';
            floatingSidebar.style.transform = 'translateY(-50%) translateX(-100%)';
        }
    }, { passive: true });
}

/* ============ CHATBOT ============ */
const chatbotToggle   = document.getElementById('chatbotToggle');
const chatbotWindow   = document.getElementById('chatbotWindow');
const chatbotClose    = document.getElementById('chatbotClose');
const chatbotMessages = document.getElementById('chatbotMessages');
const chatOptions     = document.getElementById('chatOptions');
const chatReset       = document.getElementById('chatReset');
const chatbotBadge    = document.getElementById('chatbotBadge');

const RESPONSES = {
    emergencia: { q:'🚨 ¿Cómo reportar una emergencia?', a:'🚨 <strong>Llama inmediatamente al <a href="tel:911" style="color:#C62828;font-weight:700;">911</a></strong>.<br><br>También puedes marcar <a href="tel:9626252065" style="color:#C62828;font-weight:700;">(962) 625-2065</a>. Disponibles <strong>24/7, los 365 días</strong>.' },
    telefono:   { q:'📞 ¿Cuáles son sus teléfonos?',    a:'📞 <strong>Emergencias:</strong> <a href="tel:911" style="color:#C62828">911</a><br><strong>Directo:</strong> <a href="tel:9626252065" style="color:#C62828">(962) 625-2065</a><br>Ambas activas <strong>24/7</strong>.' },
    ubicacion:  { q:'📍 ¿Dónde están ubicados?',         a:'📍 <strong>Estación Central:</strong><br>Octava Sur S/N, Los Naranjos, San Sebastián, Tapachula, Chis.<br><br>Ver mapa en <a href="#estaciones" style="color:#C62828">Estaciones</a>.' },
    servicios:  { q:'🔥 ¿Qué servicios ofrecen?',        a:'🔥 • Incendios estructurales y forestales<br>• Fugas de gas LP<br>• Rescate técnico<br>• Atención médica prehospitalaria<br>• Control de inundaciones<br>• Capacitación<br><br>Ver <a href="#servicios" style="color:#C62828">Servicios</a>.' },
    voluntariado:{ q:'🙋 ¿Cómo ser voluntario?',         a:'🙋 Requisitos:<br>• Mayor de 18 años<br>• 40 h/mes disponibles<br>• Documentación de ID<br>• Entrevista con Comandante<br>• Entrenamiento especial<br><br>📞 <a href="tel:9626252065" style="color:#C62828">(962) 625-2065</a>' },
    horario:    { q:'🕐 ¿Cuál es su horario?',           a:'🕐 <strong>Emergencias:</strong> 24/7, 365 días<br><strong>Oficina:</strong><br>Lun–Vie 8:00–18:00<br>Sáb 9:00–13:00' },
    donacion:   { q:'❤️ ¿Cómo puedo donar?',             a:'❤️ Puedes donar por:<br>• Transferencia bancaria<br>• Depósito en OXXO<br>• En persona en nuestras instalaciones<br><br>Ver <a href="#donaciones" style="color:#C62828">Donaciones</a>.' },
};

function getTime() {
    const n = new Date();
    return n.getHours().toString().padStart(2,'0')+':'+n.getMinutes().toString().padStart(2,'0');
}

if (chatbotToggle && chatbotWindow && chatbotMessages) {

    function addMsg(html, type) {
        const div = document.createElement('div');
        div.className = `chat-msg ${type}`;
        div.innerHTML = `<div class="chat-bubble">${html}</div><span class="chat-time">${getTime()}</span>`;
        chatbotMessages.appendChild(div);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
    function bindOptionButtons() {
        document.querySelectorAll('.chat-option-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                const resp = RESPONSES[this.dataset.q];
                if (!resp) return;
                document.querySelectorAll('.chat-options').forEach(o => o.style.display = 'none');
                addMsg(resp.q, 'user');
                const typing = document.createElement('div');
                typing.className = 'chat-msg bot'; typing.id = 'typingIndicator';
                typing.innerHTML = `<div class="chat-bubble" style="padding:12px 18px;"><span style="display:flex;gap:5px;align-items:center;"><span style="width:7px;height:7px;background:#ddd;border-radius:50%;animation:dotBounce 1s infinite 0s"></span><span style="width:7px;height:7px;background:#ddd;border-radius:50%;animation:dotBounce 1s infinite 0.2s"></span><span style="width:7px;height:7px;background:#ddd;border-radius:50%;animation:dotBounce 1s infinite 0.4s"></span></span></div>`;
                chatbotMessages.appendChild(typing);
                chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
                setTimeout(() => {
                    document.getElementById('typingIndicator')?.remove();
                    addMsg(resp.a, 'bot');
                    setTimeout(() => {
                        const fu = document.createElement('div');
                        fu.className = 'chat-msg bot';
                        fu.innerHTML = `<div class="chat-bubble">¿Hay algo más en lo que pueda ayudarte? 😊</div><span class="chat-time">${getTime()}</span>`;
                        chatbotMessages.appendChild(fu);
                        const opts = document.getElementById('chatOptions');
                        if (opts) { opts.style.display = 'flex'; }
                        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
                    }, 400);
                }, 900);
            });
        });
    }
    bindOptionButtons();

    chatbotToggle.addEventListener('click', () => {
        chatbotWindow.classList.toggle('open');
        if (chatbotWindow.classList.contains('open')) {
            if (chatbotBadge) chatbotBadge.style.display = 'none';
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        }
    });
    if (chatbotClose) chatbotClose.addEventListener('click', () => chatbotWindow.classList.remove('open'));

    if (chatReset) {
        chatReset.addEventListener('click', () => {
            chatbotMessages.innerHTML = `
                <div class="chat-msg bot"><div class="chat-bubble">👋 ¡Hola! Soy el asistente del <strong>Heroico Cuerpo de Bomberos de Tapachula</strong>.<br><br>¿En qué te puedo ayudar hoy?</div><span class="chat-time">${getTime()}</span></div>
                <div class="chat-options" id="chatOptions" style="display:flex;flex-direction:column;gap:7px;">
                    <p class="options-label">Selecciona una pregunta:</p>
                    <button class="chat-option-btn" data-q="emergencia">🚨 ¿Cómo reportar una emergencia?</button>
                    <button class="chat-option-btn" data-q="telefono">📞 ¿Cuáles son sus teléfonos?</button>
                    <button class="chat-option-btn" data-q="ubicacion">📍 ¿Dónde están ubicados?</button>
                    <button class="chat-option-btn" data-q="servicios">🔥 ¿Qué servicios ofrecen?</button>
                    <button class="chat-option-btn" data-q="voluntariado">🙋 ¿Cómo ser voluntario?</button>
                    <button class="chat-option-btn" data-q="horario">🕐 ¿Cuál es su horario?</button>
                    <button class="chat-option-btn" data-q="donacion">❤️ ¿Cómo puedo donar?</button>
                </div>`;
            bindOptionButtons();
        });
    }

} // fin guard chatbot

/* ============ ESTILOS EXTRA JS ============ */
document.head.insertAdjacentHTML('beforeend', `<style>
@keyframes dotBounce { 0%,80%,100%{transform:translateY(0);background:#ccc} 40%{transform:translateY(-6px);background:#C62828} }
@keyframes fadeInUp  { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
</style>`);

/* ============ CARGA SUAVE DE IMÁGENES ============ */
document.querySelectorAll('img').forEach(img => {
    if (!img.complete) {
        img.style.opacity    = '0';
        img.style.transition = 'opacity 0.5s ease';
        img.addEventListener('load',  () => img.style.opacity = '1');
        img.addEventListener('error', () => img.style.opacity = '0.3');
    }
});
/* ============ MODAL DE EMERGENCIA ============ */
const emgFab     = document.getElementById('emgFab');
const emgOverlay = document.getElementById('emgOverlay');
const emgClose   = document.getElementById('emgClose');

if (emgFab && emgOverlay && emgClose) {
    emgFab.addEventListener('click', () => {
        emgOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    });
    emgClose.addEventListener('click', () => {
        emgOverlay.classList.remove('open');
        document.body.style.overflow = '';
    });
    emgOverlay.addEventListener('click', e => {
        if (e.target === emgOverlay) {
            emgOverlay.classList.remove('open');
            document.body.style.overflow = '';
        }
    });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            emgOverlay.classList.remove('open');
            document.body.style.overflow = '';
        }
    });
}
/* ============ DROPDOWN MENÚ ============ */
document.querySelectorAll('.has-dropdown > a').forEach(link => {
    link.addEventListener('click', function(e) {
        // Si el menú hamburguesa está visible, estamos en móvil
        const menuToggle = document.querySelector('.menu-toggle');
        const isMobile = menuToggle && getComputedStyle(menuToggle).display !== 'none';
        if (isMobile) {
            e.preventDefault();
            e.stopPropagation();
            const parent = this.parentElement;
            const isOpen = parent.classList.contains('open');
            document.querySelectorAll('.has-dropdown.open').forEach(el => el.classList.remove('open'));
            if (!isOpen) parent.classList.add('open');
        }
    });
});
// Cerrar dropdown al hacer click fuera (solo desktop)
document.addEventListener('click', function(e) {
    if (!e.target.closest('.has-dropdown')) {
        document.querySelectorAll('.has-dropdown.open').forEach(el => el.classList.remove('open'));
    }
});
/* ================================================
   TIEMPO DE RESPUESTA — Geolocalización real
   ================================================ */

// Coordenadas de la Estación Central de Bomberos Tapachula
const STATION = { lat: 14.909252, lng: -92.263682 };

function openResponseModal() {
    document.getElementById('rtOverlay').classList.add('active');
    document.getElementById('rtModal').classList.add('active');
    showState('init');
    document.body.style.overflow = 'hidden';
}

function closeResponseModal() {
    document.getElementById('rtOverlay').classList.remove('active');
    document.getElementById('rtModal').classList.remove('active');
    document.body.style.overflow = '';
}

function resetResponseModal() {
    showState('init');
}

function showState(state) {
    const states = ['Init', 'Loading', 'Result', 'Error'];
    states.forEach(s => {
        const el = document.getElementById('rtState' + s);
        if (el) el.classList.add('rt-hidden');
    });
    const target = document.getElementById('rtState' + state.charAt(0).toUpperCase() + state.slice(1));
    if (target) target.classList.remove('rt-hidden');
}

function requestLocation() {
    if (!navigator.geolocation) {
        showError('Tu navegador no soporta geolocalización. Intenta desde Chrome o Safari.');
        return;
    }
    showState('loading');
    document.getElementById('rtLoadingText').textContent = 'Obteniendo tu ubicación...';

    navigator.geolocation.getCurrentPosition(
        function(pos) {
            const userLat = pos.coords.latitude;
            const userLng = pos.coords.longitude;
            document.getElementById('rtLoadingText').textContent = 'Calculando ruta...';
            calculateRoute(userLat, userLng);
        },
        function(err) {
            let msg = 'No pudimos obtener tu ubicación.';
            if (err.code === 1) msg = 'Permiso de ubicación denegado. Por favor permite el acceso en tu navegador.';
            if (err.code === 2) msg = 'No se pudo determinar tu ubicación. Verifica tu conexión GPS.';
            if (err.code === 3) msg = 'La solicitud de ubicación tardó demasiado. Intenta de nuevo.';
            showError(msg);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
}

function calculateRoute(userLat, userLng) {
    const R = 6371;
    const dLat = (userLat - STATION.lat) * Math.PI / 180;
    const dLng = (userLng - STATION.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(STATION.lat * Math.PI / 180) * Math.cos(userLat * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const straightDist = R * c;

    const apiKey = '5b3ce3597851110001cf624847a551cb7e474c4da7d97a2ed2fb8fbd';
    const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${STATION.lng},${STATION.lat}&end=${userLng},${userLat}`;

    fetch(url)
        .then(res => { if (!res.ok) throw new Error('API error'); return res.json(); })
        .then(data => {
            const segment = data.features[0].properties.segments[0];
            const distKm = (segment.distance / 1000).toFixed(1);
            const durationMin = Math.ceil(segment.duration / 60);
            showResult(distKm, durationMin, false);
        })
        .catch(() => {
            const distKm = (straightDist * 1.35).toFixed(1);
            const durationMin = Math.ceil((straightDist * 1.35) / 35 * 60);
            showResult(distKm, durationMin, true);
        });
}

function animateTruck(durationMin) {
    const truck = document.getElementById('rtTruck');
    const line = truck.parentElement;
    if (!truck || !line) return;

    // Resetear posición
    truck.style.transition = 'none';
    truck.style.left = '0px';
    truck.classList.remove('arrived');

    // Duración de la animación: máximo 4s, mínimo 1.5s para que se vea bien
    const animDuration = Math.min(Math.max(durationMin * 0.3, 1.5), 4);
    const lineWidth = line.offsetWidth - 28;

    // Forzar reflow para que el reset aplique antes de arrancar
    truck.getBoundingClientRect();

    truck.style.transition = `left ${animDuration}s cubic-bezier(0.4, 0, 0.2, 1)`;
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            truck.style.left = lineWidth + 'px';
            // Al llegar, cambiar a verde
            setTimeout(() => {
                truck.classList.add('arrived');
            }, animDuration * 1000);
        });
    });
}

function showResult(distKm, durationMin, isFallback) {
    document.getElementById('rtDistance').textContent = distKm + ' km';
    document.getElementById('rtTime').textContent = '~' + durationMin + ' min';

    const msg = document.getElementById('rtMessage');
    let text = '';
    let cls = '';

    if (durationMin <= 5) {
        text = '✅ Los bomberos pueden llegar a tu ubicación en aproximadamente <strong>' + durationMin + ' minutos</strong>. Cobertura excelente.';
        cls = '';
    } else if (durationMin <= 10) {
        text = '⚠️ Tiempo de llegada estimado: <strong>' + durationMin + ' minutos</strong>. Cobertura aceptable para tu zona.';
        cls = 'rt-msg-warn';
    } else {
        text = '🚨 Tu ubicación está a <strong>' + durationMin + ' minutos</strong>. Si hay emergencia, llama al <strong>911</strong> de inmediato.';
        cls = 'rt-msg-far';
    }

    if (isFallback) {
        text += '<br><small style="opacity:0.7">*Estimación aproximada por distancia directa.</small>';
    }

    msg.innerHTML = text;
    msg.className = 'rt-message' + (cls ? ' ' + cls : '');

    showState('result');

    // Arrancar animación del camión sincronizada con el resultado
    requestAnimationFrame(() => animateTruck(durationMin));
}

function showError(message) {
    document.getElementById('rtErrorText').textContent = message;
    showState('error');
}

// Cerrar con Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeResponseModal();
});