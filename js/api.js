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
