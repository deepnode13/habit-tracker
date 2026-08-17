/**
 * Calendario circular.
 */
/**
 * Renderiza el calendario circular
 * de un mes.
 *
 * @param {Array<Object>} diasData
 * @param {number} mes
 * @param {number} anio
 * @param {number} porcentajeMensual
 * @return {string}
 */
function renderCircularCalendar(
  diasData,
  mes,
  anio,
  porcentajeMensual
) {

  const totalDias =
    new Date(
      anio,
      mes,
      0
    ).getDate();

  const diasMap =
    new Map(
      diasData.map(dia => [
        dia.fecha,
        dia
      ])
    );

  const nombreMes =
    getNombreMes(mes);

  const diasHtml = [];

  for (
    let dia = 1;
    dia <= totalDias;
    dia++
  ) {

    const fecha =
      crearFechaISO(
        anio,
        mes,
        dia
      );

    const data =
      diasMap.get(fecha);

    const posicion =
      calcularPosicionCircular(
        dia,
        totalDias
      );

    const clase =
      getCalendarDayClass(data);

    const descripcion =
      getCalendarDayDescription(
        data,
        dia,
        nombreMes
      );

    diasHtml.push(`
      <button
        class="
          calendar-day
          ${clase}
        "
        type="button"

        style="
          left: ${posicion.x}%;
          top: ${posicion.y}%;
        "

        data-date="${fecha}"

        aria-label="${
          escapeHtml(descripcion)
        }"

        title="${
          escapeHtml(descripcion)
        }"
      >
        ${dia}
      </button>
    `);
  }

  return `
    <section class="section">

      <div class="section-title">
        <h3>Calendario</h3>

        <span>
          ${escapeHtml(nombreMes)}
          ${anio}
        </span>
      </div>

      <div class="card calendar-card">

        <div class="circular-calendar">

          ${diasHtml.join('')}

          <div
            class="
              circular-calendar__center
            "
          >

            <span
              class="
                circular-calendar__month
              "
            >
              ${escapeHtml(nombreMes)}
            </span>

            <strong
              class="
                circular-calendar__percentage
              "
            >
              ${formatPercentage(
                porcentajeMensual
              )}
            </strong>

          </div>

        </div>

        ${renderCalendarLegend()}

      </div>

    </section>
  `;
}

/**
 * Calcula la posición de un día
 * alrededor del círculo.
 */
function calcularPosicionCircular(
  dia,
  totalDias
) {

  const anguloInicial =
    -90;

  const angulo =
    anguloInicial +
    (
      (dia - 1) /
      totalDias
    ) * 360;

  const radianes =
    angulo *
    Math.PI /
    180;

  const radio = 43;

  const x =
    50 +
    radio *
    Math.cos(radianes);

  const y =
    50 +
    radio *
    Math.sin(radianes);

  return {
    x,
    y
  };
}

function crearFechaISO(
  anio,
  mes,
  dia
) {

  const mm =
    String(mes)
      .padStart(2, '0');

  const dd =
    String(dia)
      .padStart(2, '0');

  return `${anio}-${mm}-${dd}`;
}

function getCalendarDayClass(
  dia
) {

  if (!dia) {
    return 'calendar-day--future';
  }

  if (dia.esPerfecto) {
    return 'calendar-day--perfect';
  }

  if (
    dia.estadoDia === 'ABIERTO'
  ) {
    return 'calendar-day--open';
  }

  if (
    dia.estadoDia === 'CERRADO' &&
    Number(dia.porcentaje) === 0
  ) {
    return 'calendar-day--failed';
  }

  if (
    dia.estadoDia === 'CERRADO'
  ) {
    return 'calendar-day--partial';
  }

  return 'calendar-day--future';
}

function getCalendarDayDescription(
  data,
  dia,
  nombreMes
) {

  if (!data) {

    return `${dia} de ${nombreMes}: sin registro`;
  }

  if (data.esPerfecto) {

    return `${dia} de ${nombreMes}: día perfecto`;
  }

  if (
    data.estadoDia === 'ABIERTO'
  ) {

    return (
      `${dia} de ${nombreMes}: ` +
      `día abierto, ` +
      `${formatPercentage(
        data.porcentaje
      )}`
    );
  }

  return (
    `${dia} de ${nombreMes}: ` +
    `${formatPercentage(
      data.porcentaje
    )}`
  );
}

function getNombreMes(mes) {

  const meses = [
    '',
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre'
  ];

  return meses[mes] || '';
}

function renderCalendarLegend() {

  return `
    <div class="calendar-legend">

      ${calendarLegendItem(
        'perfect',
        'Perfecto'
      )}

      ${calendarLegendItem(
        'partial',
        'Parcial'
      )}

      ${calendarLegendItem(
        'failed',
        'Fallado'
      )}

      ${calendarLegendItem(
        'open',
        'Abierto'
      )}

      ${calendarLegendItem(
        'future',
        'Sin registro'
      )}

    </div>
  `;
}


function calendarLegendItem(
  type,
  label
) {

  return `
    <span
      class="
        calendar-legend__item
      "
    >

      <span
        class="
          calendar-legend__dot
          calendar-legend__dot--${type}
        "
      ></span>

      ${escapeHtml(label)}

    </span>
  `;
}

function configurarEventosCalendario() {

  const botones =
    document.querySelectorAll(
      '.calendar-day'
    );

  console.log(
    'Días interactivos encontrados:',
    botones.length
  );

  botones.forEach(button => {

    button.addEventListener(
      'click',
      () => {

        const fecha =
          button.dataset.date;

        abrirDetalleDia(fecha);
      }
    );

  });
}
async function abrirDetalleDia(
  fecha
) {

  const modal =
    document.getElementById(
      'day-modal'
    );

  const content =
    document.getElementById(
      'day-modal-content'
    );

  const subtitle =
    document.getElementById(
      'day-modal-subtitle'
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

  subtitle.textContent =
    formatFechaHumana(
      fecha
    );

  content.innerHTML = `
    <div class="loading-state">
      Cargando detalle...
    </div>
  `;

  try {

    const detalle =
      await apiGetDetalleDia(
        fecha
      );

    renderDetalleDia(
      content,
      detalle
    );

  } catch (error) {

    console.error(
      'Error cargando detalle:',
      error
    );

    content.innerHTML = `
      <div class="error-state">
        No fue posible cargar
        el detalle del día.
      </div>
    `;
  }
}
function renderDetalleDia(
  container,
  detalle
) {

  const dia =
    detalle.dia;

  const registros =
    detalle.registros || [];

  if (
    !dia &&
    registros.length === 0
  ) {

    container.innerHTML = `
      <div class="empty-state">
        No existen registros
        para este día.
      </div>
    `;

    return;
  }

  const resumenHtml =
    dia
      ? `
        <div
          class="
            card
            card--padded
            day-detail-summary
          "
        >

          <span
            class="
              metric-card__label
            "
          >
            Cumplimiento
          </span>

          <div
            class="
              metric-card__value
            "
          >
            ${formatPercentage(
              dia.porcentaje
            )}
          </div>

          <div class="status-row">

            <span class="status-item">
              ✅ ${dia.cumplidos}
            </span>

            <span class="status-item">
              ❌ ${dia.noCumplidos}
            </span>

            <span class="status-item">
              ⬜ ${dia.pendientes}
            </span>

          </div>

        </div>
      `
      : '';

  container.innerHTML = `
    ${resumenHtml}

    <div class="card card--padded">

      <div class="day-detail-list">

        ${registros.map(
          registro =>
            renderDetalleRegistro(
              registro
            )
        ).join('')}

      </div>

    </div>
  `;
}
function renderDetalleRegistro(
  registro
) {

  const estado =
    getEstadoVisual(
      registro.estado
    );

  return `
    <div class="day-detail-item">

      <div
        class="
          day-detail-item__info
        "
      >

        <p
          class="
            day-detail-item__name
          "
        >
          ${escapeHtml(
            registro.nombre
          )}
        </p>

        <p
          class="
            day-detail-item__type
          "
        >
          ${escapeHtml(
            registro.tipo
          )}
        </p>

      </div>

      <span
        class="
          state-badge
          ${estado.clase}
        "
      >
        ${estado.icono}
        ${estado.texto}
      </span>

    </div>
  `;
}
function getEstadoVisual(
  estado
) {

  switch (estado) {

    case 'CUMPLIDO':
      return {
        clase:
          'state-badge--completed',
        icono:
          '✓',
        texto:
          'Cumplido'
      };

    case 'NO_CUMPLIDO':
      return {
        clase:
          'state-badge--failed',
        icono:
          '×',
        texto:
          'No cumplido'
      };

    case 'PENDIENTE':
      return {
        clase:
          'state-badge--pending',
        icono:
          '•',
        texto:
          'Pendiente'
      };

    case 'NO_APLICA':
      return {
        clase:
          'state-badge--na',
        icono:
          '−',
        texto:
          'No aplica'
      };

    default:
      return {
        clase:
          'state-badge--na',
        icono:
          '?',
        texto:
          estado
      };
  }
}

function formatFechaHumana(
  fecha
) {

  const [
    anio,
    mes,
    dia
  ] = fecha
    .split('-')
    .map(Number);

  return `${dia} de ${
    getNombreMes(mes)
  } de ${anio}`;
}

function configurarModalDia() {

  const modal =
    document.getElementById(
      'day-modal'
    );

  const closeButton =
    document.getElementById(
      'day-modal-close'
    );

  const backdrop =
    modal.querySelector(
      '[data-close-modal]'
    );

  const cerrar = () => {

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
  };

  closeButton.addEventListener(
    'click',
    cerrar
  );

  backdrop.addEventListener(
    'click',
    cerrar
  );

  document.addEventListener(
    'keydown',
    event => {

      if (
        event.key === 'Escape' &&
        modal.classList.contains(
          'is-open'
        )
      ) {
        cerrar();
      }

    }
  );
}


