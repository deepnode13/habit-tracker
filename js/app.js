/**
 * Punto de entrada del frontend.
 */

document.addEventListener(
  'DOMContentLoaded',
  () => {

    const status =
      document.getElementById(
        'status'
      );

    if (!APP_CONFIG.API_BASE_URL) {

      status.textContent =
        'API no configurada';

      return;
    }

    status.textContent =
      'Frontend cargado correctamente';

    console.log(
      'Habit Tracker iniciado'
    );

  }
);
