// Funciones personalizadas para el blog

// Función para manejar el scroll suave
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

// Función para lazy loading de imágenes
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

// Función para animar elementos al hacer scroll
function animateOnScroll() {
  const elements = document.querySelectorAll('.animate-on-scroll');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
      }
    });
  });

  elements.forEach(element => observer.observe(element));
}

// Función para mejorar el tiempo de carga
function improveLoadTime() {
  // Defer non-critical images
  const images = document.querySelectorAll('img:not([loading="lazy"])');
  images.forEach(img => img.setAttribute('loading', 'lazy'));

  // Defer non-critical CSS
  const styles = document.querySelectorAll('link[rel="stylesheet"]');
  styles.forEach(style => {
    if (!style.getAttribute('media')) {
      style.setAttribute('media', 'print');
      style.setAttribute('onload', "this.media='all'");
    }
  });
}

// Función para manejar el modo oscuro
function handleDarkMode() {
  const darkModeToggle = document.querySelector('.dark-mode-toggle');
  if (darkModeToggle) {
    darkModeToggle.addEventListener('click', () => {
      document.documentElement.classList.toggle('is-dark');
      localStorage.setItem('darkMode', 
        document.documentElement.classList.contains('is-dark')
      );
    });
  }
}

// Inicializar todas las funciones cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  smoothScroll();
  lazyLoadImages();
  animateOnScroll();
  improveLoadTime();
  handleDarkMode();
});
