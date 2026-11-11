const channels = ['red', 'green', 'blue'];

const getChannelValues = () => channels.map((channel) => {
  const input = document.querySelector(`#${channel}`);
  return Number(input.value);
});

const toHex = (value) => value.toString(16).padStart(2, '0').toUpperCase();

const updateColor = () => {
  const values = getChannelValues();
  const hex = `#${values.map(toHex).join('')}`;

  document.querySelector('#color-preview').style.backgroundColor = hex;
  document.querySelector('#preview-hex').textContent = hex;

  channels.forEach((channel) => {
    document.querySelector(`#${channel}-value`).textContent = document.querySelector(`#${channel}`).value;
  });
};

channels.forEach((channel) => {
  document.querySelector(`#${channel}`).addEventListener('input', updateColor);
});

updateColor();
