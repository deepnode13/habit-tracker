/**
 * Pantalla de hábitos.
 */
let habitsLoadedPeriod = null;
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

const periodoKey =
  `${anio}-${mes}`;

if (
  habitsLoadedPeriod ===
    periodoKey &&
  container.dataset.loaded ===
    'true'
) {
  return;
}

function renderHabitos(
  container,
  habitos,
  rendimientoMap
) {

  habitsLoadedPeriod =
  periodoKey;

container.dataset.loaded =
  'true';

  const habitosHacer =
    habitos.filter(
      habito =>
        habito.tipo === 'HACER'
    );

  const habitosEvitar =
    habitos.filter(
      habito =>
        habito.tipo === 'EVITAR'
    );

  container.className = '';

  container.innerHTML = `
    ${renderGrupoHabitos(
      'HACER',
      'Hábitos que quieres construir',
      habitosHacer,
      rendimientoMap
    )}

    ${renderGrupoHabitos(
      'EVITAR',
      'Conductas que quieres evitar',
      habitosEvitar,
      rendimientoMap
    )}
  `;
}

function renderGrupoHabitos(
  tipo,
  descripcion,
  habitos,
  rendimientoMap
) {

  const titulo =
    tipo === 'HACER'
      ? 'Hacer'
      : 'Evitar';

  const icono =
    tipo === 'HACER'
      ? '✓'
      : '×';

  if (!habitos.length) {

    return `
      <section
        class="habits-group"
      >

        <div
          class="
            habits-group__header
          "
        >

          <h3
            class="
              habits-group__title
            "
          >
            ${icono}
            ${titulo}
          </h3>

          <span
            class="
              habits-group__count
            "
          >
            0 hábitos
          </span>

        </div>

        <div
          class="
            card
            empty-state
          "
        >
          No existen hábitos
          de este tipo.
        </div>

      </section>
    `;
  }

  return `
    <section
      class="habits-group"
    >

      <div
        class="
          habits-group__header
        "
      >

        <div>

          <h3
            class="
              habits-group__title
            "
          >
            ${icono}
            ${titulo}
          </h3>

          <span
            class="
              habits-group__count
            "
          >
            ${escapeHtml(
              descripcion
            )}
          </span>

        </div>

        <span
          class="
            habits-group__count
          "
        >
          ${habitos.length}
        </span>

      </div>

      ${habitos.map(
        habito =>
          renderHabitCard(
            habito,
            rendimientoMap.get(
              habito.idHabito
            )
          )
      ).join('')}

    </section>
  `;
}
function renderHabitCard(
  habito,
  rendimiento
) {

  const porcentaje =
    rendimiento
      ? rendimiento.porcentaje
      : 0;

  const tipoClase =
    habito.tipo === 'HACER'
      ? 'habit-type--do'
      : 'habit-type--avoid';

  const activoClase =
    habito.activo
      ? ''
      : 'habit-inactive';

  const estadoTexto =
    habito.activo
      ? 'Activo'
      : 'Inactivo';

  const estadoDot =
    habito.activo
      ? 'habit-status__dot--active'
      : 'habit-status__dot--inactive';

  return `
    <article
      class="
        card
        habit-card
        ${activoClase}
      "
    >

      <div
        class="
          habit-card__header
        "
      >

        <div
          class="
            habit-card__main
          "
        >

          <h4
            class="
              habit-card__title
            "
          >
            ${escapeHtml(
              habito.nombre
            )}
          </h4>

          ${
            habito.descripcion
              ? `
                <p
                  class="
                    habit-card__description
                  "
                >
                  ${escapeHtml(
                    habito.descripcion
                  )}
                </p>
              `
              : ''
          }

        </div>

        <span
          class="
            habit-type
            ${tipoClase}
          "
        >
          ${escapeHtml(
            habito.tipo
          )}
        </span>

      </div>


      <div
        class="
          habit-card__meta
        "
      >

        <span>
          ${formatFrecuenciaHabito(
            habito
          )}
        </span>

        <span>
          Inicio:
          ${formatFechaCorta(
            habito.fechaInicio
          )}
        </span>

        <span
          class="habit-status"
        >

          <span
            class="
              habit-status__dot
              ${estadoDot}
            "
          ></span>

          ${estadoTexto}

        </span>

      </div>


      <div
        class="
          habit-performance
        "
      >

        <div
          class="
            habit-performance__header
          "
        >

          <span
            class="
              habit-performance__label
            "
          >
            Rendimiento del mes
          </span>

          <span
            class="
              habit-performance__value
            "
          >
            ${formatPercentage(
              porcentaje
            )}
          </span>

        </div>

        <div class="progress">

          <div
            class="progress__bar"
            style="
              width:
              ${Math.min(
                Number(
                  porcentaje
                ) || 0,
                100
              )}%
            "
          ></div>

        </div>

      </div>

    </article>
  `;
}

function formatFrecuenciaHabito(
  habito
) {

  switch (
    habito.frecuencia
  ) {

    case 'DIARIO':
      return 'Todos los días';

    case 'DIAS_ESPECIFICOS':

      return habito.dias
        ? `Días: ${habito.dias}`
        : 'Días específicos';

    case 'VECES_SEMANA':

      return (
        `${habito.metaSemanal} ` +
        `veces por semana`
      );

    default:

      return habito.frecuencia;
  }
}

function formatFechaCorta(
  fecha
) {

  if (!fecha) {
    return '—';
  }

  const partes =
    fecha.split('-');

  if (
    partes.length !== 3
  ) {
    return fecha;
  }

  return (
    `${partes[2]}/` +
    `${partes[1]}/` +
    `${partes[0]}`
  );
}

function actualizarPeriodoHabitos(
  mes,
  anio
) {

  const element =
    document.getElementById(
      'habits-period'
    );

  if (!element) {
    return;
  }

  element.textContent =
    `${getNombreMes(mes)} ${anio}`;
}
