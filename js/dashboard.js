/**
 * Renderiza la pantalla Inicio.
 */

function renderDashboard(
  container,
  dashboard
) {

  const resumen =
    dashboard.resumenMensual;

  const hoy =
    dashboard.hoy;

  const rachas =
    dashboard.rachas;

  container.className = '';

  container.innerHTML = `
    <section class="section">

      <div class="card card--padded">

        <span class="metric-card__label">
          Cumplimiento mensual
        </span>

        <div class="metric-card__value">
          ${formatPercentage(
            resumen.porcentaje
          )}
        </div>

        <div class="progress">
          <div
            class="progress__bar"
            style="
              width:
              ${Math.min(
                Number(
                  resumen.porcentaje
                ) || 0,
                100
              )}%
            "
          ></div>
        </div>

        <p class="list-item__meta">
          ${resumen.cumplidos}
          de
          ${resumen.aplicables}
          objetivos cumplidos
        </p>

      </div>

    </section>

    ${renderCircularCalendar(
      dashboard.calendario,
      dashboard.periodo.mes,
      dashboard.periodo.anio,
      resumen.porcentaje
    )}


    <section class="section">

      <div class="metric-grid">

        ${metricCard(
          '🔥',
          'Racha actual',
          `${rachas.actual} días`
        )}

        ${metricCard(
          '🏆',
          'Mejor racha',
          `${rachas.mejor} días`
        )}

        ${metricCard(
          '⭐',
          'Días perfectos',
          resumen.diasPerfectos
        )}

        ${metricCard(
          '📅',
          'Días cerrados',
          resumen.diasCerrados
        )}

      </div>

    </section>


    ${renderTodayCard(hoy)}


    ${renderPendingSection(
      dashboard.pendientesHoy
    )}


    ${renderHabitPerformance(
      dashboard.rendimientoHabitos
    )}
  `;
}


function metricCard(
  icon,
  label,
  value
) {

  return `
    <div class="card metric-card">

      <span class="metric-card__label">
        ${icon} ${escapeHtml(label)}
      </span>

      <div class="metric-card__value">
        ${escapeHtml(value)}
      </div>

    </div>
  `;
}


function renderTodayCard(hoy) {

  if (!hoy) {

    return `
      <section class="section">

        <div class="section-title">
          <h3>Hoy</h3>
        </div>

        <div class="card empty-state">
          No existen registros para este día.
        </div>

      </section>
    `;
  }

  return `
    <section class="section">

      <div class="section-title">
        <h3>Hoy</h3>

        <span>
          ${escapeHtml(
            hoy.estadoDia
          )}
        </span>
      </div>

      <div class="card card--padded">

        <div class="metric-card__value">
          ${formatPercentage(
            hoy.porcentaje
          )}
        </div>

        <div class="progress">
          <div
            class="progress__bar"
            style="
              width:
              ${Math.min(
                Number(
                  hoy.porcentaje
                ) || 0,
                100
              )}%
            "
          ></div>
        </div>

        <div class="status-row">

          <div class="status-item">
            <span
              class="
                status-dot
                status-dot--success
              "
            ></span>

            ${hoy.cumplidos}
            cumplidos
          </div>

          <div class="status-item">
            <span
              class="
                status-dot
                status-dot--danger
              "
            ></span>

            ${hoy.noCumplidos}
            no cumplidos
          </div>

          <div class="status-item">
            <span
              class="
                status-dot
                status-dot--pending
              "
            ></span>

            ${hoy.pendientes}
            pendientes
          </div>

        </div>

      </div>

    </section>
  `;
}


function renderPendingSection(
  pendientes
) {

  if (!pendientes.length) {

    return `
      <section class="section">

        <div class="section-title">
          <h3>Pendientes</h3>
        </div>

        <div class="card empty-state">
          No tienes hábitos pendientes.
        </div>

      </section>
    `;
  }

  return `
    <section class="section">

      <div class="section-title">
        <h3>Pendientes</h3>

        <span>
          ${pendientes.length}
        </span>
      </div>

      <div class="card card--padded">

        <div class="list">

          ${pendientes.map(
            pendiente => `
              <div class="list-item">

                <div class="list-item__main">

                  <p class="list-item__title">
                    ${escapeHtml(
                      pendiente.nombre
                    )}
                  </p>

                  <p class="list-item__meta">
                    ${escapeHtml(
                      pendiente.tipo
                    )}
                  </p>

                </div>

                <span class="badge">
                  Pendiente
                </span>

              </div>
            `
          ).join('')}

        </div>

      </div>

    </section>
  `;
}


function renderHabitPerformance(
  habitos
) {

  return `
    <section class="section">

      <div class="section-title">
        <h3>
          Rendimiento por hábito
        </h3>
      </div>

      <div class="card card--padded">

        <div class="list">

          ${habitos.map(
            habito => `
              <div class="list-item">

                <div
                  class="list-item__main"
                  style="flex:1"
                >

                  <p class="list-item__title">
                    ${escapeHtml(
                      habito.nombre
                    )}
                  </p>

                  <div class="progress">
                    <div
                      class="progress__bar"
                      style="
                        width:
                        ${Math.min(
                          Number(
                            habito.porcentaje
                          ) || 0,
                          100
                        )}%
                      "
                    ></div>
                  </div>

                </div>

                <strong>
                  ${formatPercentage(
                    habito.porcentaje
                  )}
                </strong>

              </div>
            `
          ).join('')}

        </div>

      </div>

    </section>
  `;
}
