// Tabs Queue/Watched
const refs = {
  controls: document.querySelector('[data-controls]'),
  panes: document.querySelector('[data-panes]'),
};

refs.controls.addEventListener('click', onControlsClick);

function onControlsClick(event) {
  event.preventDefault();

  if (event.target.nodeName !== 'A') {
    return;
  }

  const activeControlItem = document.querySelector('.controls__item--active');

  if (activeControlItem) {
    activeControlItem.classList.remove('controls__item--active');
    const paneId = getPaneId(activeControlItem);
    const pane = getPaneById(paneId);
    pane.classList.remove('pane--active');
  }

  const controlItem = event.target;
  controlItem.classList.add('controls__item--active');

  const paneId = getPaneId(controlItem);
  const pane = getPaneById(paneId);
  pane.classList.add('pane--active');
}

function getPaneId(control) {
  return control.getAttribute('href').slice(1);
}

function getPaneById(id) {
  return refs.panes.querySelector(`#${id}`);
}
