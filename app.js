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

  // Animación de aparición con Scroll (Intersection Observer)
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

  // Navegación con Scroll Suave (Smooth Scroll)
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
  // 2. SISTEMA DE CONSULTAS Y COMPRAS DINÁMICAS (WHATSAPP)
  // ==========================================
  const modalElement = document.getElementById('modalReserva');
  const modalReserva = new bootstrap.Modal(modalElement);
  const formReserva = document.getElementById('formReserva');
  
  // Elementos del modal que modificamos dinámicamente
  const modalTitulo = modalElement.querySelector('.modal-title');
  const btnSubmitModal = document.getElementById('btnSubmitModal');
  const contenedorTalle = document.getElementById('contenedorTalle');
  const clienteTalleInput = document.getElementById('clienteTalle');

  let productoSeleccionado = "";
  let precioSeleccionado = "";
  let tipoAccion = "consulta"; // Controla si es 'consulta' o 'compra'

  // --- NUEVO: LEER LOCALSTORAGE AL CARGAR LA PÁGINA ---
  // Intentamos obtener los datos guardados de visitas anteriores
  const nombreGuardado = localStorage.getItem('joyeria_cliente_nombre');
  const telefonoGuardado = localStorage.getItem('joyeria_cliente_telefono');

  // Si existen datos viejos, los autocompletamos en los inputs correspondientes
  if (nombreGuardado) document.getElementById('clienteNombre').value = nombreGuardado;
  if (telefonoGuardado) document.getElementById('clienteTelefono').value = telefonoGuardado;
  // ----------------------------------------------------

  // Escuchamos los clics en TODOS los botones con la clase .btn-reservar
  document.querySelectorAll('.btn-reservar').forEach(boton => {
    boton.addEventListener('click', function() {
      productoSeleccionado = this.getAttribute('data-nombre');
      precioSeleccionado = this.getAttribute('data-precio');
      
      // Capturamos el tipo si existe (compra), sino por defecto es consulta
      tipoAccion = this.getAttribute('data-tipo') || 'consulta';

      // Seteamos los textos fijos del producto en el modal
      document.getElementById('itemReservaNombre').textContent = productoSeleccionado;
      document.getElementById('itemReservaPrecio').textContent = `$${parseInt(precioSeleccionado).toLocaleString('es-AR')}`;

      // Configuración dinámica del Modal según la acción (Consulta vs Stock Inmediato)
      if (tipoAccion === 'compra') {
        modalTitulo.textContent = "Confirmar Compra (Stock Inmediato)";
        if (btnSubmitModal) btnSubmitModal.textContent = "Confirmar Compra vía WhatsApp";
        if (contenedorTalle) contenedorTalle.classList.remove('d-none'); // Mostramos campo de medidas
        if (clienteTalleInput) clienteTalleInput.setAttribute('required', 'true');
      } else {
        modalTitulo.textContent = "Iniciar Consulta por WhatsApp";
        if (btnSubmitModal) btnSubmitModal.textContent = "Enviar Consulta vía WhatsApp";
        if (contenedorTalle) contenedorTalle.classList.add('d-none'); // Ocultamos campo de medidas
        if (clienteTalleInput) clienteTalleInput.removeAttribute('required');
      }

      modalReserva.show();
    });
  });

  // Manejo del envío del formulario del modal
  if (formReserva) {
    formReserva.addEventListener('submit', function(e) {
      e.preventDefault();

      const nombreCliente = document.getElementById('clienteNombre').value;
      const telefonoCliente = document.getElementById('clienteTelefono').value;
      const talleCliente = clienteTalleInput ? clienteTalleInput.value : "";
      
      // --- NUEVO: GUARDAR EN LOCALSTORAGE ---
      // Guardamos el nombre y teléfono para que queden grabados en su navegador
      localStorage.setItem('joyeria_cliente_nombre', nombreCliente);
      localStorage.setItem('joyeria_cliente_telefono', telefonoCliente);
      // ---------------------------------------

      const telefonoJoyeria = "5493436958831"; 
      let mensaje = "";

      // Estructuramos el mensaje de WhatsApp según corresponda
      if (tipoAccion === 'compra') {
        mensaje = `¡Hola Paula! Mi nombre es *${nombreCliente}* (Tel: ${telefonoCliente}).\n\n` +
                  `Quiero *COMPRAR* el siguiente producto de stock inmediato:\n` +
                  `- Producto: *${productoSeleccionado}*\n` +
                  `- Medida enviada por el cliente: *${talleCliente}*\n` +
                  `- Precio: *$${parseInt(precioSeleccionado).toLocaleString('es-AR')}*\n\n` +
                  `¿Cómo podemos coordinar el pago y el retiro/envío? ¡Muchas gracias!`;
      } else {
        mensaje = `Hola Paula, mi nombre es *${nombreCliente}* (Tel: ${telefonoCliente}).\n\n` +
                  `Te escribo desde la web porque estoy interesado en obtener más información o detalles de: *${productoSeleccionado}*.\n\n` +
                  `¿Me podrías contar un poco cómo manejás los pedidos de las piezas o si tenías stock disponible en este momento? ¡Muchas gracias!`;
      }

      // Codificamos el texto para que sea válido dentro de una URL
      const mensajeCodificado = encodeURIComponent(mensaje);
      const urlWhatsApp = `https://api.whatsapp.com/send?phone=${telefonoJoyeria}&text=${mensajeCodificado}`;

      // Cerramos el modal, reseteamos los campos visibles y redirigimos a WhatsApp
      modalReserva.hide();
      formReserva.reset();
      
      // Volvemos a inyectar los datos guardados inmediatamente después del reset 
      // para que si abre otro modal en la misma sesión ya aparezcan completos
      document.getElementById('clienteNombre').value = nombreCliente;
      document.getElementById('clienteTelefono').value = telefonoCliente;

      window.open(urlWhatsApp, '_blank');
    });
  }

  // ==========================================
  // 3. MOTOR DE FILTRADO DINÁMICO DE PRODUCTOS
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

        // Si la categoría coincide o se seleccionó "todos", se muestra, de lo contrario se oculta
        if (categoriaSeleccionada === 'todos' || categoriaSeleccionada === categoriaProducto) {
          producto.style.display = 'block'; 
        } else {
          producto.style.display = 'none'; 
        }
      });
    });
  });

});