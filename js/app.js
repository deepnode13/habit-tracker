/**
 * Punto de entrada del frontend.
 */

document.addEventListener(
  'DOMContentLoaded',
  iniciarApp
);


/**
 * Inicializa Habit Tracker.
 */
async function iniciarApp() {

  const status =
    document.getElementById(
      'status'
    );

  const container =
    document.getElementById(
      'test-dashboard'
    );

  try {

    if (
      !APP_CONFIG.API_BASE_URL ||
      APP_CONFIG.API_BASE_URL.includes(
        'https://script.google.com/macros/s/AKfycbzqDpAhZIiB9KhdNdS10wK5B1hpB38wQ4P7n67qImWS2ldXUUzEdP4jW5126SC5yPgG/exec'
      )
    ) {
      throw new Error(
        'API_BASE_URL no está configurada'
      );
    }

    status.textContent =
      'Conectando con Google Sheets...';

    const dashboard =
      await apiGetDashboard(
        8,
        2026,
        '2026-08-18'
      );

    console.log(
      'Dashboard recibido:',
      dashboard
    );

    status.textContent =
      'Datos cargados correctamente';

    mostrarPruebaDashboard(
      container,
      dashboard
    );

  } catch (error) {

    console.error(
      'Error iniciando Habit Tracker:',
      error
    );

    status.textContent =
      'No fue posible cargar los datos';

    container.innerHTML = `
      <p>
        ${escapeHtml(error.message)}
      </p>
    `;

  }
}


/**
 * Muestra temporalmente algunos datos
 * para verificar la conexión.
 */
function mostrarPruebaDashboard(
  container,
  dashboard
) {

  const resumen =
    dashboard.resumenMensual;

  const hoy =
    dashboard.hoy;

  const rachas =
    dashboard.rachas;

  container.innerHTML = `
    <h2>
      Agosto 2026
    </h2>

    <p>
      Cumplimiento mensual:
      <strong>
        ${formatPercentage(
          resumen.porcentaje
        )}
      </strong>
    </p>

    <p>
      Racha actual:
      <strong>
        ${rachas.actual} días
      </strong>
    </p>

    <p>
      Mejor racha:
      <strong>
        ${rachas.mejor} días
      </strong>
    </p>

    <p>
      Cumplidos hoy:
      <strong>
        ${hoy ? hoy.cumplidos : 0}
      </strong>
    </p>

    <p>
      Pendientes hoy:
      <strong>
        ${hoy ? hoy.pendientes : 0}
      </strong>
    </p>

    <p>
      Hábitos recibidos:
      <strong>
        ${dashboard.habitos.length}
      </strong>
    </p>
  `;
}


/**
 * Formatea porcentajes sin mostrar
 * decimales innecesarios.
 */
function formatPercentage(value) {

  const numero =
    Number(value) || 0;

  return `${Number(
    numero.toFixed(1)
  )}%`;
}


/**
 * Evita insertar directamente texto
 * no controlado dentro del HTML.
 */
function escapeHtml(value) {

  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
