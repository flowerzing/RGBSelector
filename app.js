const channels = ['red', 'green', 'blue'];
let savedColors = JSON.parse(localStorage.getItem('rgb-selector-colors') || '[]');

const getChannelValues = () => channels.map((channel) => {
  const input = document.querySelector(`#${channel}`);
  return Number(input.value);
});

const toHex = (value) => Math.round(value).toString(16).padStart(2, '0').toUpperCase();

const hexToRgb = (hex) => [
  parseInt(hex.slice(1, 3), 16),
  parseInt(hex.slice(3, 5), 16),
  parseInt(hex.slice(5, 7), 16),
];

const mixColors = (base, target, amount) => base.map((value, index) => value + (target[index] - value) * amount);

const createVariant = (hex, label) => {
  const button = document.createElement('button');
  button.className = 'variant-swatch';
  button.type = 'button';
  button.style.backgroundColor = hex;
  button.textContent = hex;
  button.setAttribute('aria-label', `Usar color ${hex} (${label})`);
  button.addEventListener('click', () => setColorFromHex(hex));
  return button;
};

const renderVariants = () => {
  const base = hexToRgb(document.querySelector('#preview-hex').textContent);
  const black = [0, 0, 0];
  const white = [255, 255, 255];
  const gray = [128, 128, 128];
  const amounts = [0, 0.2, 0.4, 0.6, 0.8, 1];
  const groups = { shades: black, tints: white, tones: gray };

  Object.entries(groups).forEach(([group, target]) => {
    const container = document.querySelector(`#${group}`);
    container.replaceChildren(...amounts.map((amount) => {
      const hex = `#${mixColors(base, target, amount).map(toHex).join('')}`;
      return createVariant(hex, group);
    }));
  });
};

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
  renderVariants();
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
