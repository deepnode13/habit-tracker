/**
 * Pantalla de hábitos.
 */

let habitsLoadedPeriod = null;
let habitsCurrentData = [];

/**
 * Carga los hábitos correspondientes
 * al mes y año indicados.
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


  // Evita volver a consultar la API
  // si este periodo ya fue cargado.
  const periodoKey =
    `${anio}-${mes}`;

  if (
    habitsLoadedPeriod === periodoKey &&
    container.dataset.loaded === 'true'
  ) {
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
      habitsCurrentData =
      habitos;

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
    configurarAccionesHabitos();


    habitsLoadedPeriod =
      periodoKey;

    container.dataset.loaded =
      'true';


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

function renderHabitos(
  container,
  habitos,
  rendimientoMap
) {

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

    ${habito.activo
  ? `
    <div
      class="habit-card__actions"
    >

      <button
        class="habit-action-button"
        type="button"
        data-edit-habit="${habito.idHabito}"
      >
        Editar
      </button>

      <button
        class="
          habit-action-button
          habit-action-button--danger
        "
        type="button"
        data-disable-habit="${habito.idHabito}"
      >
        Desactivar
      </button>

    </div>
  `
  : ''
}  
      
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

function configurarAccionesHabitos() {

  document
    .querySelectorAll(
      '[data-edit-habit]'
    )
    .forEach(button => {

      button.addEventListener(
        'click',
        () => {

          const id =
            button.dataset.editHabit;

          abrirModalEditarHabito(
            id
          );
        }
      );

    });


  document
    .querySelectorAll(
      '[data-disable-habit]'
    )
    .forEach(button => {

      button.addEventListener(
        'click',
        () => {

          const id =
            button.dataset.disableHabit;

          confirmarDesactivarHabito(
            id
          );
        }
      );

    });
}

function abrirModalNuevoHabito() {

  const form =
    document.getElementById(
      'habit-form'
    );

  form.reset();

  document.getElementById(
    'habit-id'
  ).value = '';

  document.getElementById(
    'habit-modal-title'
  ).textContent =
    'Nuevo hábito';

  document.getElementById(
    'habit-start-group'
  ).hidden = false;

  document.getElementById(
    'habit-start'
  ).value =
    '2026-08-20';

  actualizarCamposFrecuencia();

  mostrarHabitModal();
}

function abrirModalEditarHabito(
  idHabito
) {

  const habito =
    habitsCurrentData.find(
      item =>
        item.idHabito ===
        idHabito
    );

  if (!habito) {
    return;
  }

  document.getElementById(
    'habit-modal-title'
  ).textContent =
    'Editar hábito';

  document.getElementById(
    'habit-id'
  ).value =
    habito.idHabito;

  document.getElementById(
    'habit-name'
  ).value =
    habito.nombre;

  document.getElementById(
    'habit-description'
  ).value =
    habito.descripcion || '';

  document.getElementById(
    'habit-type'
  ).value =
    habito.tipo;

  document.getElementById(
    'habit-frequency'
  ).value =
    habito.frecuencia;

  document.getElementById(
    'habit-days'
  ).value =
    habito.dias || '';

  document.getElementById(
    'habit-weekly'
  ).value =
    habito.metaSemanal || '';

  document.getElementById(
    'habit-start-group'
  ).hidden = true;

  actualizarCamposFrecuencia();

  mostrarHabitModal();
}
function mostrarHabitModal() {

  const modal =
    document.getElementById(
      'habit-modal'
    );

  modal.classList.add(
    'is-open'
  );

  modal.setAttribute(
    'aria-hidden',
    'false'
  );

  document.body.classList.add(
    'modal-open'
  );
}


function cerrarHabitModal() {

  const modal =
    document.getElementById(
      'habit-modal'
    );

  modal.classList.remove(
    'is-open'
  );

  modal.setAttribute(
    'aria-hidden',
    'true'
  );

  document.body.classList.remove(
    'modal-open'
  );
}

function actualizarCamposFrecuencia() {

  const frecuencia =
    document.getElementById(
      'habit-frequency'
    ).value;

  document.getElementById(
    'habit-days-group'
  ).hidden =
    frecuencia !==
    'DIAS_ESPECIFICOS';

  document.getElementById(
    'habit-weekly-group'
  ).hidden =
    frecuencia !==
    'VECES_SEMANA';
}

function configurarModalHabitos() {

  const nuevoButton =
    document.getElementById(
      'new-habit-button'
    );

  const closeButton =
    document.getElementById(
      'habit-modal-close'
    );

  const cancelButton =
    document.getElementById(
      'habit-cancel'
    );

  const modal =
    document.getElementById(
      'habit-modal'
    );

  const backdrop =
    modal.querySelector(
      '[data-close-habit-modal]'
    );

  const frequency =
    document.getElementById(
      'habit-frequency'
    );

  const form =
    document.getElementById(
      'habit-form'
    );


  nuevoButton.addEventListener(
    'click',
    abrirModalNuevoHabito
  );


  closeButton.addEventListener(
    'click',
    cerrarHabitModal
  );


  cancelButton.addEventListener(
    'click',
    cerrarHabitModal
  );


  backdrop.addEventListener(
    'click',
    cerrarHabitModal
  );


  frequency.addEventListener(
    'change',
    actualizarCamposFrecuencia
  );


  form.addEventListener(
    'submit',
    guardarFormularioHabito
  );
}

async function guardarFormularioHabito(
  event
) {

  event.preventDefault();

  const idHabito =
    document.getElementById(
      'habit-id'
    ).value;

  const frecuencia =
    document.getElementById(
      'habit-frequency'
    ).value;

  const data = {

    nombre:
      document.getElementById(
        'habit-name'
      ).value.trim(),

    descripcion:
      document.getElementById(
        'habit-description'
      ).value.trim(),

    tipo:
      document.getElementById(
        'habit-type'
      ).value,

    frecuencia,

    dias:
      frecuencia ===
        'DIAS_ESPECIFICOS'
        ? document.getElementById(
            'habit-days'
          ).value.trim()
        : '',

    metaSemanal:
      frecuencia ===
        'VECES_SEMANA'
        ? Number(
            document.getElementById(
              'habit-weekly'
            ).value
          )
        : ''
  };


  try {

    if (idHabito) {

      await apiActualizarHabito(
        idHabito,
        data
      );

    } else {

      await apiCrearHabito({
        ...data,

        mes: 8,
        anio: 2026,

        fechaInicio:
          document.getElementById(
            'habit-start'
          ).value
      });
    }


    cerrarHabitModal();

    await recargarHabitos();

    await cargarInicio();


  } catch (error) {

    console.error(
      'Error guardando hábito:',
      error
    );

    window.alert(
      error.message
    );
  }
}

async function recargarHabitos() {

  const container =
    document.getElementById(
      'habits-content'
    );

  habitsLoadedPeriod = null;

  container.dataset.loaded =
    'false';

  await cargarHabitos(
    8,
    2026
  );
}

async function confirmarDesactivarHabito(
  idHabito
) {

  const habito =
    habitsCurrentData.find(
      item =>
        item.idHabito ===
        idHabito
    );

  if (!habito) {
    return;
  }

  const confirmar =
    window.confirm(
      `¿Desactivar "${habito.nombre}"?`
    );

  if (!confirmar) {
    return;
  }


  try {

    await apiDesactivarHabito(
      idHabito
    );

    await recargarHabitos();

    await cargarInicio();

  } catch (error) {

    console.error(
      'Error desactivando hábito:',
      error
    );

    window.alert(
      error.message
    );
  }
}
