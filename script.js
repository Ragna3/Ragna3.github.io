// =============================================
// HEROICO CUERPO DE BOMBEROS TAPACHULA
// Script principal — versión animada
// =============================================

/* ============ PRELOADER ============ */
(function () {
    const preloader = document.getElementById('preloader');
    const bar       = document.getElementById('preloaderBar');
    const percent   = document.getElementById('preloaderPercent');
    let progress    = 0;

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

menuToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('active');
    menuToggle.setAttribute('aria-expanded', isOpen);
});
document.querySelectorAll('#mainNav a').forEach(link => {
    link.addEventListener('click', () => {
        mainNav.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
    });
});

/* ============ HEADER SCROLL ============ */
const header = document.getElementById('mainHeader');
window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
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
window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 500);
}, { passive: true });
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

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
        chatbotBadge.style.display = 'none';
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
});
chatbotClose.addEventListener('click', () => chatbotWindow.classList.remove('open'));

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