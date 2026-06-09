document.addEventListener("DOMContentLoaded", () => {
  
  // ==========================================
  // 1. ANIMACIONES Y NAVEGACIÓN BASE
  // ==========================================
  const btn = document.getElementById("verMasBtn");
  const extraInfo = document.getElementById("extraInfo");

  if (btn && extraInfo) {
    btn.addEventListener("click", () => {
      extraInfo.classList.toggle("d-none");
    });
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("section-visible");
      }
    });
  }, {
    threshold: 0.1
  });

  document.querySelectorAll(".section-hidden").forEach(section => {
    observer.observe(section);
  });

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
  // 2. SISTEMA DE CONSULTAS SÚPER CHARLADAS (WHATSAPP)
  // ==========================================
  const modalElement = document.getElementById('modalReserva');
  const modalReserva = new bootstrap.Modal(modalElement);
  
  const itemNombreTxt = document.getElementById('itemReservaNombre');
  const itemPrecioTxt = document.getElementById('itemReservaPrecio');
  const formReserva = document.getElementById('formReserva');

  let productoSeleccionado = "";
  let precioSeleccionado = "";

  document.querySelectorAll('.btn-reservar').forEach(boton => {
    boton.addEventListener('click', function() {
      productoSeleccionado = this.getAttribute('data-nombre');
      precioSeleccionado = this.getAttribute('data-precio');

      itemNombreTxt.textContent = productoSeleccionado;
      itemPrecioTxt.textContent = `$${precioSeleccionado}`;

      modalReserva.show();
    });
  });

  formReserva.addEventListener('submit', function(e) {
    e.preventDefault(); 

    const nombreCliente = document.getElementById('clienteNombre').value;
    const telefonoCliente = document.getElementById('clienteTelefono').value;

    const telefonoJoyeria = "5493436958831"; // <--- Cambiar por el real de Paula

    // Mensaje ultra fluido para romper el hielo y dar confianza
    const mensaje = `Hola Paula! ¿Cómo estás? Mi nombre es ${nombreCliente}.\n\n` +
                    `Estuve mirando tu web y te quería consultar por la disponibilidad o detalles de: *${productoSeleccionado}*.\n\n` +
                    `¿Me podrías contar un poco cómo manejás los pedidos de las piezas o si tenías stock disponible en este momento? ¡Muchas gracias!`;

    const mensajeCodificado = encodeURIComponent(mensaje);
    const urlWhatsApp = `https://api.whatsapp.com/send?phone=${telefonoJoyeria}&text=${mensajeCodificado}`;

    modalReserva.hide();
    formReserva.reset();
    window.open(urlWhatsApp, '_blank');
  });

  // ==========================================
  // 3. MOTOR DE FILTRADO DINÁMICO
  // ==========================================
  const botonesFiltro = document.querySelectorAll('.filter-btn');
  const productos = document.querySelectorAll('.product-item');

  botonesFiltro.forEach(boton => {
    boton.addEventListener('click', function() {
      const botonActivoAnterior = document.querySelector('.filter-btn.active');
      if (botonActivoAnterior) {
        botonActivoAnterior.classList.remove('active');
      }
      
      this.classList.add('active');

      const categoriaSeleccionada = this.getAttribute('data-filter');

      productos.forEach(producto => {
        const categoriaProducto = producto.getAttribute('data-categoria');

        if (categoriaSeleccionada === 'todos' || categoriaSeleccionada === categoriaProducto) {
          producto.style.display = 'block'; 
        } else {
          producto.style.display = 'none';  
        }
      });
    });
  });

});