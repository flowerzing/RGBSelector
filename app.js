import {
  hexToRgb,
  hsvToRgb,
  mixColors,
  rgbToHsl,
  rgbToHsv,
  rgbToOklch,
  toHex,
} from './color-utils.js';

const channels = ['red', 'green', 'blue'];
let savedColors = JSON.parse(localStorage.getItem('rgb-selector-colors') || '[]');

const tailwindColors = [
  ['Slate 500', '#64748B'], ['Gray 500', '#6B7280'], ['Zinc 500', '#71717A'],
  ['Red 500', '#EF4444'], ['Orange 500', '#F97316'], ['Amber 500', '#F59E0B'],
  ['Yellow 500', '#EAB308'], ['Lime 500', '#84CC16'], ['Green 500', '#22C55E'],
  ['Emerald 500', '#10B981'], ['Teal 500', '#14B8A6'], ['Cyan 500', '#06B6D4'],
  ['Sky 500', '#0EA5E9'], ['Blue 500', '#3B82F6'], ['Indigo 500', '#6366F1'],
  ['Violet 500', '#8B5CF6'], ['Purple 500', '#A855F7'], ['Fuchsia 500', '#D946EF'],
  ['Pink 500', '#EC4899'], ['Rose 500', '#F43F5E'],
];

const getChannelValues = () => channels.map((channel) => {
  const input = document.querySelector(`#${channel}`);
  return Number(input.value);
});

const updateFormats = (rgb, hex) => {
  const [hue, saturation, lightness] = rgbToHsl(rgb);
  const [okLightness, okChroma, okHue] = rgbToOklch(rgb);
  document.querySelector('#format-hex').textContent = hex;
  document.querySelector('#format-rgb').textContent = `rgb(${rgb.join(', ')})`;
  document.querySelector('#format-hsl').textContent = `hsl(${Math.round(hue)}, ${Math.round(saturation * 100)}%, ${Math.round(lightness * 100)}%)`;
  document.querySelector('#format-oklch').textContent = `oklch(${okLightness.toFixed(2)} ${okChroma.toFixed(2)} ${Math.round(okHue)})`;
};

const updatePicker = () => {
  const hsv = rgbToHsv(getChannelValues());
  const hue = hsv[0];
  const area = document.querySelector('#picker-area');
  const handle = document.querySelector('#picker-handle');
  area.style.backgroundColor = `hsl(${hue} 100% 50%)`;
  handle.style.left = `${hsv[1] * 100}%`;
  handle.style.top = `${(1 - hsv[2]) * 100}%`;
  document.querySelector('#hue-slider').value = hue;
  document.querySelector('#picker-preview').style.backgroundColor = document.querySelector('#preview-hex').textContent;
};

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

const renderTailwindColors = () => {
  const container = document.querySelector('#tailwind-colors');
  tailwindColors.forEach(([name, hex]) => {
    const button = document.createElement('button');
    button.className = 'tailwind-swatch';
    button.type = 'button';
    button.style.backgroundColor = hex;
    button.innerHTML = `<strong>${name}</strong><small>${hex}</small>`;
    button.setAttribute('aria-label', `Usar color Tailwind ${name}`);
    button.addEventListener('click', () => setColorFromHex(hex));
    container.append(button);
  });
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
  updateFormats(values, hex);
  if (updateHexInput) document.querySelector('#hex-input').value = hex.slice(1);

  channels.forEach((channel) => {
    document.querySelector(`#${channel}-value`).textContent = document.querySelector(`#${channel}`).value;
  });
  updatePicker();
  renderVariants();
};

const setColorFromRgb = (values) => {
  channels.forEach((channel, index) => {
    document.querySelector(`#${channel}`).value = values[index];
  });
  updateColor();
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

const updateFromPickerPosition = (event) => {
  const area = document.querySelector('#picker-area');
  const bounds = area.getBoundingClientRect();
  const saturation = Math.min(1, Math.max(0, (event.clientX - bounds.left) / bounds.width));
  const value = Math.min(1, Math.max(0, 1 - (event.clientY - bounds.top) / bounds.height));
  setColorFromRgb(hsvToRgb([Number(document.querySelector('#hue-slider').value), saturation, value]));
};

document.querySelector('#picker-area').addEventListener('pointerdown', (event) => {
  event.currentTarget.setPointerCapture(event.pointerId);
  updateFromPickerPosition(event);
});

document.querySelector('#picker-area').addEventListener('pointermove', (event) => {
  if (event.buttons) updateFromPickerPosition(event);
});

document.querySelector('#hue-slider').addEventListener('input', (event) => {
  const [, saturation, value] = rgbToHsv(getChannelValues());
  setColorFromRgb(hsvToRgb([Number(event.target.value), saturation, value]));
});

document.querySelectorAll('.copy-format').forEach((button) => {
  button.addEventListener('click', async () => {
    const value = document.querySelector(`#${button.dataset.format}`).textContent;
    await navigator.clipboard.writeText(value);
    const originalLabel = button.textContent;
    button.textContent = 'Copiado';
    window.setTimeout(() => { button.textContent = originalLabel; }, 1200);
  });
});

const themeToggle = document.querySelector('#theme-toggle');
const savedTheme = localStorage.getItem('rgb-selector-theme');
if (savedTheme) document.documentElement.dataset.theme = savedTheme;

const updateThemeLabel = () => {
  const dark = document.documentElement.dataset.theme === 'dark';
  themeToggle.textContent = dark ? 'Modo claro' : 'Modo oscuro';
  themeToggle.setAttribute('aria-label', dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
};

themeToggle.addEventListener('click', () => {
  const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = nextTheme;
  localStorage.setItem('rgb-selector-theme', nextTheme);
  updateThemeLabel();
});

updateThemeLabel();

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
renderTailwindColors();
