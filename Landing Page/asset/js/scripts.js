/**
 * Script principal para el formulario de reservas de rafting
 * Implementa un sistema de acordeón para los participantes
 * con validación de datos y manejo de eventos.
 */

// Esperamos a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM que necesitamos
    const cantidadPersonas = document.getElementById('cantidad-personas');
    const seccionParticipantes = document.getElementById('seccion-participantes');
    const formulariosContainer = document.getElementById('formularios-participantes');
    const reservaForm = document.getElementById('reservaForm');
  
    // Ocultamos la sección de participantes inicialmente
    seccionParticipantes.style.display = 'none';
  
    // Evento cuando cambia el número de personas
    cantidadPersonas.addEventListener('change', function() {
      const numPersonas = parseInt(this.value);
      
      if (numPersonas > 0) {
        // Mostramos la sección de participantes
        seccionParticipantes.style.display = 'block';
        formulariosContainer.innerHTML = '';
  
        // Creamos un formulario por cada persona
        for (let i = 1; i <= numPersonas; i++) {
          crearFormularioParticipante(i);
        }
  
        // Configuramos los event listeners para los nuevos elementos
        configurarSelectsIdentificacion();
        configurarAcordeonParticipantes();
  
        // Expandimos automáticamente el primer participante
        if (numPersonas > 0) {
          const primerParticipante = document.querySelector('.participante-header');
          if (primerParticipante) {
            toggleFormularioParticipante(primerParticipante);
          }
        }
      } else {
        // Ocultamos la sección si no hay participantes
        seccionParticipantes.style.display = 'none';
      }
    });
  
    // Evento para enviar el formulario
    reservaForm.addEventListener('submit', function(e) {
      e.preventDefault();
      validarYEnviarFormulario();
    });
  
    /**
     * Crea el HTML para un participante
     * @param {number} index - Número del participante (1-based)
     */
    function crearFormularioParticipante(index) {
      const participanteHTML = `
        <div class="participante-item" id="participante-${index}">
          <div class="participante-header">
            <div class="participante-num">${index}</div>
            <div class="participante-titulo">Participante ${index}</div>
          </div>
          <div class="participante-form">
            <div class="participante-nombre">
              <input type="text" id="nombre-${index}" placeholder="Nombre" required>
              <input type="text" id="apellido-${index}" placeholder="Apellido" required>
            </div>
            <div class="participante-id">
              <select id="tipo-id-${index}" class="tipo-identificacion" required>
                <option value="">Tipo ID</option>
                <option value="rut">RUT</option>
                <option value="pasaporte">Pasaporte</option>
              </select>
              <input type="text" id="identificacion-${index}" placeholder="Número" required disabled>
            </div>
            <div class="participante-edad">
              <input type="number" id="edad-${index}" min="12" placeholder="Edad" required>
            </div>
            <div> 
                <input type="text" id="nacionalidad-${index}" placeholder="Nacionalidad" required>
            </div>
          </div>
        </div>
      `;
      formulariosContainer.insertAdjacentHTML('beforeend', participanteHTML);
    }
  
    /**
     * Configura los event listeners para los selects de identificación
     */
    function configurarSelectsIdentificacion() {
      document.querySelectorAll('.tipo-identificacion').forEach(select => {
        select.addEventListener('change', function() {
          const idNum = this.id.split('-')[2];
          const identificacionInput = document.getElementById(`identificacion-${idNum}`);
          identificacionInput.disabled = false;
          
          if (this.value === 'rut') {
            identificacionInput.placeholder = 'Ej: 12.345.678-9';
          } else {
            identificacionInput.placeholder = 'N° de Pasaporte';
          }
        });
      });
    }
  
    /**
     * Configura el comportamiento de acordeón para los participantes
     */
    function configurarAcordeonParticipantes() {
      document.querySelectorAll('.participante-header').forEach(header => {
        header.addEventListener('click', function() {
          toggleFormularioParticipante(this);
        });
      });
    }
  
    /**
     * Alterna (abre/cierra) el formulario de un participante
     * @param {HTMLElement} header - Elemento del encabezado clickeado
     */
    function toggleFormularioParticipante(header) {
      const item = header.parentElement;
      const form = header.nextElementSibling;
      
      // Cerrar todos los demás formularios
      document.querySelectorAll('.participante-form').forEach(f => {
        if (f !== form) {
          f.classList.remove('active');
          f.previousElementSibling.classList.remove('active');
        }
      });
      
      // Alternar el formulario actual
      header.classList.toggle('active');
      form.classList.toggle('active');
    }
  
    /**
     * Valida y envía el formulario
     */
    function validarYEnviarFormulario() {
      const fecha = document.getElementById('fecha').value;
      const seccion = document.getElementById('seccion').value;
      const horario = document.querySelector('input[name="horario"]:checked')?.value;
      const numPersonas = parseInt(cantidadPersonas.value);
      
      // Validaciones básicas
      if (!fecha || !seccion || !horario || isNaN(numPersonas) || numPersonas < 1) {
        alert('Por favor complete todos los datos generales');
        return;
      }
      
      // Recoger datos de participantes
      const participantes = [];
      let datosCompletos = true;
      
      for (let i = 1; i <= numPersonas; i++) {
        const nombre = document.getElementById(`nombre-${i}`)?.value;
        const apellido = document.getElementById(`apellido-${i}`)?.value;
        const tipoId = document.getElementById(`tipo-id-${i}`)?.value;
        const identificacion = document.getElementById(`identificacion-${i}`)?.value;
        const edad = document.getElementById(`edad-${i}`)?.value;
        
        // Validar campos obligatorios
        if (!nombre || !apellido || !tipoId || !identificacion || !edad) {
          datosCompletos = false;
          // Resaltar campos faltantes
          if (!nombre) document.getElementById(`nombre-${i}`).style.borderColor = 'red';
          if (!apellido) document.getElementById(`apellido-${i}`).style.borderColor = 'red';
          if (!tipoId) document.getElementById(`tipo-id-${i}`).style.borderColor = 'red';
          if (!identificacion) document.getElementById(`identificacion-${i}`).style.borderColor = 'red';
          if (!edad) document.getElementById(`edad-${i}`).style.borderColor = 'red';
          break;
        }
        
        participantes.push({
          nombre,
          apellido,
          tipoId,
          identificacion,
          edad: parseInt(edad)
        });
      }
      
      if (!datosCompletos) {
        alert('Por favor complete todos los datos de los participantes');
        return;
      }
      
      // Mostrar datos en consola (para depuración)
      console.log('Datos del formulario:', {
        fecha,
        seccion,
        horario,
        participantes
      });
      
      // Mensaje de éxito
      alert(`¡Reserva realizada con éxito para ${numPersonas} participantes!\n\nFecha: ${fecha}\nSección: ${seccion}\nHorario: ${horario}`);
      
      // Aquí iría el código para enviar los datos al servidor
      // enviarDatosAlServidor({ fecha, seccion, horario, participantes });
    }
  });