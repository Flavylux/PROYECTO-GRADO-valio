document.addEventListener('DOMContentLoaded', () => {
  // Año actual
  document.querySelectorAll('#year').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  // Manejar formulario de contacto
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formMessage = document.getElementById('form-message');
      formMessage.textContent = '¡Mensaje enviado! Gracias por tu contacto.';
      formMessage.style.color = '#86efac';
      setTimeout(() => {
        contactForm.reset();
        formMessage.textContent = '';
      }, 3000);
    });
  }
});
