document.addEventListener(
  'DOMContentLoaded',
  iniciarApp
);


async function iniciarApp() {

  configurarNavegacion();

  configurarRefresh();
  configurarModalDia();

  await cargarInicio();
}


async function cargarInicio() {

  const container =
    document.getElementById(
      'home-content'
    );

  container.className =
    'loading-state';

  container.innerHTML =
    'Cargando datos...';

  try {

    const dashboard =
      await apiGetDashboard(
        8,
        2026,
        '2026-08-18'
      );

    console.log(
      'Dashboard recibido:',
      dashboard
    );

    document.getElementById(
      'home-period'
    ).textContent =
      'Agosto 2026';

    renderDashboard(
      container,
      dashboard
    );

  } catch (error) {

    console.error(error);

    container.className =
      'card error-state';

    container.innerHTML = `
      No fue posible cargar los datos.
      <br>
      ${escapeHtml(error.message)}
    `;
  }
}


function configurarRefresh() {

  const button =
    document.getElementById(
      'refresh-button'
    );

  button.addEventListener(
    'click',
    cargarInicio
  );
}


function configurarNavegacion() {

  const buttons =
    document.querySelectorAll(
      '.bottom-nav__item'
    );

  const pages =
    document.querySelectorAll(
      '.page'
    );

  buttons.forEach(button => {

    button.addEventListener(
      'click',
      () => {

        const target =
          button.dataset.page;

        buttons.forEach(item =>
          item.classList.remove(
            'is-active'
          )
        );

        pages.forEach(page =>
          page.classList.remove(
            'is-active'
          )
        );

        button.classList.add(
          'is-active'
        );

        const targetPage =
          document.getElementById(
            `page-${target}`
          );

        if (targetPage) {
          targetPage.classList.add(
            'is-active'
          );
        }
      }
    );

  });
}


function formatPercentage(value) {

  const numero =
    Number(value) || 0;

  return `${
    Number(
      numero.toFixed(1)
    )
  }%`;
}


function escapeHtml(value) {

  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
