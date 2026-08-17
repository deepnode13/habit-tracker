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
