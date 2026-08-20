/**
 * Pantalla de hábitos.
 */

async function cargarHabitos(
  mes,
  anio
) {

  const container =
    document.getElementById(
      'habits-content'
    );

  if (!container) {
    return;
  }

  container.className =
    'loading-state';

  container.innerHTML =
    'Cargando hábitos...';

  try {

    const [
      habitos,
      dashboard
    ] =
      await Promise.all([
        apiGetHabitos(
          mes,
          anio,
          false
        ),

        apiGetDashboard(
          mes,
          anio,
          '2026-08-18'
        )
      ]);

    const rendimientoMap =
      new Map(
        dashboard
          .rendimientoHabitos
          .map(item => [
            item.idHabito,
            item
          ])
      );

    renderHabitos(
      container,
      habitos,
      rendimientoMap
    );

    actualizarPeriodoHabitos(
      mes,
      anio
    );

  } catch (error) {

    console.error(
      'Error cargando hábitos:',
      error
    );

    container.className =
      'card error-state';

    container.innerHTML = `
      No fue posible cargar
      los hábitos.
      <br>
      ${escapeHtml(
        error.message
      )}
    `;
  }
}
