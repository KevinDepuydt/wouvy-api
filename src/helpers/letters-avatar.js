import Canvas from 'canvas';

const colours = [
  '#1abc9c', '#2ecc71', '#3498db', '#9b59b6', '#34495e', '#16a085', '#27ae60', '#2980b9', '#8e44ad', '#2c3e50',
  '#f1c40f', '#e67e22', '#e74c3c', '#ecf0f1', '#95a5a6', '#f39c12', '#d35400', '#c0392b', '#bdc3c7', '#7f8c8d',
];
const getRandomColor = () => colours[Math.floor(Math.random() * (colours.length - 1))];
const size = 200;

export const getAvatarFromText = (text) => {
  const canvas = new Canvas(size, size);
  const context = canvas.getContext('2d');
  context.fillStyle = getRandomColor();
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.font = `bold ${Math.round(80)}px Arial`;
  context.textAlign = 'center';
  context.fillStyle = '#FFF';
  context.fillText(`${text[0]}${text[1]}`.toUpperCase(), size / 2, size / 1.5);
  return canvas.toDataURL();
};
