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
let apiWriteKeySession = null;
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

/**
 * Obtiene el detalle de una fecha.
 */
async function apiGetDetalleDia(
  fecha
) {

  const response =
    await apiGet(
      'getDetalleDia',
      {
        fecha
      }
    );

  return response.data;
}

function getApiWriteKey() {

  if (apiWriteKeySession) {
    return apiWriteKeySession;
  }

  const key =
    window.prompt(
      'Ingresa la clave de escritura de Habit Tracker'
    );

  if (!key) {
    throw new Error(
      'La operación fue cancelada'
    );
  }

  apiWriteKeySession =
    key.trim();

  return apiWriteKeySession;
}

async function apiPost(
  action,
  payload = {}
) {

  const apiKey =
    getApiWriteKey();

  const response =
    await fetch(
      APP_CONFIG.API_BASE_URL,
      {
        method: 'POST',

        headers: {
          'Content-Type':
            'text/plain;charset=utf-8'
        },

        body:
          JSON.stringify({
            action,
            apiKey,
            ...payload
          })
      }
    );

  if (!response.ok) {
    throw new Error(
      `Error HTTP: ${response.status}`
    );
  }

  const data =
    await response.json();

  if (!data.success) {

    if (
      data.error ===
      'NO_AUTORIZADO'
    ) {
      apiWriteKeySession = null;
    }

    throw new Error(
      data.message ||
      'La operación no pudo realizarse'
    );
  }

  return data;
}

async function apiCrearHabito(
  data
) {

  const response =
    await apiPost(
      'crearHabito',
      data
    );

  return response.data;
}


async function apiActualizarHabito(
  idHabito,
  cambios
) {

  const response =
    await apiPost(
      'actualizarHabito',
      {
        idHabito,
        ...cambios
      }
    );

  return response.data;
}


async function apiDesactivarHabito(
  idHabito
) {

  const response =
    await apiPost(
      'desactivarHabito',
      {
        idHabito
      }
    );

  return response.data;
}


