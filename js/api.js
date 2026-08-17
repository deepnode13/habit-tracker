/**
 * Capa de comunicación con Habit Tracker API.
 */

/**
 * Realiza una solicitud GET a Apps Script.
 *
 * @param {string} action
 * @param {Object} params
 * @return {Promise<Object>}
 */
async function apiGet(action, params = {}) {

  const url =
    new URL(
      APP_CONFIG.API_BASE_URL
    );

  url.searchParams.set(
    'action',
    action
  );

  Object.entries(params)
    .forEach(([key, value]) => {

      if (
        value !== undefined &&
        value !== null &&
        value !== ''
      ) {
        url.searchParams.set(
          key,
          value
        );
      }

    });

  const response =
    await fetch(url.toString());

  if (!response.ok) {
    throw new Error(
      `Error HTTP: ${response.status}`
    );
  }

  const data =
    await response.json();

  if (!data.success) {
    throw new Error(
      data.message ||
      'La API devolvió un error'
    );
  }

  return data;
}

/**
 * Obtiene los datos completos
 * de la pantalla Inicio.
 *
 * @param {number} mes
 * @param {number} anio
 * @param {string} fecha
 * @return {Promise<Object>}
 */
async function apiGetDashboard(
  mes,
  anio,
  fecha
) {

  const response =
    await apiGet(
      'getDashboard',
      {
        mes,
        anio,
        fecha
      }
    );

  return response.data;
}

/**
* Duda si esta parte va
*/
const dashboard =
  await apiGetDashboard(
    8,
    2026,
    '2026-08-18'
  );

/**
 * Obtiene hábitos.
 */
async function apiGetHabitos(
  mes,
  anio,
  soloActivos = true
) {

  const response =
    await apiGet(
      'getHabitos',
      {
        mes,
        anio,
        soloActivos
      }
    );

  return response.data;
}


/**
 * Obtiene configuración pública.
 */
async function apiGetConfiguracion() {

  const response =
    await apiGet(
      'getConfiguracion'
    );

  return response.data;
}
