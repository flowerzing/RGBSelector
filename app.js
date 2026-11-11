const channels = ['red', 'green', 'blue'];
let savedColors = JSON.parse(localStorage.getItem('rgb-selector-colors') || '[]');

const getChannelValues = () => channels.map((channel) => {
  const input = document.querySelector(`#${channel}`);
  return Number(input.value);
});

const toHex = (value) => value.toString(16).padStart(2, '0').toUpperCase();

const updateColor = ({ updateHexInput = true } = {}) => {
  const values = getChannelValues();
  const hex = `#${values.map(toHex).join('')}`;

  document.querySelector('#color-preview').style.backgroundColor = hex;
  document.querySelector('#preview-hex').textContent = hex;
  document.querySelector('#color-picker').value = hex;
  if (updateHexInput) document.querySelector('#hex-input').value = hex.slice(1);

  channels.forEach((channel) => {
    document.querySelector(`#${channel}-value`).textContent = document.querySelector(`#${channel}`).value;
  });
};

const setColorFromHex = (value) => {
  const normalized = value.replace('#', '');
  if (!/^[0-9a-f]{6}$/i.test(normalized)) return;

  channels.forEach((channel, index) => {
    document.querySelector(`#${channel}`).value = parseInt(normalized.slice(index * 2, index * 2 + 2), 16);
  });
  updateColor({ updateHexInput: false });
};

channels.forEach((channel) => {
  document.querySelector(`#${channel}`).addEventListener('input', updateColor);
});

document.querySelector('#hex-input').addEventListener('input', (event) => {
  setColorFromHex(event.target.value);
});

document.querySelector('#color-picker').addEventListener('input', (event) => {
  setColorFromHex(event.target.value);
});

document.querySelector('#random-color').addEventListener('click', () => {
  channels.forEach((channel) => {
    document.querySelector(`#${channel}`).value = Math.floor(Math.random() * 256);
  });
  updateColor();
});

const renderSavedColors = () => {
  const container = document.querySelector('#saved-colors');
  const emptyMessage = document.querySelector('#empty-message');
  emptyMessage.hidden = savedColors.length > 0;
  document.querySelector('#saved-count').textContent = `${savedColors.length} ${savedColors.length === 1 ? 'color' : 'colores'}`;
  container.querySelectorAll('.saved-color').forEach((item) => item.remove());

  savedColors.forEach((hex, index) => {
    const item = document.createElement('div');
    item.className = 'saved-color';
    item.style.backgroundColor = hex;
    item.innerHTML = `<span>${hex}</span><button class="remove-color" data-index="${index}" type="button" aria-label="Eliminar ${hex}">×</button>`;
    container.append(item);
  });
};

document.querySelector('#save-color').addEventListener('click', () => {
  const hex = document.querySelector('#preview-hex').textContent;
  if (!savedColors.includes(hex)) {
    savedColors = [hex, ...savedColors];
    localStorage.setItem('rgb-selector-colors', JSON.stringify(savedColors));
    renderSavedColors();
  }
});

document.querySelector('#saved-colors').addEventListener('click', (event) => {
  const button = event.target.closest('.remove-color');
  if (!button) return;
  savedColors.splice(Number(button.dataset.index), 1);
  localStorage.setItem('rgb-selector-colors', JSON.stringify(savedColors));
  renderSavedColors();
});

updateColor();
renderSavedColors();
