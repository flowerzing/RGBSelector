const channels = ['red', 'green', 'blue'];

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

document.querySelector('#random-color').addEventListener('click', () => {
  channels.forEach((channel) => {
    document.querySelector(`#${channel}`).value = Math.floor(Math.random() * 256);
  });
  updateColor();
});

updateColor();
