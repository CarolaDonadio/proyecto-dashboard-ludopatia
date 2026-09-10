// Lógica para capturar y enviar datos a Firestore

import { db } from "./firebase.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const selectAposto = document.getElementById('aposto');
const seccionSi = document.getElementById('seccion-si');
const seccionNo = document.getElementById('seccion-no');
const form = document.getElementById('form-ludopatia');

// Mostrar u ocultar preguntas condicionalmente según la respuesta
selectAposto.addEventListener('change', (e) => {
  if (e.target.value === 'Sí') {
    seccionSi.classList.remove('hidden');
    seccionNo.classList.add('hidden');
  } else if (e.target.value === 'No') {
    seccionNo.classList.remove('hidden');
    seccionSi.classList.add('hidden');
  }
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const aposto = selectAposto.value;
  
  // Construcción del objeto anónimo de datos
  const respuestaData = {
    edad: parseInt(document.getElementById('edad').value),
    sexo: document.getElementById('sexo').value,
    aposto: aposto,
    fecha: serverTimestamp() // Registro de fecha de envío
  };

  if (aposto === 'No') {
    respuestaData.detalle_no = {
      penso_hacerlo: document.getElementById('no_penso').value,
      haría_en_futuro: document.getElementById('no_futuro').value,
      motivo_no_apostar: document.getElementById('no_motivo').value,
      conoce_alguien: document.getElementById('no_conoce').value
    };
  } else if (aposto === 'Sí') {
    // Capturar checkboxes seleccionados
    const juegosChecked = Array.from(document.querySelectorAll('input[name="juegos"]:checked'))
                               .map(cb => cb.value);

    respuestaData.detalle_si = {
      tiempo_jugando: document.getElementById('si_tiempo').value,
      familia_sabe: document.getElementById('si_familia_sabe').value,
      motivo_inicio: document.getElementById('si_motivo').value,
      origen_dinero: document.getElementById('si_origen_dinero').value,
      monto_por_juego: document.getElementById('si_monto').value,
      horas_semanales: document.getElementById('si_horas').value,
      juegos_habituales: juegosChecked,
      destino_ganancia: document.getElementById('si_destino_ganancia').value,
      balance_ganancia_perdida: document.getElementById('si_balance').value
    };
  }

  try {
    // Guardar respuesta anónima en la colección 'encuestas'
    await addDoc(collection(db, "encuestas"), respuestaData);
    alert("¡Muchas gracias! Tu respuesta anónima ha sido registrada.");
    form.reset();
    seccionSi.classList.add('hidden');
    seccionNo.classList.add('hidden');
  } catch (error) {
    console.error("Error al registrar la encuesta: ", error);
    alert("Hubo un error al enviar tu respuesta. Por favor intenta de nuevo.");
  }
});