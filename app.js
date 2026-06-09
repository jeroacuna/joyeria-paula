document.addEventListener("DOMContentLoaded", () => {
  
  // ==========================================
  // 1. ANIMACIONES Y NAVEGACIÓN (Tus funciones base)
  // ==========================================
  
  // Botón "Ver Más" del Inicio
  const btn = document.getElementById("verMasBtn");
  const extraInfo = document.getElementById("extraInfo");

  if (btn && extraInfo) {
    btn.addEventListener("click", () => {
      extraInfo.classList.toggle("d-none");
    });
  }

  // Intersection Observer para las animaciones suaves al hacer scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("section-visible");
      }
    });
  }, {
    threshold: 0.1
  });

  // Activamos el observer en las secciones ocultas
  document.querySelectorAll(".section-hidden").forEach(section => {
    observer.observe(section);
  });

  // Scroll suave para los links del menú de navegación
  document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", function(e) {
      e.preventDefault();
      const destino = document.querySelector(this.getAttribute("href"));
      if (destino) {
        destino.scrollIntoView({
          behavior: "smooth"
        });
      }
    });
  });

  // ==========================================
  // 2. LÓGICA DE CONSULTAS PERSONALIZADAS VÍA WHATSAPP
  // ==========================================
  
  // Inicializamos el modal flotante de Bootstrap usando su ID
  const modalElement = document.getElementById('modalReserva');
  const modalReserva = new bootstrap.Modal(modalElement);
  
  // Elementos dentro del modal donde inyectaremos datos dinámicos
  const itemNombreTxt = document.getElementById('itemReservaNombre');
  const itemPrecioTxt = document.getElementById('itemReservaPrecio');
  const formReserva = document.getElementById('formReserva');

  // Variables temporales para guardar los datos de la tarjeta clickeada
  let productoSeleccionado = "";
  let precioSeleccionado = "";

  // Escuchamos el click en CUALQUIER botón que tenga la clase '.btn-reservar'
  document.querySelectorAll('.btn-reservar').forEach(boton => {
    boton.addEventListener('click', function() {
      
      // Capturamos los atributos personalizados data- de la tarjeta seleccionada
      productoSeleccionado = this.getAttribute('data-nombre');
      precioSeleccionado = this.getAttribute('data-precio');

      // Modificamos el texto interno del modal para mostrar qué está consultando
      itemNombreTxt.textContent = productoSeleccionado;
      itemPrecioTxt.textContent = `$${precioSeleccionado}`;

      // Le pedimos a Bootstrap que abra el modal visualmente
      modalReserva.show();
    });
  });

  // Manejo del envío del formulario dentro del modal
  formReserva.addEventListener('submit', function(e) {
    e.preventDefault(); // Evitamos que la página se recargue y limpie las variables

    // Capturamos lo que escribió el usuario en los campos de texto
    const nombreCliente = document.getElementById('clienteNombre').value;
    const telefonoCliente = document.getElementById('clienteTelefono').value;

  //Numero de la joyeria al que se enviará el mensaje de WhatsApp (con código de país incluido, sin espacios ni guiones)
    const telefonoJoyeria = "5493436958831";  //Cambiar por el número real de la joyería

    // Armamos un mensaje charlado, fluido y adaptado a una joyería de autor
    const mensaje = `Hola Paula! ¿Cómo estás? Mi nombre es ${nombreCliente}.\n\n` +
                    `Estuve mirando tu página web y me encantó tu trabajo de joyería de autor. ` +
                    `Te quería consultar por la disponibilidad o detalles de: *${productoSeleccionado}*.\n\n` +
                    `¿Me podrías contar un poco más de cómo manejás los pedidos o cuándo arrancan los próximos espacios? ¡Muchas gracias!`;

    // Codificamos el texto para convertir los espacios y saltos de línea en caracteres válidos para una URL
    const mensajeCodificado = encodeURIComponent(mensaje);

    // Creamos el enlace final hacia la API de WhatsApp
    const urlWhatsApp = `https://api.whatsapp.com/send?phone=${telefonoJoyeria}&text=${mensajeCodificado}`;

    // Cerramos el modal de forma visual
    modalReserva.hide();
    
    // Limpiamos los inputs del formulario para una futura consulta
    formReserva.reset();

    // Redirigimos al usuario abriendo WhatsApp en una pestaña nueva
    window.open(urlWhatsApp, '_blank');
  });

});